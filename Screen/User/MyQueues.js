import React, { Component } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Container, Content, Card, CardItem, Body, Text } from 'native-base';
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

  render() {
    const nav = this.props.navigation;

    return (
      <Container>
        <Content>
          <FlatList
            data={Object.entries(this.state.stores)}
            renderItem={({ item }) => (
              <Card>
                <CardItem
                  button
                  onPress={() =>
                    nav.navigate('Location Detail', { storeId: item[0] })
                  }
                >
                  <Body>
                    <Text>{item[1]?.storeInfo?.locName}</Text>
                  </Body>
                </CardItem>
              </Card>
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
});
