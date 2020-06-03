import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Container, Content, Card, CardItem, Icon, Text } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

import database from '@react-native-firebase/database';

export default class MyQueues extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeQueues: {}, // { storeId: queueNo }
      stores: {}, // { storeId: {} }
    };
  }

  async componentDidMount() {
    await this.getActiveQueues();
    this.listenToStores();

    this.unsuscribeNavListener = this.props.navigation.addListener(
      'focus',
      async () => {
        this.unsuscribeDbListeners();
        await this.getActiveQueues();
        this.setState({ stores: {} });
        this.listenToStores();
      }
    );
  }

  componentWillUnmount() {
    this.unsuscribeDbListeners();
  }

  unsuscribeDbListeners = () => {
    for (const storeId in this.state.activeQueues) {
      database()
        .ref(`/stores/${storeId}`)
        .off();
    }
  };

  getActiveQueues = async () => {
    try {
      const activeQueuesString = await AsyncStorage.getItem('activeQueues');
      const activeQueues = (await JSON.parse(activeQueuesString)) ?? {};
      this.setState({ activeQueues });
    } catch (error) {
      console.log(error);
    }
  };

  listenToStores = () => {
    for (const storeId in this.state.activeQueues) {
      database()
        .ref(`/stores/${storeId}`)
        .on('value', snapshot => {
          this.setState({
            stores: { ...this.state.stores, [storeId]: snapshot.val() },
          });
          console.log(this.state.stores);
        });
    }
  };

  getNumQueuersInFront = (store, userQueueNo) => {
    let inQueueNumbers = Object.keys(store.queue?.inQueue ?? {});
    let userIndex = inQueueNumbers.indexOf(userQueueNo);
    if (userIndex === -1) {
      return 0; // should not happen
    } else {
      return userIndex;
    }
  };

  isUserLetIn = (store, userQueueNo) => {
    return store.queue?.inQueue?.[userQueueNo]?.status === 'letIn';
  };

  render() {
    const nav = this.props.navigation;

    return (
      <Container>
        <Content style={{ backgroundColor: 'rgb(40, 53, 147)' }}>
          <FlatList
            data={Object.entries(this.state.stores)}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Card>
                  <CardItem
                    button
                    onPress={() =>
                      nav.navigate('Location Detail', { storeId: item[0] })
                    }
                  >
                    <View style={styles.infoLine}>
                      <Text style={styles.locName}>
                        {item[1]?.storeInfo?.locName}
                      </Text>
                      {this.isUserLetIn(
                        item[1],
                        this.state.activeQueues[item[0]]
                      ) ? (
                        <Icon name="log-in" />
                      ) : (
                        <View style={{ flexDirection: 'row' }}>
                          <Text
                            style={{ ...styles.locName, marginHorizontal: 5 }}
                          >
                            {`${this.getNumQueuersInFront(
                              item[1],
                              this.state.activeQueues[item[0]]
                            )}`}
                          </Text>
                          <Icon name="walk" />
                        </View>
                      )}
                    </View>
                  </CardItem>
                </Card>
              </View>
            )}
            keyExtractor={item => item[0]}
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    // padding: 10,
  },
  card: {
    marginHorizontal: 10,
    marginVertical: 3,
  },
  infoLine: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    margin: 10,
  },
  button: {
    margin: 10,
  },
  locName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
