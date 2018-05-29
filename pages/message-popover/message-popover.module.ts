import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessagePopoverPage } from './message-popover';

@NgModule({
  declarations: [
    MessagePopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(MessagePopoverPage),
  ],
})
export class MessagePopoverPageModule {}
