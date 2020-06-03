import React, { Component } from 'react';
import { View, Switch, StyleSheet, Dimensions, FlatList } from 'react-native';

import { Container, Content, Text, Button, Icon } from 'native-base';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export default class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isQueueActive: true,
      inQueue: {},
    };
  }

  componentDidMount() {
    this.getStoreId().then(this.listenToQueue);
  }

  getStoreId = () => {
    let uid = auth().currentUser.uid;

    return database()
      .ref(`/admins/${uid}/storeId`)
      .once('value')
      .then(snapshot => {
        this.storeId = snapshot.val();
      });
  };

  listenToQueue = () => {
    this.queueListener = database()
      .ref(`/stores/${this.storeId}/queue/inQueue`)
      .on('value', snapshot => {
        this.setState({ inQueue: snapshot.val() ?? {} });
      });
  };

  toggleQueueActive = () => {
    const prevState = this.state.isQueueActive;
    this.setState({ isQueueActive: !prevState });

    database()
      .ref(`/stores/${this.storeId}/queue/isActive`)
      .set(!prevState);

    // TODO: delete queue info?
  };

  signOut = () => {
    auth()
      .signOut()
      .then(() => {
        this.props.navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      });
  };

  letIn = queueNo => {
    database()
      .ref(`/stores/${this.storeId}/queue/inQueue/${queueNo}/status`)
      .set('letIn');
  };

  letInNext = () => {
    const queue = this.state.inQueue;
    for (const queueNo in queue) {
      if (queue[queueNo]?.status !== 'letIn') {
        this.letIn(queueNo);
        return;
      }
    }
  };

  removeFromQueue = queueNo => {
    database()
      .ref(`/stores/${this.storeId}/queue/inQueue/${queueNo}`)
      .remove();
  };

  renderQueue = () => {
    return (
      <View>
        <Button
          rounded
          large
          success
          iconLeft
          disabled={Object.keys(this.state.inQueue).length === 0}
          onPress={this.letInNext}
          style={styles.nextButton}
        >
          <Icon
            ios="ios-walk"
            android="md-walk"
            style={styles.nextButtonText}
          />
          <Text style={styles.nextButtonText}>Next</Text>
        </Button>

        <Text style={styles.text}>
          {`Waiting in line: ${Object.keys(this.state.inQueue).length}`}
        </Text>

        <FlatList
          data={Object.entries(this.state.inQueue)}
          renderItem={({ item }) => (
            <Button
              info={item[1]?.status === 'letIn'}
              style={styles.queueNoButton}
              onPress={() => this.letIn(item[0])}
              onLongPress={() => this.removeFromQueue(item[0])}
            >
              <Text>{item[0]}</Text>
            </Button>
          )}
          keyExtractor={item => item[0].toString()}
          numColumns={4}
          contentContainerStyle={styles.queueNoButtonList}
        />
      </View>
    );
  };

  render() {
    return (
      <Container>
        <Content style={styles.content}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Queue</Text>
            <Switch
              value={this.state.isQueueActive}
              onValueChange={this.toggleQueueActive}
            />
          </View>

          {this.state.isQueueActive && this.renderQueue()}

          <Button
            block
            warning
            style={styles.signOutButton}
            onPress={this.signOut}
          >
            <Text>Sign Out</Text>
          </Button>
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
  text: {
    margin: 10,
    fontSize: 20,
    textAlign: 'center',
  },
  nextButton: {
    margin: 10,
    width: Dimensions.get('window').width / 2,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  nextButtonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  queueNoButtonList: {},
  queueNoButton: {
    margin: 10,
    minWidth: '20%',
    justifyContent: 'center',
  },
  signOutButton: {
    margin: 10,
  },
});
