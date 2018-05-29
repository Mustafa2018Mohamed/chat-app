import { Component, Input } from '@angular/core';
import { PopoverController } from 'ionic-angular';

@Component({
  selector: 'message',
  templateUrl: 'message.html'
})
export class MessageComponent {

  @Input('myId') myId;
  @Input('message') message;
  constructor(private popover:PopoverController) {
  }

  clickMessage(ev:UIEvent){
    let data = {
      myId:this.myId,
      userToChatId:this.message.userToChatInfo.uid,
      message:this.message
    };

    this.popover.create('MessagePopoverPage', data).present({
      ev:ev
    })
  }

  getSendTime(messageTime){
  	let time = new Date(messageTime);
  	return time.getHours()  + ':' + time.getSeconds();
  }
}
