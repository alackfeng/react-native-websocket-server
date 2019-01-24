package com.alackfeng.reactnative;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.nio.ByteBuffer;

import android.util.Log;

import org.java_websocket.WebSocket;
import org.java_websocket.WebSocketImpl;
import org.java_websocket.framing.Framedata;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;


public class RNWebsocketServer extends WebSocketServer {

  private static final String MODULE_NAME = "RNWebsocketServer";

  public RNWebsocketServer( int port ) throws UnknownHostException {
    super( new InetSocketAddress( port ) );
  }

  public RNWebsocketServer( InetSocketAddress address ) {
    super( address );
  }

  @Override
  public void onOpen( WebSocket conn, ClientHandshake handshake ) {

    conn.send("Welcome to the server!"); //This method sends a message to the new client

    broadcast( "new connection: " + handshake.getResourceDescriptor() ); //This method sends a message to all clients connected
    Log.d(MODULE_NAME, conn.getRemoteSocketAddress().getAddress().getHostAddress() + " entered the room!");

  }

  @Override
  public void onClose( WebSocket conn, int code, String reason, boolean remote ) {
    broadcast( conn + " has left the room!" );
    Log.d(MODULE_NAME, conn + "has left the room!");
  }

  @Override
  public void onMessage( WebSocket conn, String message ) {
    broadcast( message );
    Log.d(MODULE_NAME, conn + ": " + message );
  }

  @Override
  public void onMessage( WebSocket conn, ByteBuffer message ) {
    broadcast( message.array() );
    Log.d(MODULE_NAME, conn + ": " + message );
  }

  @Override
  public void onError( WebSocket conn, Exception ex ) {
    ex.printStackTrace();
    if( conn != null ) {
      // some errors like port binding failed may not be assignable to a specific websocket
    }
  }

  @Override
  public void onStart() {
    System.out.println("Server started!");
    setConnectionLostTimeout(0);
    setConnectionLostTimeout(100);
  }



}