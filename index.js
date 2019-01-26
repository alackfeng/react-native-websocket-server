
import { NativeModules, DeviceEventEmitter } from 'react-native';

const { RNWebsocketServer } = NativeModules;

const callback_default = () => { console.warn('are you sure not contain callback ?') }


export default class WebsocketServer {  
  constructor (ipAddress = '127.0.0.0', port = 50005, callback = callback_default) {
    this.ipAddress  = ipAddress;
    this.port       = port;
    this.callback   = callback;
  }

  // { data: '42/scatter,["pair",{"data":{"appkey":"appkey:701432262492372292171599916622155200161195209215328220154109188167","origin":"eosbet.io","passthrough":true},"plugin":"eosbet.io"}]
  handlePair = (request) => {
    console.log('WebsocketServer::handlePair - ', request);

    const plugin = request.plugin;
    const payload = request.data;
    const requestId = request.requestId;

    // socket.send('42/scatter,' + JSON.stringify(['rekeyed', json]);
    if(payload.passthrough) {
      this.send(request.requestId, '42/scatter,' + JSON.stringify(['paired', true]));
    } else {
      this.send(request.requestId, '42/scatter,' + JSON.stringify(['paired', true]));
    }

  }

  // {"data":{"type":"identityFromPermissions","payload":{"origin":"eosbet.io"},"id":"15225517621722621011621542431011901791481481481721451666124216249248","appkey":"31d6a851a08e59ae8d7d565223475f9540a5b363d1747da680be6642cbd231ec","nonce":0,"nextNonce":"ad883a240ba576a20195c9b672b52544eecf12d7a814d90e3d6bf27707f29da5"},"plugin":"eosbet.io"}
  handleApi = (request) => {

    const plugin = request.plugin;
    const payload = request.data;
    const requestId = request.requestId;
    console.log('WebsocketServer::handleApi - ', payload.type, request);

    if(payload.type === 'identityFromPermissions') {
      const responseJson = {id: payload.id, result: null};
      this.send(request.requestId, '42/scatter,' + JSON.stringify(['api', responseJson]));
    } else if(payload.type === 'getOrRequestIdentity') {
      const responseJson = {id: payload.id, result: null};
      this.send(request.requestId, '42/scatter,' + JSON.stringify(['api', responseJson]));

    } else {
      console.log('WebsocketServer::handleApi - ', 'not implement!!!');
    }
    
  }

  handleRekeyed = (request) => {
    console.log('WebsocketServer::handleRekeyed - ', request);
  }

  handleDisconnect = (request) => {
    console.log('WebsocketServer::handleDisconnect - ', request);
  }

  handleEvent = (evt) => {

    const reqEvent = evt;
    console.log("WebsocketServer::handleEvent<reqEvent> - ", reqEvent);
    switch(reqEvent.event) {
      case "message": {
        const reqData = reqEvent.data;
        if(-1 === reqData.indexOf('40/scatter') && -1 === reqData.indexOf('42/scatter') ) {
          throw new Error("WebsocketServer::handleEvent<message> - " + reqEvent);
        }

        if(0 === reqData.indexOf('40/scatter')) { // 40
          // /127.0.0.1:57380/socket.io/?EIO=3&transport=websocket
          console.log("WebsocketServer::handleEvent<message> - ", reqEvent.url + " CONNECT refers");

          this.send(reqEvent.requestId, '42/scatter,' + JSON.stringify(['connected'])); // notify it of a successful connection
          return;
        } 

        // 42/scatter Handshaking/Upgrading Real message
        const [type, data] = JSON.parse(reqData.replace('42/scatter,', ''));
        console.log("WebsocketServer::handleEvent<message> - ", reqEvent.url + " EVENT " + type);

        const handFunc = type.charAt(0).toUpperCase() + type.slice(1);
        const request = Object.assign(data, {requestId: reqEvent.requestId});
        this[`handle${handFunc}`](request);

      } break;
      case "open":
      case "close":
      case "create": {
        console.log("WebsocketServer::handleEvent<open|close|create> - ", reqEvent.event, reqEvent.url);
      }
      break;
      default: {
        // throw new Error("WebsocketServer::handleEvent - " + reqEvent);
        console.log("WebsocketServer::handleEvent - " + reqEvent);
      }
      break
    }
  }

  start () {
    RNWebsocketServer.start(this.ipAddress, this.port);
    DeviceEventEmitter.addListener('RNWebsocketServerResponeReceived', this.callback); // this.callback);
  }

  stop () {
    RNWebsocketServer.stop();
    DeviceEventEmitter.removeListener('RNWebsocketServerResponeReceived');
  }

  send(requestId, body) {
    RNWebsocketServer.send(requestId, body);
  }
}