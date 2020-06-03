import React from 'react';

import { Button, Text, Icon, Footer, FooterTab } from 'native-base';
import { StyleSheet, View, Image } from 'react-native';

import Locations from './Screen/Locations/Locations.js';
import LocationDetail from './Screen/Locations/LocationDetail.js';
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
        <Tab.Screen name="User" component={UserStackNavigator} />
        <Tab.Screen name="Admin" component={AdminStackNavigator} />
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
          onPress={() => props.navigation.navigate('Locations')}
        >
          <Icon name="bowtie" />
          <View style={styles.container} />
          <Text>Locations</Text>
        </Button>

        <Button
          vertical
          active={props.state.index === 1}
          onPress={() => props.navigation.navigate('User')}
        >
          <Icon name="briefcase" />
          <Text>User</Text>
        </Button>

        <Button
          vertical
          active={props.state.index === 2}
          onPress={() => props.navigation.navigate('Admin')}
        >
          <Icon name="briefcase" />
          <Text>Admin</Text>
        </Button>
      </FooterTab>
    </Footer>
  );
};

const LocationsStack = createStackNavigator();
const LocationsStackNavigator = () => {
  return (
    <LocationsStack.Navigator>
      <LocationsStack.Screen
        style={styles.header}
        name="Location"
        component={Locations}
      />
      <LocationsStack.Screen name="LocationDetail" component={LocationDetail} />
    </LocationsStack.Navigator>
  );
};

const AdminStack = createStackNavigator();
const AdminStackNavigator = () => {
  return (
    <AdminStack.Navigator>
      <AdminStack.Screen name="Login" component={Login} />
      <AdminStack.Screen name="SignUp" component={SignUp} />
      <AdminStack.Screen name="Admin" component={Admin} />
    </AdminStack.Navigator>
  );
};

const UserStack = createStackNavigator();
const UserStackNavigator = () => {
  return (
    <UserStack.Navigator>
      <UserStack.Screen name="User" component={Queuers} />
    </UserStack.Navigator>
  );
};

export default App;

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
