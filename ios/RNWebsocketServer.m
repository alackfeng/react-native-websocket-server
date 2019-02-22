
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
    

    NSString *thePath = [[NSBundle mainBundle] pathForResource:@"server" ofType:@"p12"];
    RCTLogInfo(@"Create Websocket Server at %@", thePath);
    NSData *PKCS12Data = [[NSData alloc] initWithContentsOfFile:thePath];
//    CFDataRef inPKCS12Data = (CFDataRef)CFBridgingRetain(PKCS12Data);
//
//    SecCertificateRef cert = SecCertificateCreateWithData(NULL, inPKCS12Data);
////    [PKCS12Data release];
//
//    // the "identity" certificate
//    SecIdentityRef identityRef;
////    SecIdentityCreateWithCertificate(NULL, cert, &identityRef);
//    sec_identity_create_with_certificates(&identityRef, cert);
//
//    // the certificates array, containing the identity then the root certificate
//    NSArray *certs = [[NSArray alloc] initWithObjects:(id)CFBridgingRelease(identityRef), (id)CFBridgingRelease(cert), nil];
//
    
    CFArrayRef keyref = NULL;
    OSStatus sanityChesk = SecPKCS12Import((__bridge CFDataRef)PKCS12Data,
                                           (__bridge CFDictionaryRef)[NSDictionary
                                                                      dictionaryWithObject:@"Scatterjs2019"
                                                                      forKey:(__bridge id)kSecImportExportPassphrase],
                                           &keyref);
    
    if (sanityChesk != noErr) {
        RCTLogInfo(@"Error while importing pkcs12 [%d]", sanityChesk);
        return;
    }
    
    NSArray *certs = (__bridge_transfer NSArray *)keyref;
    
    self.server = [PSWebSocketServer serverWithHost:ipAddress port:port SSLCertificates:certs];
    self.server.delegate = self;
    [self.server start];
    
    RCTLogInfo(@"OK-");


}

RCT_EXPORT_METHOD(stop) {
    RCTLogInfo(@"Stop Websocket Server ...");
    [self.server stop];
}

RCT_EXPORT_METHOD(send:(NSString *)requestId body:(NSString *)body ) {
    RCTLogInfo(@"Send Websocket Message <%@> - %@", requestId, body);

    [self.server send:requestId body:body];
}

#pragma mark - PSWebSocketServerDelegate

- (NSString*) requestId {
    return [NSString stringWithFormat:@"%lf:%u", [[NSDate date] timeIntervalSince1970], arc4random_uniform(1000000)];
}

- (void)serverDidStart:(PSWebSocketServer *)server {
    RCTLogInfo(@"Server did start…");
}
- (void)serverDidStop:(PSWebSocketServer *)server {
    RCTLogInfo(@"Server did stop…");
}
- (BOOL)server:(PSWebSocketServer *)server acceptWebSocketWithRequest:(NSURLRequest *)request {
    RCTLogInfo(@"Server websocket did Accept Request: %@", request.URL);
    return YES;
}
- (void)server:(PSWebSocketServer *)server webSocket:(PSWebSocket *)webSocket didReceiveMessage:(id)message {
    RCTLogInfo(@"Server websocket did receive message: %@", message);

    [self.bridge.eventDispatcher sendAppEventWithName:@"RNWebsocketServerResponeReceived" 
        body:@{@"url": [webSocket remoteUrl], @"event": @"message", @"requestId": [self requestId], @"data": message}];
}
- (void)server:(PSWebSocketServer *)server webSocketDidOpen:(PSWebSocket *)webSocket {
    RCTLogInfo(@"Server websocket did open %@", [webSocket remoteUrl]);

    [self.bridge.eventDispatcher sendAppEventWithName:@"RNWebsocketServerResponeReceived" 
        body:@{@"url": [webSocket remoteUrl], @"event": @"open", @"requestId": [self requestId], @"data": @"onOpen"}];
}
- (void)server:(PSWebSocketServer *)server webSocket:(PSWebSocket *)webSocket didCloseWithCode:(NSInteger)code reason:(NSString *)reason wasClean:(BOOL)wasClean {
    RCTLogInfo(@"Server websocket did close with code: %@, reason: %@, wasClean: %@", @(code), reason, @(wasClean));
    
    [self.bridge.eventDispatcher sendAppEventWithName:@"RNWebsocketServerResponeReceived" 
        body:@{@"url": [webSocket remoteUrl], @"event": @"close", @"requestId": [self requestId], @"data": @"onClose"}];
}
- (void)server:(PSWebSocketServer *)server webSocket:(PSWebSocket *)webSocket didFailWithError:(NSError *)error {
    RCTLogInfo(@"Server websocket did fail with error: %@", error);
    
    [self.bridge.eventDispatcher sendAppEventWithName:@"RNWebsocketServerResponeReceived" 
        body:@{@"url": [webSocket remoteUrl], @"event": @"error", @"requestId": [self requestId], @"data": @"onError"}];
}

@end
  