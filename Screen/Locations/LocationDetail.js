import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
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
      <Container>
        <Content>
          <Card>
            <CardItem>
              <Text>{locName}</Text>
            </CardItem>

            <CardItem>
              <View>
                <Text>{locType}</Text>
                <Text>{locAddress}</Text>
                <Text>{locPostalCode}</Text>
              </View>
            </CardItem>
          </Card>

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
                <Text>
                  {isActive
                    ? `${numQueuers} person waiting in line`
                    : 'Location is not opened!'}
                </Text>

                {this.state.isUserInQueue && (
                  <View>
                    <Text>{`Your Queue No: ${this.state.userQueueNo}`}</Text>
                    <Text>{`There are ${this.getNumQueuersInFront()} person waiting in front of you.`}</Text>
                  </View>
                )}

                {this.state.isUserInQueue && this.isUserLetIn() && (
                  <View>
                    <Text>{`IT'S YOUR TURN, PLEASE ENTER THE LOCATION`}</Text>
                  </View>
                )}
              </View>
            </CardItem>
          </Card>

          {this.isUserLetIn() && (
            <Button
              rounded
              large
              iconLeft
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
});
