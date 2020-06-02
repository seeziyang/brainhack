import React, { Component } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Text } from 'native-base';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import 'react-native-get-random-values'; // needed for uuidv4
import { v4 as uuidv4 } from 'uuid';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      locName: "",
      locType: "",
      locAddress: "",
      locPostalCode: "",
    }
  }

  addStoreToDb = adminUid => {
    const { locName, locType, locAddress, locPostalCode } = this.state;
    const storeId = uuidv4();

    database()
      .ref(`/admins/${adminUid}/storeId`)
      .set(storeId);

    database()
      .ref(`/stores/${storeId}/storeInfo`)
      .set({ locName, locType, locAddress, locPostalCode });
  }

  signUpAdmin = () => {
    if (!this.validateFields()) {
      return;
    }

    const email = this.state.email.trim();
    const password = this.state.password;

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredentials => this.addStoreToDb(userCredentials.user.uid))
      // navigate to admin screen by listener in Login page
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Email address is already in use!');
          return;
        }

        if (error.code === 'auth/invalid-email') {
          Alert.alert('Email address is invalid!');
          return;
        }

        console.log(error);
        Alert.alert(error.code);
      });
  }

  validateFields = () => {
    const {
      email,
      password,
      confirmPassword,
      locName,
      locType,
      locAddress,
      locPostalCode
    } = this.state;

    if (email.trim() === "") {
      Alert.alert("Email cannot be empty!");
      return false;
    }

    if (password === "") {
      Alert.alert("Password cannot be empty!");
      return false;
    }

    if (confirmPassword === "") {
      Alert.alert("Please re-enter your password to confirm!");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password does not match! Please double check!");
      return false;
    }

    if (locName === "" || locType === "" || locAddress === "" || locPostalCode === "") {
      Alert.alert("Incomplete location details!");
      return false;
    }

    if (locPostalCode.match(/^\d{6}$/) === null) {
      Alert.alert("Invalid postal code!")
      return false;
    }

    return true;
  }

  render() {
    const nav = this.props.navigation;

    return (
      <Container>
        <Content>
          <Form style={styles.form}>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input onChangeText={email => this.setState({ email })} />
            </Item>

            <Item floatingLabel>
              <Label>Password</Label>
              <Input onChangeText={password => this.setState({ password })} secureTextEntry />
            </Item>

            <Item floatingLabel>
              <Label>Confirm Password</Label>
              <Input onChangeText={confirmPassword => this.setState({ confirmPassword })} secureTextEntry />
            </Item>

            <Item floatingLabel>
              <Label>Location Name</Label>
              <Input onChangeText={locName => this.setState({ locName })} />
            </Item>

            <Item floatingLabel>
              <Label>Location Type</Label>
              <Input onChangeText={locType => this.setState({ locType })} />
            </Item>

            <Item floatingLabel>
              <Label>Location Address</Label>
              <Input onChangeText={locAddress => this.setState({ locAddress })} />
            </Item>

            <Item floatingLabel>
              <Label>Location Postal Code</Label>
              <Input onChangeText={locPostalCode => this.setState({ locPostalCode })} />
            </Item>
          </Form>

          <Button
            block
            warning
            style={styles.button}
            onPress={this.signUpAdmin}
          >
            <Text>Sign Up</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    margin: 10,
  },
  button: {
    margin: 10,
  }
})
