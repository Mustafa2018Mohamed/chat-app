import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { LoginPage } from '../pages/login/login';
import { UserAuthProvider } from '../providers/user-auth/user-auth';
import 'rxjs/add/operator/take';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('myNav') nav: NavController;
  myInfo = 'ddfdfdf';
  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private auth:UserAuthProvider,
    private screenOrientation:ScreenOrientation) { 
    platform.ready().then(() => {
      if(platform.is('core') || platform.is('mobileweb')) {}
      else this.screenOrientation.lock('portrait');
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.auth.currentUser().take(1).subscribe( (user) => {  
         if(user) {
           this.nav.setRoot('TabsPage', { myId:user.uid })
         }
         else this.nav.setRoot(LoginPage);
       })
    });
  }
}

