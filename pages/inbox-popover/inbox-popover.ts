import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, AlertOptions, ToastController } from 'ionic-angular';
import { MessagesDbProvider } from '../../providers/messages-db/messages-db';

@IonicPage()
@Component({
  selector: 'page-inbox-popover',
  templateUrl: 'inbox-popover.html',
})
export class InboxPopoverPage {
	myId;
	chat;
  constructor
   (public navCtrl: NavController,
  	public navParams: NavParams,
  	private viewCtrl: ViewController,
  	private alertCtrl:AlertController,
  	private messagesDb:MessagesDbProvider,
  	private toast:ToastController
  	) {
  }

  ionViewWillLoad() {
    this.myId = this.navParams.get('myId');
    this.chat = this.navParams.get('chat');
  }

  viewProfile(){
	this.navCtrl.push('ViewProfilePage', {
	 	myId:this.myId,
	 	userToChatInfo:this.chat.userToChatInfo
	});
  	this.viewCtrl.dismiss()
  }

  deleteChat(){
  	let alertOpts:AlertOptions = {
	 		message:`Do You Want To Delete Chat With ${this.chat.userToChatInfo.firstName}`,
	 		buttons:[
	 			{
	 				text:'Confirm',
	 				handler: () => {
	 					try{
	 						this.messagesDb.deleteChat(this.myId, this.chat.userToChatInfo.uid);
	 					} catch(e){
	 						this.viewCtrl.dismiss().then( () => {
	 							this.toast.create({
	 								duration:3200,
	 								message:e.message? e.message : `Something Goes Wrong, Please Try Again`,
	 								position:'middle',
	 							}).present();
	 						});
	 					}
	 				}
	 			},
	 			{
	 				role:'cancel',
	 				text:'Cancel'
	 			}
	 		]
	 	};
 	this.viewCtrl.dismiss().then( () => {
 		this.alertCtrl.create(alertOpts).present();
 	});
  }
}
