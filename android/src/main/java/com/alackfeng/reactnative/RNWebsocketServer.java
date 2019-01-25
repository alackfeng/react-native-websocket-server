package com.alackfeng.reactnative;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.Random;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.support.annotation.Nullable;
import android.util.Log;

import org.java_websocket.WebSocket;
import org.java_websocket.WebSocketImpl;
import org.java_websocket.framing.Framedata;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;


public class RNWebsocketServer extends WebSocketServer {

  private static final String MODULE_NAME         = "RNWebsocketServer";
  private static final String SERVER_EVENT_ID     = "RNWebsocketServerResponeReceived";

  private static final String EVENT_TYPE_START    = "start";
  private static final String EVENT_TYPE_OPEN     = "open";
  private static final String EVENT_TYPE_CLOSE    = "close";
  private static final String EVENT_TYPE_MESSAGE  = "message";
  private static final String EVENT_TYPE_ERROR    = "error";


  private ReactContext reactContext;

  public RNWebsocketServer(ReactContext context, int port ) throws UnknownHostException {
    super( new InetSocketAddress( port ) );
    reactContext = context;
  }

  public RNWebsocketServer(ReactContext context, InetSocketAddress address ) {
    super( address );
    reactContext = context;
  }

  private String requestId() {
    Random rand = new Random();
    String requestId = String.format("%d:%d", System.currentTimeMillis(), rand.nextInt(1000000));
    return requestId;
  }

  @Override
  public void onOpen( WebSocket conn, ClientHandshake handshake ) {

    // conn.send("Welcome to the server!"); //This method sends a message to the new client

    // Log.d(MODULE_NAME, "onOpen(): " + conn.getRemoteSocketAddress().getHostName() + ":" + conn.getRemoteSocketAddress().getPort()
    //   + " been connected\n" + conn.getResourceDescriptor());


    WritableMap request = fillRequestMap(EVENT_TYPE_OPEN, conn, "onOpen");
    this.sendEvent(reactContext, SERVER_EVENT_ID, request);
  }

  @Override
  public void onClose( WebSocket conn, int code, String reason, boolean remote ) {
    // broadcast( conn + " has left the room!" );
    // Log.d(MODULE_NAME, "onClose(): " + conn + "has left the room!");

    WritableMap request = fillRequestMap(EVENT_TYPE_CLOSE, conn, reason);
    this.sendEvent(reactContext, SERVER_EVENT_ID, request);

  }

  @Override
  public void onMessage( WebSocket conn, String message ) {
    // broadcast( message );
    // Log.d(MODULE_NAME, "onMessage() - " + conn + ": " + message );

    WritableMap request = fillRequestMap(EVENT_TYPE_MESSAGE, conn, message);
    this.sendEvent(reactContext, SERVER_EVENT_ID, request);
  }

  @Override
  public void onMessage( WebSocket conn, ByteBuffer message ) {
    // broadcast( message.array() );
    Log.d(MODULE_NAME, "onMessage(): " + conn + ": " + message );

    WritableMap request = fillRequestMap("message1", conn, StandardCharsets.UTF_8.decode(message).toString());
    this.sendEvent(reactContext, SERVER_EVENT_ID, request);
  }

  @Override
  public void onError( WebSocket conn, Exception ex ) {
    Log.d(MODULE_NAME, "onError(): " + conn);
    ex.printStackTrace();
    if( conn != null ) {
      // some errors like port binding failed may not be assignable to a specific websocket
      WritableMap request = fillRequestMap(EVENT_TYPE_ERROR, conn, "onError");
      this.sendEvent(reactContext, SERVER_EVENT_ID, request);
    }
  }

  @Override
  public void onStart() {
    // Log.d(MODULE_NAME, "onStart(): " + "Device Websocket Server started!");
    setConnectionLostTimeout(0);
    setConnectionLostTimeout(100);
  }

  public void send(String requestId, String body) {
    Log.d(MODULE_NAME, "sendResponse(): " + requestId + ": " + body);
    broadcast( body );
  }

  private WritableMap fillRequestMap(String type, WebSocket conn, String body) {

    // String url = conn.getRemoteSocketAddress().getAddress().getHostAddress() + ":" + conn.getRemoteSocketAddress().getPort() +  conn.getResourceDescriptor();
    String url = conn.getRemoteSocketAddress().toString() +  conn.getResourceDescriptor();

    WritableMap request = Arguments.createMap();
    request.putString("url", url);
    request.putString("event", type);
    request.putString("requestId", requestId());
    request.putString("data", body);

    return request;
  }

  private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
    Log.d(MODULE_NAME, "sendEvent(): " + params);
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
  }

}