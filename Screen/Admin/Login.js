import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Text } from 'native-base';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    }
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
          </Form>

          <Button
            block
            style={styles.button}
            onPress={() => { }}
          >
            <Text>Login</Text>
          </Button>

          <Button
            block
            warning
            style={styles.button}
            onPress={() => nav.navigate("SignUp")}
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
