import React, { Component } from 'react';
import { FlatList } from 'react-native';
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

export default class Locations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stores: {},
    };
  }

  componentDidMount() {
    this.listenToStores();
  }

  listenToStores = () => {
    database()
      .ref(`/stores`)
      .on('value', snapshot => {
        this.setState({ stores: snapshot.val() ?? {} });
      });
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
                    nav.navigate('LocationDetail', { storeId: item[0] })
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
