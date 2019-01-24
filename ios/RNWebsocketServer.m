
#import "RNWebsocketServer.h";
#import "PocketSocket/PSWebSocketServer.h";
#import <React/RCTLog.h>

@interface RNWebsocketServer () <PSWebSocketServerDelegate>

@property (nonatomic, strong) PSWebSocketServer *server;

@end

@implementation RNWebsocketServer

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()


RCT_EXPORT_METHOD(start:(NSString *)ipAddress port:(int)port) {
    RCTLogInfo(@"Pretending to create an event at %d", port);
    self.server = [PSWebSocketServer serverWithHost:ipAddress port:port];
    self.server.delegate = self;
    [self.server start];
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
}
- (void)server:(PSWebSocketServer *)server webSocketDidOpen:(PSWebSocket *)webSocket {
    RCTLogInfo(@"Server websocket did open");
}
- (void)server:(PSWebSocketServer *)server webSocket:(PSWebSocket *)webSocket didCloseWithCode:(NSInteger)code reason:(NSString *)reason wasClean:(BOOL)wasClean {
    RCTLogInfo(@"Server websocket did close with code: %@, reason: %@, wasClean: %@", @(code), reason, @(wasClean));
}
- (void)server:(PSWebSocketServer *)server webSocket:(PSWebSocket *)webSocket didFailWithError:(NSError *)error {
    RCTLogInfo(@"Server websocket did fail with error: %@", error);
}

@end
  