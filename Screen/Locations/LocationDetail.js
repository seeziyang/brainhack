import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
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
    };
  }

  componentDidMount() {
    this.listenToStore();
  }

  listenToStore = () => {
    const storeId = this.props.route.params.storeId;

    database()
      .ref(`/stores/${storeId}`)
      .on('value', snapshot => {
        console.log(snapshot.val());
        this.setState({ store: snapshot.val() ?? {} });
      });
  };

  joinQueue = () => {};

  render() {
    const { queue, storeInfo } = this.state.store;
    const { locAddress, locName, locPostalCode, locType } = storeInfo ?? {};

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
