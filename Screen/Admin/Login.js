import React, { Component } from 'react';
import { StyleSheet, Alert } from 'react-native';
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
  Text,
} from 'native-base';

import auth from '@react-native-firebase/auth';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.authListener = auth().onAuthStateChanged(user => {
      if (user) {
        // sign in
        this.props.navigation.reset({
          index: 0,
          routes: [{ name: 'Admin' }],
        });
      }
    });

    this.state = {
      email: '',
      password: '',
    };
  }

  componentWillUnmount() {
    this.authListener(); // unsuscribe
  }

  login = () => {
    auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch(error => Alert.alert(error.message));
  };

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
              <Input
                onChangeText={password => this.setState({ password })}
                secureTextEntry
              />
            </Item>
          </Form>

          <Button block style={styles.button} onPress={this.login}>
            <Text>Login</Text>
          </Button>

          <Button
            block
            warning
            style={styles.button}
            onPress={() => nav.navigate('SignUp')}
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
  },
});
