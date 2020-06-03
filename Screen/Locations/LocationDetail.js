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

export default class LocationDetail extends Component {
  render() {
    const nav = this.props.navigation;

    return (
      <Container>
        <Content />
      </Container>
    );
  }
}
