import React, { Component } from 'react';

import { View, Text, StyleSheet } from 'react-native';

class Me extends Component {
  render() {
    return (
      <View>
        <Text>Me</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default Me;