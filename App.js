import React from 'react';

import { Button, Text, Icon, Footer, FooterTab } from "native-base";

import Stalls from './Screen/Stalls.js';
import Orders from './Screen/Orders.js';
import Me from './Screen/Me.js';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBar={TabBar}>
        <Tab.Screen name="Stalls" component={StallsStackNavigator} />
        <Tab.Screen name="Orders" component={OrdersStackNavigator} />
        <Tab.Screen name="Me" component={MeStackNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const TabBar = props => {
  return (
    <Footer>
      <FooterTab>
        <Button
          vertical
          active={props.state.index === 0}
          onPress={() => props.navigation.navigate("Stalls")}>
          <Icon name="bowtie" />
          <Text>Stalls</Text>
        </Button>
        <Button
          vertical
          active={props.state.index === 1}
          onPress={() => props.navigation.navigate("Orders")}>
          <Icon name="briefcase" />
          <Text>Orders</Text>
        </Button>
        <Button
          vertical
          active={props.state.index === 2}
          onPress={() => props.navigation.navigate("Me")}>
          <Icon name="headset" />
          <Text>Me</Text>
        </Button>
      </FooterTab>
    </Footer>
  );
}

const StallsStack = createStackNavigator();
const StallsStackNavigator = () => {
  return (
    <StallsStack.Navigator>
      <StallsStack.Screen name="Stalls" component={Stalls} />
    </StallsStack.Navigator>
  );
}

const OrdersStack = createStackNavigator();
const OrdersStackNavigator = () => {
  return (
    <OrdersStack.Navigator>
      <OrdersStack.Screen name="Orders" component={Orders} />
    </OrdersStack.Navigator>
  );
}

const MeStack = createStackNavigator();
const MeStackNavigator = () => {
  return (
    <MeStack.Navigator>
      <MeStack.Screen name="Me" component={Me} />
    </MeStack.Navigator>
  );
}

export default App;
