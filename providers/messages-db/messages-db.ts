import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class MessagesDbProvider {

  constructor(private db:AngularFireDatabase) {
  }
  async sendMessage(userToChatInfo, messageInfo) {
    let message = await this.sendMessageToUser(userToChatInfo,messageInfo);
    this.saveMessageToMe(userToChatInfo, messageInfo, message.key)
  }
  sendMessageToUser(userToChatInfo, messageInfo){
    messageInfo.userToChatInfo = {
      uid:messageInfo.sender.uid,
      firstName:messageInfo.sender.firstName,
      lastName:messageInfo.sender.lastName,
      profilePicUrl:messageInfo.sender.profilePicUrl
    }

    return this.db.list(`users-messages/${userToChatInfo.uid}/${messageInfo.sender.uid}`)
    .push(messageInfo)
  }

  saveMessageToMe(userToChatInfo, messageInfo,messageKey){
    messageInfo.userToChatInfo = {
      uid:userToChatInfo.uid,
      firstName:userToChatInfo.firstName,
      lastName:userToChatInfo.lastName,
      profilePicUrl:userToChatInfo.profilePicUrl
    }
    
    return this.db.object(`users-messages/${messageInfo.sender.uid}/${userToChatInfo.uid}/${messageKey}`)
    .set(messageInfo)
  }

  getMyChats(userId){
  	return this.db.object(`users-messages/${userId}`).valueChanges();
  }

  getChatWithUser(myId,userToChatId){
    return this.db.object(`users-messages/${myId}/${userToChatId}`).valueChanges();
  }

  deleteChat(myId,userToChatId){
     return this.db.object(`users-messages/${myId}/${userToChatId}`).remove();
  }
  deleteMessage(myId,userToChatId,messageKey){
    this.db.object(`users-messages/${myId}/${userToChatId}/${messageKey}`).remove()
  }
}
