import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserAuthProvider {

  constructor(private auth: AngularFireAuth) {

  }

  login(email,password){
  	return this.auth.auth.signInWithEmailAndPassword(email,password);
  }

  async register(email,password){
  	return await this.auth.auth.createUserWithEmailAndPassword(email,password);
  }

  currentUser():Observable<firebase.User>{
  	return this.auth.authState;
  }

  logOut(){
  	this.auth.auth.signOut();
  }
}
