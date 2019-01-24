import { NativeModules } from 'react-native';

const { RNWebsocketServer } = NativeModules;

export default class WebsocketServer {
    constructor (ipAddress, port = 3770) {
        this.ipAddress = ipAddress;
        this.port = port;
    }

    /**
     * Starts websocket server
     */
    start () {
        RNWebsocketServer.start(this.ipAddress, this.port);
    }
}