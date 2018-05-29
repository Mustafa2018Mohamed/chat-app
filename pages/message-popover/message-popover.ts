import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,ToastController} from 'ionic-angular';
import { MessagesDbProvider } from '../../providers/messages-db/messages-db';

@IonicPage()
@Component({
  selector: 'page-message-popover',
  templateUrl: 'message-popover.html',
})
export class MessagePopoverPage {

	myId;
	userToChatId
	message;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		private messageDb: MessagesDbProvider,
		private toast: ToastController) {}

	ionViewWillLoad(){
		this.myId = this.navParams.get('myId');
		this.userToChatId = this.navParams.get('userToChatId');
		this.message = this.navParams.get('message');
	}

	copyMessage(){
		document.addEventListener('copy', (e:ClipboardEvent) => {
				e.clipboardData.setData('text/plain',this.message.content);
				e.preventDefault();
			});
		document.execCommand('copy');
		
		this.viewCtrl.dismiss().then( () => {
			this.toast.create({
				message :'Copied.',
				duration:1500,
				position:'top',
			}).present();
		});
	}

	deleteMessage(){
		this.viewCtrl.dismiss().then( () => {
			this.messageDb.deleteMessage(this.myId,this.userToChatId,this.message.messageKey)
		});
	}

}
