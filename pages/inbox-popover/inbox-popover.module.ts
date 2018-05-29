import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InboxPopoverPage } from './inbox-popover';

@NgModule({
  declarations: [
    InboxPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(InboxPopoverPage),
  ],
})
export class InboxPopoverPageModule {}
