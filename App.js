import React from 'react';

import { Button, Text, Icon, Footer, FooterTab } from "native-base";

import Locations from './Screen/Locations/Locations.js';
import Admin from './Screen/Admin/Admin.js';
import Login from './Screen/Admin/Login.js';
import SignUp from './Screen/Admin/SignUp.js';
import Queuers from './Screen/User/Queuers.js';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBar={TabBar}>
        <Tab.Screen name="Locations" component={LocationsStackNavigator} />
        <Tab.Screen name="Admin" component={AdminStackNavigator} />
        <Tab.Screen name="User" component={UserStackNavigator} />
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
          onPress={() => props.navigation.navigate("Locations")}>
          <Icon name="bowtie" />
          <Text>Locations</Text>
        </Button>
        <Button
          vertical
          active={props.state.index === 1}
          onPress={() => props.navigation.navigate("Admin")}>
          <Icon name="briefcase" />
          <Text>Admin</Text>
        </Button>

        <Button
          vertical
          active={props.state.index === 2}
          onPress={() => props.navigation.navigate("User")}>
          <Icon name="briefcase" />
          <Text>User</Text>
        </Button>

      </FooterTab>
    </Footer>
  );
}

const LocationsStack = createStackNavigator();
const LocationsStackNavigator = () => {
  return (
    <LocationsStack.Navigator>
      <LocationsStack.Screen name="Locations" component={Locations} />
    </LocationsStack.Navigator>
  );
}

const AdminStack = createStackNavigator();
const AdminStackNavigator = () => {
  return (
    <AdminStack.Navigator>
      <AdminStack.Screen name="Login" component={Login} />
      <AdminStack.Screen name="SignUp" component={SignUp} />
      <AdminStack.Screen name="Admin" component={Admin} />
    </AdminStack.Navigator>
  );
}


const UserStack = createStackNavigator();
const UserStackNavigator = () => {
  return (
    <UserStack.Navigator>
      <UserStack.Screen name="User" component={Queuers} />
    </UserStack.Navigator>
  );
}



export default App;
