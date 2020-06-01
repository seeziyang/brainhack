import React, { Component } from 'react';

import { Footer, FooterTab, Button, Icon, Text } from 'native-base';

class MyFooter extends Component {
  render() {
    const currScreen = this.props.currScreen;
    const nav = this.props.navigation;
    const getOnPressHandler = screenName => () => nav.navigate(screenName);

    return (
      <Footer>
        <FooterTab>
          <Button
            vertical
            active={currScreen == "Stalls"}
            onPress={getOnPressHandler("Stalls")}
          >
            <Icon name="apps" />
            <Text>Stalls</Text>
          </Button>
          <Button
            vertical
            active={currScreen == "Orders"}
            onPress={getOnPressHandler("Orders")}
          >
            <Icon name="camera" />
            <Text>Orders</Text>
          </Button>
          <Button
            vertical
            active={currScreen == "Me"}
            onPress={getOnPressHandler("Me")}
          >
            <Icon active name="navigate" />
            <Text>Me</Text>
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}

export default MyFooter;