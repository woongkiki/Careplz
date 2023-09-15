import React, {Component, useState, useEffect} from 'react';
import {ActivityIndicator, Alert, BackHandler, ToastAndroid, SafeAreaView, View, Text} from 'react-native';
import Main from './src/screen/Main';
import dynamicLinks from "@react-native-firebase/dynamic-links";

class App extends Component {

  // token =  async () => {
  //   const token = messaging().getToken();
    
  //   return token;
  // }


  constructor (props) {
        super(props);

        this.state = {
          isLoading: false,
          dynLink:null
        }
    }


  componentDidMount() {

      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
      
      //앱 로딩페이지 2초 후 사라짐 
      setTimeout(() => {
        this.setState({
          isLoading: true
        })
      }, 2000);

      dynamicLinks()
        .getInitialLink()
        .then((link) => {
          console.log('App.tsx link :::', link);
          if (link?.url) {
            // ...set initial route as offers screen
            console.log("link", link);
            this.state.dynLink = link;
          }
        });

  }

   // 이벤트 해제
   componentWillUnmount() {
      this.exitApp = false;
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
      this.state.isLoading = false;
  }


    // 이벤트 동작
    handleBackButton = () => {
        // 2000(2초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
        if (this.exitApp == undefined || !this.exitApp) {
            ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
            this.exitApp = true;

            this.timeout = setTimeout(
                () => {
                    this.exitApp = false;
                },
                2000    // 2초
            );
        } else {
            clearTimeout(this.timeout);

            BackHandler.exitApp();  // 앱 종료
        }
        return true;
    }




  render() {
    return (
      <Main dynLink={this.state.dynLink} />
    );
  }
}

export default App;