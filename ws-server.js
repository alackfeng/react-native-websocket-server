
import { NativeModules, DeviceEventEmitter } from 'react-native';

const { RNWebsocketServer } = NativeModules;

const callback_default = () => { console.warn('are you sure not contain callback ?') }


export default class WebsocketServer {  
  constructor (ipAddress = '127.0.0.0', port = 50005, callback = callback_default) {
    this.ipAddress  = ipAddress;
    this.port       = port;
    this.callback   = callback;
  }

  start () {
    RNWebsocketServer.start(this.ipAddress, this.port);
    DeviceEventEmitter.addListener('RNWebsocketServerResponeReceived', this.callback);
  }

  stop () {
    RNWebsocketServer.stop();
    DeviceEventEmitter.removeListener('RNWebsocketServerResponeReceived');
  }

  send(requestId, body) {
    RNWebsocketServer.send(requestId, body);
  }
}