
package com.alackfeng.reactnative;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Callback;

import java.io.IOException;
import java.net.InetSocketAddress;

import android.util.Log;


public class RNWebsocketServerModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

  private final ReactApplicationContext reactContext;
  private static final String MODULE_NAME = "RNWebsocketServer";

  private RNWebsocketServer server  = null;

  public RNWebsocketServerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;

    reactContext.addLifecycleEventListener(this);
  }

  @Override
  public String getName() {
    return "RNWebsocketServer";
  }

  @Override
  public void onHostResume() {
  }

  @Override
  public void onHostPause() {
  }

  @Override
  public void onHostDestroy() {
    try {
      stop();
    } catch (IOException e) {
      e.printStackTrace();
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  }

  @ReactMethod
  public void start(String ipAddress, int port) throws IOException, InterruptedException {
      
    InetSocketAddress inetSocketAddress = new InetSocketAddress(ipAddress, port);
    Log.d(MODULE_NAME, "RNWebsocketServer::start...");

    server = new RNWebsocketServer(reactContext, inetSocketAddress);
    server.start();

  }

  @ReactMethod
  public void stop() throws IOException, InterruptedException {

    Log.d(MODULE_NAME, "RNWebsocketServer::stop...");
    server.stop();
  }

  @ReactMethod
  public void send(String requestId, String body) {
    if (server != null) {
      server.send(requestId, body);
    }
  }
}