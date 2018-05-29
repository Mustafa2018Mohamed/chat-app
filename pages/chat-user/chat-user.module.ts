import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatUserPage } from './chat-user';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ChatUserPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatUserPage),
    ComponentsModule
  ],
})
export class ChatUserPageModule {}
