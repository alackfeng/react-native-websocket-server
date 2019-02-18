
import { NativeModules, DeviceEventEmitter } from 'react-native';

const { RNWebsocketServer } = NativeModules;

import { scatterVersion, 
  responseResult, connectConnected, connectRekey, connectPaired, 
  identityFromPermissions, getOrRequestIdentity, getVersion, 
  forgetIdentity, requestAddNetwork, getPublicKey, linkAccount,
  requestArbitrarySignature, requestTransfer, requestSignature
} from "./scatter-protocol";

const callback_default = () => { alert('are you sure not contain callback ?') }


const pluginList = ["scatter-demo", "eosbet.io"];


export default class ScatterServer {  
  constructor (ipAddress = '127.0.0.0', port = 50005, callback = callback_default) {
    this.ipAddress  = ipAddress;
    this.port       = port;
    this.callback   = callback;
  }

  callbackToUI = (request, responseCB) => {
    if(this.callback)
      this.callback(request, responseCB);
  }

  handlePair = (request) => {
    // console.log('ScatterServer::handlePair - ', request);

    // const plugin = request.plugin;
    // const payload = request.data;
    // const requestId = request.requestId;

    // if(payload.passthrough) {
    //   this.send(request.requestId, connectRekey());
    // } else {
    //   this.send(request.requestId, connectPaired(true));
    // }

    this.callbackToUI(request, (id, result) => {
      if(request.requestId === id) {

        console.log("handlePair::send - rekey: ", result["paired"]);
        if(result.hasOwnProperty("rekey")) {
          console.log("handlePair::send - rekey: ", result);
          this.send(request.requestId, connectRekey());
        }
        else if(result.hasOwnProperty("paired")) {
          console.log("handlePair::send - paired: ", result);
          this.send(request.requestId, connectPaired(result.paired));
        }
      }
    });
  }


  // All authenticated api requests pass through the 'api' route.
  handleApi = (request) => {

    if(!request.plugin || request.plugin.length > 35)
      return this.send(request.requestId, responseResult(payload.id, null));

    request.plugin = request.plugin.replace(/\s/g, "");

    // 2 way authentication

    this.callbackToUI(request, (id, result) => {
      // console.log("handlePair::send - api: ", id, request, result);
      if(request.requestId === id) {
        console.log("handlePair::send - api: ", result);
        switch (result.type) {
          case "identityFromPermissions":
          case "getOrRequestIdentity":
            this.send(request.requestId, identityFromPermissions(result.id, result.result)); break;
          case "forgetIdentity":
            this.send(request.requestId, forgetIdentity(result.id)); break;
          case "getVersion": 
            this.send(request.requestId, getVersion(result.id)); break;
          case "requestAddNetwork": {
            // handle add network
            this.send(request.requestId, requestAddNetwork(result.id, true)); 
          } break;
          case "getPublicKey": 
            this.send(request.requestId, getPublicKey(result.id, result.result)); break;
          case "linkAccount": 
            this.send(request.requestId, linkAccount(result.id)); break;
          case "requestArbitrarySignature": {
            this.send(id, requestArbitrarySignature(result.id, result.result)); 
          } break;
          case "requestTransfer":
            this.send(request.requestId, requestTransfer(result.id, result.result)); break;
          case "requestSignature":
            this.send(request.requestId, requestSignature(result.id, result.result)); break;
          default: 
            console.log('ScatterServer::handleApi - <' + result.type + '> not implement!!!'); 
          break;
        }       
      }
    });

    


    // const payload = request.data;
    // const requestId = request.requestId;
    // console.log('ScatterServer::handleApi - ', payload.type, request);

    // switch (payload.type) {
    //   case "identityFromPermissions":
    //   case "getOrRequestIdentity":
    //     this.send(request.requestId, identityFromPermissions(payload.id)); break;
    //   case "forgetIdentity":
    //     this.send(request.requestId, forgetIdentity(payload.id)); break;
    //   case "getVersion": 
    //     this.send(request.requestId, getVersion(payload.id)); break;
    //   case "requestAddNetwork": {
    //     // handle add network
    //     this.send(request.requestId, requestAddNetwork(payload.id, true)); 
    //   } break;
    //   case "getPublicKey": 
    //     this.send(request.requestId, getPublicKey(payload.id, "EOS5zwpo5uNUGsjbGHDM7vGJstgo357WDhn5cL1CxXtDWpLHEetce")); break;
    //   case "linkAccount": 
    //     this.send(request.requestId, linkAccount(payload.id)); break;
    //   case "requestArbitrarySignature": {
        
    //     this.callbackToUI(request, (id, sign) => {
    //       this.send(id, requestArbitrarySignature(payload.id, 
    //         sign)); 
    //     });
    //   } break;
    //   case "requestTransfer":
    //     this.send(request.requestId, requestTransfer(payload.id, "requestTransfer")); break;

    //   default: 
    //     console.log('ScatterServer::handleApi - <' + payload.type + '> not implement!!!'); 
    //   break;
    // }
    
  }

  handleRekeyed = (request) => {
    // console.log('ScatterServer::handleRekeyed - ', request);
    // this.send(request.requestId, connectPaired(true));

    this.callbackToUI(request, (id, result) => {
      if(request.requestId === id) {
        console.log("handlePair::send - rekeyed: ", result);
        if(result.hasOwnProperty("paired"))
          this.send(request.requestId, connectPaired(result.paired));          
      }
    });

  }

  handleDisconnect = (request) => {
    console.log('ScatterServer::handleDisconnect - ', request);
  }

  handleEvent = (evt) => {

    const reqEvent = evt;    
    // console.log("ScatterServer::handleEvent<reqEvent> - ", reqEvent);

    switch(reqEvent.event) {
      case "message": {
        
        const reqData = reqEvent.data;
        if(-1 === reqData.indexOf('40/scatter') && -1 === reqData.indexOf('42/scatter') ) {
          throw new Error("ScatterServer::handleEvent<message> - " + reqEvent);
        }

        if(0 === reqData.indexOf('40/scatter')) { // 40/scatter
          this.send(reqEvent.requestId, connectConnected()); // notify it of a successful connection
          return;
        }

        // 42/scatter Handshaking/Upgrading Real message
        const [type, data] = JSON.parse(reqData.replace('42/scatter,', ''));
        // console.log("ScatterServer::handleEvent<message> - ", /*reqEvent.url + */" EVENT " + type);

        // dispatch Message to function
        const handFunc = type.charAt(0).toUpperCase() + type.slice(1);
        const request = Object.assign(data, {requestId: reqEvent.requestId, requestType: type});
        this[`handle${handFunc}`](request);

      } break;
      case "open":
      case "close":
      case "create": {
        console.log("ScatterServer::handleEvent<" + reqEvent.event + "> - " + reqEvent.url);
      }
      break;
      default: {
        // throw new Error("ScatterServer::handleEvent - " + reqEvent);
        console.log("ScatterServer::handleEvent - unkown: " + reqEvent);
      }
      break
    }
  }

  version() {
    return scatterVersion;
  }

  start () {
    RNWebsocketServer.start(this.ipAddress, this.port);
    DeviceEventEmitter.addListener('RNWebsocketServerResponeReceived', this.handleEvent);
  }

  stop () {
    RNWebsocketServer.stop();
    DeviceEventEmitter.removeListener('RNWebsocketServerResponeReceived');
  }

  send(requestId, body) {
    RNWebsocketServer.send(requestId, body);
  }
}