import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { UserAuthProvider } from '../../providers/user-auth/user-auth';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth:UserAuthProvider,
    private toast:ToastController) {
  }
//'Please Try Again Or Register First'
  async login(form){
    let user;
    try {
       user = await this.auth.login(form.email, form.password);
    } catch (e){
      this.toast.create({
        message:e.message,
        duration:3200,
        position:'middle'
      }).present();
    }
  	if (user) this.navCtrl.setRoot('TabsPage', {myId:user.user.uid});
  }
}
