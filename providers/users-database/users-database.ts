import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class UsersDatabaseProvider {

  constructor(private db:AngularFireDatabase) {
  }

  saveUser(userInfo){
  	return this.db.object(`users-info/${userInfo.uid}`).update(userInfo)
  }
  
  getUser(uid){
  	return this.db.object(`users-info/${uid}`).valueChanges();
  }

  getAllUsers(){
  	return this.db.object(`users-info`).valueChanges();
  }
  updateUserProfile(userId,ProfileInfo){
    return this.db.object(`users-info/${userId}`).update(ProfileInfo)
  }
}
