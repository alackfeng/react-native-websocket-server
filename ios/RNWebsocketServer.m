
#import "RNWebsocketServer.h";
#import "PocketSocket/PSWebSocketServer.h";
#import <React/RCTLog.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

@interface RNWebsocketServer () <PSWebSocketServerDelegate>

@property (nonatomic, strong) PSWebSocketServer *server;

@end

static RCTBridge *bridge;

@implementation RNWebsocketServer

@synthesize bridge = _bridge;

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()


RCT_EXPORT_METHOD(start:(NSString *)ipAddress port:(int)port) {
    RCTLogInfo(@"Create Websocket Server at %d", port);
    self.server = [PSWebSocketServer serverWithHost:ipAddress port:port];
    self.server.delegate = self;
    [self.server start];
}

RCT_EXPORT_METHOD(stop) {
    RCTLogInfo(@"Stop Websocket Server ...");
    [self.server stop];
}

#pragma mark - PSWebSocketServerDelegate

- (void)serverDidStart:(PSWebSocketServer *)server {
    RCTLogInfo(@"Server did start…");
}
- (void)serverDidStop:(PSWebSocketServer *)server {
    RCTLogInfo(@"Server did stop…");
}
- (BOOL)server:(PSWebSocketServer *)server acceptWebSocketWithRequest:(NSURLRequest *)request {
    return YES;
}
- (void)server:(PSWebSocketServer *)server webSocket:(PSWebSocket *)webSocket didReceiveMessage:(id)message {
    RCTLogInfo(@"Server websocket did receive message: %@", message);

    [self.bridge.eventDispatcher sendAppEventWithName:@"RNWebsocketServerResponeReceived" 
        body:@{@"url": @"localhost:19281", @"event": @"message", @"requestId": @"adbcddfs12123424234234", @"data": message}];
}
- (void)server:(PSWebSocketServer *)server webSocketDidOpen:(PSWebSocket *)webSocket {
    RCTLogInfo(@"Server websocket did open");

    [self.bridge.eventDispatcher sendAppEventWithName:@"RNWebsocketServerResponeReceived" 
        body:@{@"url": @"localhost:19281", @"event": @"open", @"requestId": @"adbcddfs12123424234234", @"data": @"onOpen"}];
}
- (void)server:(PSWebSocketServer *)server webSocket:(PSWebSocket *)webSocket didCloseWithCode:(NSInteger)code reason:(NSString *)reason wasClean:(BOOL)wasClean {
    RCTLogInfo(@"Server websocket did close with code: %@, reason: %@, wasClean: %@", @(code), reason, @(wasClean));
    
    [self.bridge.eventDispatcher sendAppEventWithName:@"RNWebsocketServerResponeReceived" 
        body:@{@"url": @"localhost:19281", @"event": @"close", @"requestId": @"adbcddfs12123424234234", @"data": @"onClose"}];
}
- (void)server:(PSWebSocketServer *)server webSocket:(PSWebSocket *)webSocket didFailWithError:(NSError *)error {
    RCTLogInfo(@"Server websocket did fail with error: %@", error);
    
    [self.bridge.eventDispatcher sendAppEventWithName:@"RNWebsocketServerResponeReceived" 
        body:@{@"url": @"localhost:19281", @"event": @"error", @"requestId": @"adbcddfs12123424234234", @"data": @"onError"}];
}

@end
  