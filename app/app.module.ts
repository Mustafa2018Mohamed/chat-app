import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { FormsModule } from '@angular/forms';

//firebase config
import { firebaseConfig} from './firebase.config';
import { AngularFireModule } from 'angularfire2'
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage'

//ionic plugins
import { Camera } from '@ionic-native/camera';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { PhotoViewer } from '@ionic-native/photo-viewer';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
//providers
import { UserAuthProvider } from '../providers/user-auth/user-auth';
import { UsersDatabaseProvider } from '../providers/users-database/users-database';
import { MessagesDbProvider } from '../providers/messages-db/messages-db';

@NgModule({
  declarations: [
    MyApp,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    
    //cordova plugins
    Camera,
    ScreenOrientation,
    PhotoViewer,

    UserAuthProvider,
    UsersDatabaseProvider,
    MessagesDbProvider,
  ]
})
export class AppModule {}
