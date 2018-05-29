import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersDatabaseProvider } from '../../providers/users-database/users-database';
import { Subscription } from 'rxjs/Subscription'

@IonicPage()
@Component({
  selector: 'page-search-user',
  templateUrl: 'search-user.html',
})
export class SearchUserPage implements OnDestroy {
  users: any[] = [];
  filterdUsers:any[];
  myId:string;
  usersSubscription:Subscription;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	private usersDb:UsersDatabaseProvider) {
  }

  ionViewWillLoad(){
  	this.myId = this.navParams.get('myId');
    this.usersSubscription = this.usersDb.getAllUsers().subscribe( users => {
      this.users = [];
      for (let user in users) {
        if(users[user].uid == this.myId) {}
        else this.users.push(users[user]);
      }
    });
  }

  searchUser(event:any){    
  	let searchValue = event.target.value;
  	this.filterdUsers = searchValue ? this.users.filter( user => {
  		return (user.firstName + ' ' + user.lastName).toLowerCase().includes(searchValue.trim().toLowerCase())
  	}) : this.users;
  }

  chatUser(userToChat){
	this.navCtrl.push('ChatUserPage',{userToChatInfo:userToChat, myId:this.myId})
  }

  ngOnDestroy(){
  	this.usersSubscription.unsubscribe()
  }
}
