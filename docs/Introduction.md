

## react native app设备直接使用websocket server本地服务，为dapp所用，兼容scatterjs

#### 初始化react-native-websocket-server工程

`````

react-native-create-library --package-identifier com.alackfeng.reactnative --platforms android,ios websocket-server
mv websocket-server react-native-websocket-server
cd react-native-websocket-server
git init
git add -A
git commit -m "Initial Project"

`````


#### 创建react-native app例子
`````

mkdir -p example
cd example
react-native init websocketapp
cd websocketapp
react-native run-ios

###### 增加react-native-websocket-server库

yarn add file:../../
react-native link react-native-websocket-server


###### 添加ios平台websocket库：PocketSocket
vi RNWebsocketServer.podspec ====>  s.dependency "PocketSocket" 


`````



#### 问题集锦
`````
Q1. Loading dependency graph...
error: bundling failed: Error: jest-haste-map: @providesModule naming collision:
  Duplicate module name: react-animated

A1. 
watchman watch-del-all
rm -rf node_modules && yarn install
rm -fr $TMPDIR/react-*
yarn start --reset-cache



`````
