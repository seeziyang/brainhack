import React, { Component } from 'react';

import { View, Text, StyleSheet, Button } from 'react-native';

class Home extends Component {
  render() {
    return (
      <View>
        <Button title="asda" onPress={() => console.log("hi!!")} />
        <Text>Hi HELLO</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default Home;