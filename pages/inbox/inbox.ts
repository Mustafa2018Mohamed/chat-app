import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { MessagesDbProvider } from '../../providers/messages-db/messages-db';

@IonicPage()
@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html',
})
export class InboxPage{
	myInfo;
	chatsArr = [];
  myId;
  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	private messageDb:MessagesDbProvider,
    private popover:PopoverController) {

    this.myId = this.navParams.get('myId');
  }
  
  ionViewWillLoad() {
    this.messageDb.getMyChats(this.myId).subscribe( chats => {
      this.chatsArr = [];
      for (let chat in chats) {
        let Messages = Object.keys(chats[chat]),
        lastMessage = Messages[Messages.length - 1];
        this.chatsArr.push( chats[chat][lastMessage] );
      }
    });
  }
  getSendTime(messageTime){
    let time = new Date(messageTime);
    return time.getHours()  + ':' + time.getSeconds();
  }
  chatUser(user){
    this.navCtrl.push('ChatUserPage', {myId:this.myId, userToChatInfo:user.userToChatInfo})
  }

  chatOptions(event,chat){
    let popover = this.popover.create('InboxPopoverPage', { myId:this.myId, chat:chat });
    popover.present({
      ev:event
    });
  }
}
