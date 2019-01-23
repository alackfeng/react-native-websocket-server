
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

#import <PSWebSocket/PSWebSocketServer.h>

@interface RNWebsocketServer <PSWebSocketServerDelegate> : NSObject <RCTBridgeModule>

@property (nonatomic, strong) PSWebSocketServer *server;

@end
  