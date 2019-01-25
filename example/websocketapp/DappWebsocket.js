
import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';

import RNWebsocketServer from 'react-native-websocket-server';


class DappWebsocket extends Component {


  constructor() {
    super();

    this.state = {
      show: 'init',
      ws: null,
      url: "ws://127.0.0.1:50005/",
      // url: "ws://192.168.0.238:50005/",
      RNServer: null,
    }
  }

  componentDidMount() {
    const RNServer = new RNWebsocketServer('0.0.0.0', 50005, (evt) => {
      console.log("RNServer::recv - ", typeof(evt), evt.event);
    });
    RNServer.start();
    console.log("RNServer::start - ");
    this.setState({RNServer})
  }

  sendMessage = () => {
    // this.state.ws.send('message-' + (Math.random()*255).toFixed(0))
    const typeJson = 1;
    const message = 'message-' + (Math.random()*255).toFixed(0);
    const json = {url: "a", data: ["ddd", "daa"]};
    this.state.ws.send(typeJson ? JSON.stringify(json) : message);
  }

  createWS = () => {
    
    var ws = new WebSocket(this.state.url);
    _This = this;
    ws.onopen = function(evt) {
      console.log("DappWebsocket::onopen - Connection open ...");
      ws.send("Hello WebSockets!");
    };
     
    ws.onmessage = function(evt) {
      console.log("DappWebsocket::onmessage - Received Message: " + evt.data);
      // ws.close();
      _This.setState({show: evt.data});
    };
     
    ws.onclose = function(evt) {
      console.log("DappWebsocket::onclose - Connection closed.");
    }
    this.setState({ws});
  }

  closeWS = () => {
    this.state.RNServer.stop();
  }

  render() {

    return (
      <View>
        <Text>DappWebsocket: {this.state.show}</Text>
        <TextInput 
          style={{height: 40, borderColor: 'gray', borderBottomWidth: 1, width: 300}}
          value={this.state.url} 
          onChangeText={(v) => this.setState({url: v})} 
        />
        <Button title={'Create'} onPress={this.createWS} />
        <Button title={'Send'} onPress={this.sendMessage} />
        <Button title={'Close'} onPress={this.closeWS} />
      </View>
    );
  }
}
export default DappWebsocket;

