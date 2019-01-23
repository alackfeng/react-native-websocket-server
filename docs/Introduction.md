

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

yarn add 

`````
