import React, { Component } from 'react';
import { Alert, StyleSheet, View, Switch } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Text } from 'native-base';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export default class Queuers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isQueueActive: false,
      inQueue: {}
    }
  }

  componentDidMount() {
    console.log("mounted")
    this.listenToQueue()
  }

  // getStoreId = () => {
  //   let uid = auth().currentUser.uid;

  //   return database()
  //     .ref(`/admins/${uid}/storeId`)
  //     .once('value')
  //     .then(snapshot => {
  //       this.storeId = snapshot.val();
  //     })
  // }

  listenToQueue = () => {
    console.log("database")
    return database()
      .ref("stores")
      .once('value')
      .then(snapshot => {
        this.setState({ inQueue: snapshot.val() })
      });
  }

  // toggleQueueActive = () => {
  //   console.log(`/admins/${auth().currentUser.uid}/storeId`)
  //   console.log(this.state)
  //   console.log("storeID: " + this.storeId)
  //   const prevState = this.state.isQueueActive;
  //   this.setState({ isQueueActive: !prevState });
  // }


  render() {
    return (
      < Container >
        <Content style={styles.content}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Please queue up for</Text>
          </View>
          <React.Fragment>
            {Object.entries(this.state.inQueue).map(store => {
              return (<Text>{store[1]?.storeInfo?.locName}</Text>);
            })
            }

          </React.Fragment>







        </Content>
      </Container >
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
