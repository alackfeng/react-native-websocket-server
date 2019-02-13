
import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';

import RNWebsocketServer, {ScatterServer} from 'react-native-websocket-server';


class DappWebsocket extends Component {


  constructor() {
    super();

    this.state = {
      show: 'init',
      ws: null,
      url: "ws://127.0.0.1:50005/",
      // url: "ws://192.168.0.238:50005/",
      RNServer: null,
      typeJson: 1,
    }
  }

  componentDidMount() {

   
    // this.startWS(); 
  }

  sendMessage = () => {
    // this.state.ws.send('message-' + (Math.random()*255).toFixed(0))
    const typeJson = this.state.typeJson;
    const message = 'message-' + (Math.random()*255).toFixed(0);
    const json = {url: this.state.url, data: ["test", message]};
    this.state.ws.send(typeJson ? JSON.stringify(json) : message);
  }


  matchUrl = () => {
    const match = /^(ws?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i;
    const urlMatch = match.exec(this.state.url);
    const ipserver = urlMatch[2] || '127.0.0.1';
    const ipport = +(urlMatch[3].substring(1)) || 50005;
    
    return {ipserver, ipport};
  }

  startScatterServerWS = () => {
    
    const {ipserver, ipport} = this.matchUrl();
    const RNServer = new ScatterServer(ipserver, ipport, (evt, cb) => {
      console.log("DappWebsocket::startScatterServerWS::recv - ", evt);
      // RNServer.send('requestid', evt.data)
      cb(evt.id, 'SIG_K1_KUtE54b88SQppgSGvyQM44ejjXyY6HjJM7i1uEDGFJU4WyJTCEht4bMW79Nw9jiEpXyeMnqruWnWcp2bnuEwCoDzkTv4Dg');
    });
    RNServer.start();
    console.log("RNServer::start - ", ipserver, ipport);
    this.setState({RNServer, show: 'Scatter Server started'})

  }

  startServerWS = () => {

    const {ipserver, ipport} = this.matchUrl();
    const RNServer = new RNWebsocketServer(ipserver, ipport, (evt) => {
      // console.log("RNServer::recv - ", evt);
      RNServer.send('requestid', evt.data)
    });
    RNServer.start();
    console.log("RNServer::start - ", ipserver, ipport);
    this.setState({RNServer, show: 'Server started'})
  }

  createWS = () => {
    
    var ws = new WebSocket(this.state.url);
    _This = this;
    ws.onopen = function(evt) {
      console.log("DappWebsocket::onopen - Connection open ...");
      // ws.send("Hello WebSockets!");
    };
     
    ws.onmessage = function(evt) {
      // console.log("DappWebsocket::onmessage - Received Message: " + evt.data);
      _This.setState({show: evt.data});
    };
     
    ws.onclose = function(evt) {
      console.log("DappWebsocket::onclose - Connection closed.");
      _This.setState({show: evt.data});
    }
    this.setState({ws});
  }

  closeWS = () => {
    this.state.RNServer.stop();
  }

  render() {

    return (
      <View>
      <TextInput 
          style={{height: 40, borderColor: 'gray', borderBottomWidth: 1, width: 300}}
          value={this.state.url} 
          onChangeText={(v) => this.setState({url: v})} 
        />
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <Button title={'Scatter'} onPress={this.startScatterServerWS} />
          <Button title={'Server'} onPress={this.startServerWS} />
          <Button title={'Create'} onPress={this.createWS} />
          <Button title={'Send'} onPress={this.sendMessage} />
          <Button title={'Close'} onPress={this.closeWS} />
        </View>
        <Text style={{color: 'red'}}>Tips: {this.state.show}</Text>
        
        
      </View>
    );
  }
}
export default DappWebsocket;

