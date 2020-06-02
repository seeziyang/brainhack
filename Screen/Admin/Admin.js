import React, { Component } from 'react';
import { View, Switch, StyleSheet } from 'react-native';

import { Container, Content, Text, Button } from 'native-base';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export default class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isQueueActive: false,
      inQueue: {}
    }
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
      })
  }

  listenToQueue = () => {
    this.queueListener =
      database()
        .ref(`/stores/${this.storeId}/queue/inQueue`)
        .on('value', snapshot => {
          this.setState({ inQueue: snapshot.val() });
        })
  }

  toggleQueueActive = () => {
    console.log(`/admins/${auth().currentUser.uid}/storeId`)
    console.log(this.state)
    console.log("storeID: " + this.storeId)
    const prevState = this.state.isQueueActive;
    this.setState({ isQueueActive: !prevState });
  }

  signOut = () => {
    auth()
      .signOut()
      .then(() => {
        this.props.navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      });
  }

  render() {
    return (
      <Container>
        <Content style={styles.content}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Queue</Text>
            <Switch value={this.state.isQueueActive} onValueChange={this.toggleQueueActive} />
          </View>

          {this.state.isQueueActive &&
            Object.keys(this.state.inQueue).map(queueNo => {
              return (<Text>{queueNo}</Text>);
            })
          }

          <Button
            block
            style={styles.button}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold"
  },
  form: {
    margin: 10,
  },
  button: {
    margin: 10,
  }
})
