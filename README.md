
# react-native-websocket-server

## Getting started

`$ npm install react-native-websocket-server --save`

### Mostly automatic installation

`$ react-native link react-native-websocket-server`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-websocket-server` and add `RNWebsocketServer.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNWebsocketServer.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.alackfeng.reactnative.RNWebsocketServerPackage;` to the imports at the top of the file
  - Add `new RNWebsocketServerPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-websocket-server'
  	project(':react-native-websocket-server').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-websocket-server/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-websocket-server')
  	```


## Usage
```javascript
import RNWebsocketServer from 'react-native-websocket-server';

// TODO: What to do with the module?
RNWebsocketServer;
```
  