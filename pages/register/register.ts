import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { storage } from 'firebase';
import { UserAuthProvider } from '../../providers/user-auth/user-auth';
import { UsersDatabaseProvider } from '../../providers/users-database/users-database';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
	country_list = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
	photo:Promise<any>;
  user;
  res;
  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public camera:Camera,
  	private toast:ToastController,
  	private loading:LoadingController,
  	private userAuth:UserAuthProvider,
  	private userDb:UsersDatabaseProvider
    ) {
  }

  async takePhoto(){
  	let cameraOpts:CameraOptions = {
  		quality:80,
  		targetWidth:800,
  		targetHeight:800,
  		destinationType:this.camera.DestinationType.DATA_URL,
  		saveToPhotoAlbum: true,
  		encodingType:this.camera.EncodingType.JPEG,
  		correctOrientation: true,
  		mediaType: this.camera.MediaType.PICTURE,
	 }

  	try{
  		this.photo = await this.camera.getPicture(cameraOpts);
  	} catch(e){
  		this.toast.create({
  			message:`You Haven't Take A Photo`,
  			duration:3200,
  			position:'middle',
  		}).present();
  	}
  }
  async uploadPhoto(){
  	let cameraOpts:CameraOptions = {
	  		quality:80,
	  		targetWidth:800,
	  		targetHeight:800,
	  		destinationType:this.camera.DestinationType.DATA_URL,
	  		sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
	  		saveToPhotoAlbum: true,
	  		encodingType:this.camera.EncodingType.JPEG,
	  		correctOrientation: true,
	  		mediaType: this.camera.MediaType.PICTURE,
  	}
  	try{
  		this.photo = await this.camera.getPicture(cameraOpts);
  	} catch(e){
  		this.toast.create({
  			message:e.message ,
  			duration:3200,
  			position:'middle',
  		}).present();
  	}
  }
  async registerUser(formValues){
  	let loading = this.loading.create({
  		content:'Loading...'
  	});
  	loading.present();

    let user;
    try{
      user = await this.userAuth.register(formValues.email, formValues.password);
    } catch(e){
      this.toast.create({
        message:e.message,
        duration:3500,
        position:'middle'
      })
    }

    let photo = await this.photo;
    let imageData = `data:image/jpeg;base64,${photo}`;
    let picture = storage().ref(`users/${user.user.uid}/profilePic/${user.user.uid}`);
   
    picture.putString(imageData, 'data_url').then(async (res) => {
      let userInfo = {
        firstName:(formValues.firstName).trim(),
        lastName:(formValues.lastName).trim(),
        dateOfBirth:formValues.dateOfBirth,
        country:formValues.country,
        email:(formValues.email).trim(),
        uid:user.user.uid,
        profilePicUrl : await res.ref.getDownloadURL(),
      };
       this.userDb.saveUser(userInfo).then( 
       (newUser)=> {
        loading.dismiss();
        this.navCtrl.push('TabsPage', {myId:user.user.uid});
      }, err => {
        loading.dismiss();
        this.toast.create({
          message: err.message,
          duration:3200,
          position:'middle'
        }).present()
      });
    })
  }
}
