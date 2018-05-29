import { Component, OnDestroy, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { UsersDatabaseProvider } from '../../providers/users-database/users-database';
import { MessagesDbProvider } from '../../providers/messages-db/messages-db';

import { Subscription} from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-chat-user',
  templateUrl: 'chat-user.html',
})
export class ChatUserPage implements OnDestroy{
  @ViewChild(Content) content: Content;
  messageContent = '';
  userToChatInfo;
  myId;
  myInfo;
  userMessages;
  userMessagesSubscription:Subscription;
  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	private usersDb:UsersDatabaseProvider,
  	private messageDb:MessagesDbProvider) {
  }

  ionViewWillLoad() {
  	this.myId = this.navParams.get('myId');
    this.userToChatInfo = this.navParams.get('userToChatInfo');

    this.usersDb.getUser(this.myId).subscribe(user => this.myInfo = user);

    this.userMessagesSubscription = this.messageDb.getChatWithUser(this.myId, this.userToChatInfo.uid)
    .subscribe( (userMessages) => {
      console.log(userMessages);
    	this.userMessages = [];
    	for (let message in userMessages) {
    		this.userMessages.push(Object.assign({},userMessages[message], {messageKey:message}));
    	}
    	 try {
         setTimeout(() => {
           this.content.scrollToBottom(10);
         }, 200)
       } catch(e){

       }
    });
  }

  seeProfile(){
  	let paramInfo = {
  		myId:this.myId,
  		userToChatInfo:this.userToChatInfo
  	}

  	this.navCtrl.push('ViewProfilePage', paramInfo);
  }

  sendMessage(){
    let messageInfo = {
      content:this.messageContent,
      time : new Date().toString(),
      sender: {
        firstName:this.myInfo.firstName ,
        lastName:this.myInfo.firstName,
        uid:this.myInfo.uid,
        profilePicUrl:this.myInfo.profilePicUrl
      },
    };

  		this.messageDb.sendMessage(this.userToChatInfo, messageInfo);

  	this.messageContent = '';
  	let elem = <HTMLTextAreaElement>document.querySelector('textarea');
    elem.focus();
  }

  ngOnDestroy(){
  	this.userMessagesSubscription.unsubscribe();
  }
}