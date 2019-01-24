
package com.alackfeng.reactnative;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import java.io.IOException;
import java.net.InetSocketAddress;

import android.util.Log;


public class RNWebsocketServerModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  private RNWebsocketServer server  = null;

  public RNWebsocketServerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNWebsocketServer";
  }

  @ReactMethod
  public void start(String ipAddress, int port) throws IOException, InterruptedException {
      
    InetSocketAddress inetSocketAddress = new InetSocketAddress(ipAddress, port);
    Log.d("WebsocketServer", "RNWebsocketServer::start...");

    server = new RNWebsocketServer(inetSocketAddress);
    server.start();
  }

  @ReactMethod
  public void stop() throws IOException, InterruptedException {

    Log.d("WebsocketServer", "RNWebsocketServer::stop...");
    server.stop();
  }
}