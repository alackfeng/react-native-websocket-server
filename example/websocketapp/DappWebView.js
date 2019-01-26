
import React, { Component } from 'react';
import {View, StyleSheet, Text, Dimensions, Button} from 'react-native';
import { WebView } from 'react-native-webview';
import Base64 from "./Base64";

const { height, width } =  Dimensions.get('window');
const dappUrl1 = "http://192.168.0.238:8080/#/";
const dappUrl2 = "https://betdice.one/?ref=scatterrefer";
const dappUrl3 = "https://newdex.340wan.com/?channel=meetone";
const dappUrl4 = "https://meet.one/test/index.html";
const dappUrl = "https://eosbet.io/?ref=scatterrefer";
const dappUrl9 = "http://192.168.0.238:18080/";
const dappUrl7 = "https://game.wizards.one/#/wizards";

export default class DappWebView extends Component {

  constructor() {
    super();
    this.state = {
      progress: 0,
      show: false,
    }
  }

  handleNavigationStateChange = (navState) => {
    // console.log('handleNavigationStateChange: ', navState)
  }


  

  postMessage = (url) => {
    if(this.webview)
      this.webview.postMessage(url);
  }

  handleWebViewMessage = (e) => {
    console.log("handleWebViewMessage: ", e.nativeEvent.url, e.nativeEvent.data);
    const url = e.nativeEvent.data;

    if(!url) {
      console.error('handleWebViewMessage - url error ');
    }

    return;

    const ontprovider = 'ontprovider://ont.io?params=';
    if(0 === url.indexOf(ontprovider)) {

      let params = url.substring(ontprovider.length);
      params = JSON.parse(decodeURIComponent(atob(params)));
      console.log('parse, ', ontprovider, params);

      const result = {
        id: params.id,
        action: 'getAccount',
        "version": "v1.0.0",
        error: 0,
        desc: 'SUCCESS',
        result: 'AUEKhXNsoAT27HJwwqFGbpRy8QLHUMBMP' // User's address in base58 format
      };

      const msg = btoa(encodeURIComponent(JSON.stringify(result)));
      console.log('postMessage: msg ', msg);
      this.postMessage(msg);
    }

    const meetone = 'meetone://eos/transfer?params=';
    if(0 === url.indexOf(meetone)) {
      let params = url.substring(meetone.length);
      console.log('parse, ', meetone, params);
      console.log('parse, ', meetone, decodeURIComponent(Base64.atob(params)));
    }

    
    
  }

  render() {

    if(!this.state.show) {
      return (
        <View>
         <Button title="Show WebView" onPress={() => this.setState({show: !this.state.show})} />
        </View>
      );
    }

    return (
    <View style={{backgroundColor: 'transparent', flex: 1}}>
      <Text>DappWebView load progress: {this.state.progress*100}%</Text>
      <WebView
        ref={webview => { this.webview = webview; }}
        source={{ uri: dappUrl }}
        originWhitelist={"*"}
        onShouldStartLoadWithRequest={(e)=>{console.log('onShouldStartLoadWithRequest', e); return true;}}
        style={{ marginTop: 20, width, height }}
        onLoad={(e) => console.log('onLoad')}
        onLoadEnd={(e) => console.log('onLoadEnd')}
        onLoadStart={(e) => console.log('onLoadStart')}
        renderError={()=>{
          console.log('renderError')
          return <View><Text>renderError回调了，出现错误</Text></View>
        }}
        renderLoading={()=>{
          return <View><Text>这是自定义Loading...</Text></View>
        }}
        onNavigationStateChange={this.handleNavigationStateChange}
        onLoadProgress={e => this.setState({progress: e.nativeEvent.progress})}
        onMessage={this.handleWebViewMessage}
        onError={e => console.log('err: ', e)}
      />
    </View>
    );
  }
}