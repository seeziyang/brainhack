import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from 'native-base';
import database from '@react-native-firebase/database';

export default class LocationDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      store: {},
      isUserInQueue: false,
      userQueueNo: null,
    };
  }

  componentDidMount() {
    this.listenToStore();
  }

  componentWillUnmount() {
    const storeId = this.props.route.params.storeId;

    database()
      .ref(`/stores/${storeId}`)
      .off();
  }

  leaveQueue = async () => {
    const storeId = this.props.route.params.storeId;

    database()
      .ref(`/stores/${storeId}/queue/inQueue/${this.state.userQueueNo}`)
      .remove();

    await database()
      .ref(`/stores/${storeId}`)
      .off();

    try {
      const activeQueuesString = await AsyncStorage.getItem('activeQueues');
      const activeQueues = (await JSON.parse(activeQueuesString)) ?? {};
      delete activeQueues[storeId];
      await AsyncStorage.setItem('activeQueues', JSON.stringify(activeQueues));
    } catch (error) {
      console.log(error);
    }

    this.props.navigation.goBack();
  };

  listenToStore = () => {
    const storeId = this.props.route.params.storeId;

    database()
      .ref(`/stores/${storeId}`)
      .on('value', snapshot => {
        let store = snapshot.val();
        this.setState({ store: store ?? {} });
        this.validateIsUserInQueue(store);
      });
  };

  validateIsUserInQueue = async store => {
    const storeId = this.props.route.params.storeId;

    try {
      const activeQueuesString = await AsyncStorage.getItem('activeQueues');
      const activeQueues = (await JSON.parse(activeQueuesString)) ?? {};
      const queueNo = activeQueues[storeId];

      // exists in local storage
      if (queueNo) {
        // check if db exists
        // if doesnt exists, user was removed from queue
        if (store?.queue?.inQueue?.[queueNo]) {
          // still queueing in db
          this.setState({ isUserInQueue: true, userQueueNo: queueNo });
        } else {
          this.setState({ isUserInQueue: false }); // user removed from queue
          delete activeQueues[storeId];
          await AsyncStorage.setItem(
            'activeQueues',
            JSON.stringify(activeQueues)
          );
          Alert.alert('You were removed from the queue!');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  joinQueue = async () => {
    const storeId = this.props.route.params.storeId;

    const fcmToken = await AsyncStorage.getItem('fcmToken');

    database()
      .ref(`/stores/${storeId}/queue/`)
      .transaction(
        queue => {
          if (!queue) {
            queue = {};
          }

          const lastNum = queue.lastNum ?? 100;
          queue.lastNum = lastNum + 1;

          if (!queue.inQueue) {
            queue.inQueue = {};
          }
          queue.inQueue[lastNum + 1] = { fcmToken };

          return queue;
        },
        (error, commited, snapshot) => {
          let userQueueNo = snapshot.val()?.lastNum;
          this.setState({ isUserInQueue: true, userQueueNo: userQueueNo });
          this.saveToStorage(storeId, userQueueNo);
        }
      );
  };

  saveToStorage = async (storeId, queueNo) => {
    try {
      const activeQueuesString = await AsyncStorage.getItem('activeQueues');
      const activeQueues = (await JSON.parse(activeQueuesString)) ?? {};
      activeQueues[storeId] = queueNo;
      await AsyncStorage.setItem('activeQueues', JSON.stringify(activeQueues));
    } catch (error) {
      console.log(error);
    }
  };

  getNumQueuersInFront = () => {
    let inQueueNumbers = Object.keys(this.state.store.queue?.inQueue ?? {});
    let userIndex = inQueueNumbers.indexOf(this.state.userQueueNo);
    if (userIndex === -1) {
      return 0; // should not happen
    } else {
      return userIndex;
    }
  };

  isUserLetIn = () => {
    const { store, userQueueNo } = this.state;
    return store.queue?.inQueue?.[userQueueNo]?.status === 'letIn';
  };

  enterLocation = async () => {
    const storeId = this.props.route.params.storeId;

    // remove from db
    database()
      .ref(`/stores/${storeId}/queue/inQueue/${this.state.userQueueNo}`)
      .remove();

    // update local storage
    try {
      const activeQueuesString = await AsyncStorage.getItem('activeQueues');
      const activeQueues = (await JSON.parse(activeQueuesString)) ?? {};
      delete activeQueues[storeId];
      await AsyncStorage.setItem('activeQueues', JSON.stringify(activeQueues));
    } catch (error) {
      console.log(error);
    }

    // navigate back
    this.props.navigation.goBack();
  };

  render() {
    const { queue, storeInfo } = this.state.store;
    const { locAddress, locName, locPostalCode, locType } = storeInfo ?? {};
    const isActive = queue?.isActive ?? false;
    const numQueuers = Object.keys(queue?.inQueue ?? {}).length;

    return (
      <Container style={styles.container}>
        <Content style={styles.card}>
          <Text
            style={{
              fontFamily: 'Hiragino Sans',
              fontSize: 32,
              fontWeight: 'bold',
              justifyContent: 'center',
              textAlignVertical: 'center',
              textAlign: 'center',
              margin: 10,
            }}
          >
            {locName}
          </Text>

          {this.state.isUserInQueue && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                Text_Padding: 100,
                justifyContent: 'center',
                textAlignVertical: 'center',
                textAlign: 'center',
              }}
            >
              <Text
                style={styles.heavyText}
              >{`${this.getNumQueuersInFront()} person before you.`}</Text>
            </View>
          )}
          <Button
            rounded
            large
            success
            iconLeft
            disabled={this.state.isUserInQueue || !isActive}
            onPress={this.joinQueue}
            style={styles.queueButton}
          >
            <Icon
              ios="ios-walk"
              android="md-walk"
              style={styles.queueButtonText}
            />
            <Text style={styles.queueButtonText}>Queue</Text>
          </Button>

          <Card>
            <CardItem>
              <View>
                <View>
                  <Body>
                    <Text style={styles.text}>Type: {locType}</Text>
                    <Text style={styles.text}>Address: {locAddress}</Text>
                    <Text style={styles.text}>
                      Postal Code: {locPostalCode}
                    </Text>
                  </Body>
                </View>
              </View>
            </CardItem>
          </Card>

          <Card>
            <CardItem>
              <View>
                <Text style={styles.text}>
                  {isActive
                    ? `${numQueuers} person waiting in line`
                    : 'Location is not opened!'}
                </Text>

                {this.state.isUserInQueue && (
                  <View>
                    <Text style={styles.text}>{`Your Queue No: ${
                      this.state.userQueueNo
                    }`}</Text>
                    <Text
                      style={styles.text}
                    >{`There are ${this.getNumQueuersInFront()} person waiting in front of you.`}</Text>
                  </View>
                )}
              </View>
            </CardItem>
          </Card>

          {this.state.isUserInQueue && this.isUserLetIn() && (
            <View>
              <Text
                style={styles.heavyText}
              >{`It's your turn, please enter the location!`}</Text>
            </View>
          )}

          {this.isUserLetIn() && (
            <Button
              rounded
              large
              iconLeft
              info
              onPress={this.enterLocation}
              style={styles.queueButton}
            >
              <Icon
                ios="ios-walk"
                android="md-walk"
                style={styles.queueButtonText}
              />
              <Text style={styles.queueButtonText}>Entered</Text>
            </Button>
          )}

          {this.state.isUserInQueue && (
            <Button
              rounded
              large
              iconLeft
              danger
              onPress={this.leaveQueue}
              style={styles.queueButton}
            >
              <Icon
                ios="ios-close-circle-outline"
                android="md-close-circle-outline"
                style={styles.queueButtonText}
              />
              <Text style={styles.queueButtonText}>Leave</Text>
            </Button>
          )}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  queueButton: {
    margin: 10,
    width: Dimensions.get('window').width / 2,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  queueButtonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  container: {
    padding: 5,
  },
  heavyText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 5,
  },
  header: {
    paddingTop: 64,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EBECF4',
    shadowColor: '#454D65',
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
  },
  feed: {
    marginHorizontal: 16,
  },
  text: {
    fontSize: 20,
    margin: 5,
  },
  feedItem: {
    // backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 8,
    flexDirection: 'row',
    marginVertical: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 16,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    color: '#454D65',
  },
  timestamp: {
    fontSize: 11,
    color: '#C4C6CE',
    marginTop: 4,
  },
  post: {
    marginTop: 16,
    fontSize: 14,
    color: '#838899',
  },
  postImage: {
    width: undefined,
    height: 150,
    borderRadius: 5,
    marginVertical: 16,
  },
  card: {
    flex: 1,
    // borderRadius: 1,
    // borderWidth: 2,
    backgroundColor: 'white',
  },
});
