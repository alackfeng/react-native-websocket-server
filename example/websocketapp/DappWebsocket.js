
import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';

import RNWebsocketServer from 'react-native-websocket-server';
console.log('RNWebsocketServer: ', RNWebsocketServer);

const RNServer = new RNWebsocketServer('0.0.0.0', 15566);
console.log('RNWebsocketServer: ', RNServer.start());


class DappWebsocket extends Component {


  constructor() {
    super();

    this.state = {
      show: 'init',
      ws: null,
      // url: "ws://127.0.0.1:15566/"
      url: "ws://192.168.0.238:15566/"
    }
  }

  componentWillMount() {
    console.log('componentWillMount');
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
  }

  componentDidMount() {
    console.log('componentDiDMount');
    // var ws = new WebSocket(this.state.url);
    // _This = this;
    // ws.onopen = function(evt) {
    //   console.log("Connection open ...");
    //   ws.send("Hello WebSockets!");
    // };
     
    // ws.onmessage = function(evt) {
    //   console.log("Received Message: " + evt.data);
    //   // ws.close();
    //   _This.setState({show: evt.data});
    // };
     
    // ws.onclose = function(evt) {
    //   console.log("Connection closed.");
    // }

    // this.setState({ws});
  }

  sendMessage = () => {
    console.log('this.state.ws, ', this.state.ws);
    this.state.ws.send('message-' + (Math.random()*255).toFixed(0))
  }

  createWS = () => {
    
    console.log('url: ', this.state.url);
    var ws = new WebSocket(this.state.url);
    _This = this;
    ws.onopen = function(evt) {
      console.log("Connection open ...");
      ws.send("Hello WebSockets!");
    };
     
    ws.onmessage = function(evt) {
      console.log("Received Message: " + evt.data);
      // ws.close();
      _This.setState({show: evt.data});
    };
     
    ws.onclose = function(evt) {
      console.log("Connection closed.");
    }
    console.log('ws: ', ws);
    this.setState({ws});
  }

  closeWS = () => {

  }

  render() {

    return (
      <View>
        <Text>DappWebsocket: </Text>
        <TextInput 
          style={{height: 40, borderColor: 'gray', borderBottomWidth: 1, width: 300}}
          value={this.state.url} 
          onChangeText={(v) => this.setState({url: v})} 
        />
        <Button title={'Create'} onPress={this.createWS} />
        <Button title={'Send'} onPress={this.sendMessage} />
        <Button title={'Close'} onPress={this.closeWS} />
        <Text>{this.state.show}</Text>
      </View>
    );
  }
}
export default DappWebsocket;

