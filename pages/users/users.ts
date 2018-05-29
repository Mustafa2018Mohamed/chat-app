import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersDatabaseProvider } from '../../providers/users-database/users-database';
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage implements OnDestroy {
  users:any[];
  usersSubicription:Subscription;
  myId;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  	private usersDb:UsersDatabaseProvider) {
  }

  ionViewWillLoad() {
  	this.myId = this.navParams.get('myId');

    this.usersSubicription = this.usersDb.getAllUsers().subscribe(users => {
    	this.users = [];
    	for (let user in users) {
        if(users[user].uid == this.myId) {}
        else this.users.push(users[user]);
    	}
    })
  }

  openSearchPage(){
  	this.navCtrl.push('SearchUserPage', {myId:this.myId});
  }

  chatUser(user){
  	this.navCtrl.push('ChatUserPage', {myId:this.myId, userToChatInfo:user});
  }

  ngOnDestroy(){
  	this.usersSubicription.unsubscribe();
  }

}
