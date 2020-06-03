import React, { Component } from 'react';
import { FlatList, StyleSheet, View, Image } from 'react-native';
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
      <View style={styles.container}>
        <FlatList
          style={styles.feed}
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
                  <Text style={{ fontFamily: 'Iowan Old Style' }}>
                    {item[1]?.storeInfo?.locName}
                  </Text>
                  <CardItem cardBody>
                    <Image
                      source={{ uri: `${item[1]?.storeInfo?.image}` }}
                      style={{ height: 200, width: null, flex: 1 }}
                    />
                  </CardItem>
                </Body>
              </CardItem>
              <CardItem>
                <Left>
                  <Button transparent>
                    <Icon active name="navigate" />
                    <Text>{item[1]?.storeInfo?.locAddress}</Text>
                  </Button>
                </Left>
                <Body>
                  <Button transparent>
                    <Icon active name="chatbubbles" />
                    <Text>Reviews: {item[1]?.storeInfo?.reviews}</Text>
                  </Button>
                </Body>
                <Right>
                  <Text>11h ago</Text>
                </Right>
              </CardItem>
            </Card>
          )}
          keyExtractor={item => item[0]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBECF4',
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
  feedItem: {
    backgroundColor: '#FFF',
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
});
