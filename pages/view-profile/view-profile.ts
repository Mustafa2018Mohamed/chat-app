import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController, ToastController} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { UserAuthProvider } from '../../providers/user-auth/user-auth';
import { LoginPage } from '../login/login';
import { UsersDatabaseProvider } from '../../providers/users-database/users-database';
import { storage } from 'firebase';
import { PhotoViewer } from '@ionic-native/photo-viewer';

import { User } from '../../models/user.interface';

@IonicPage()
@Component({
  selector: 'page-view-profile',
  templateUrl: 'view-profile.html',
})
export class ViewProfilePage {
  country_list = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
  myId;
  userToChatInfo;
  data = {} as User;
  anotherUser = false;
  photo;
  constructor(
    public  navCtrl: NavController,
    public  navParams: NavParams,
  	private userAuth: UserAuthProvider,
    private usersDb:UsersDatabaseProvider,
  	private app:App,
    private loading:LoadingController,
    private camera :Camera,
    private toast: ToastController,
    private photoViewer:PhotoViewer) {
  }

  ionViewWillLoad() {
    this.myId = this.navParams.get('myId');
    this.userToChatInfo = this.navParams.get('userToChatInfo');

    let loading = this.loading.create({
      content:'Loading...'
    });
    loading.present();

    if (!this.userToChatInfo){
      this.anotherUser = false;
      this.usersDb.getUser(this.myId).subscribe((user:User) => {
        this.data = user;
        loading.dismiss()
      });
    }
    else{
      this.anotherUser = true;
      this.usersDb.getUser(this.userToChatInfo.uid).subscribe((user:User) => {
        this.data = user;
        loading.dismiss()
      });
    }
  }
  openOptions(){
    let actionSheetUserOpts:ActionSheetOptions = {
          buttons:[
            {
              text:'See Profile Photo',
              icon:'md-eye',
              cssClass:'see-profile',
              handler:()=> this.photoViewer.show(this.data.profilePicUrl ,'', {share:false})
            }
            ,{
              text:'Take A Photo',
              icon : 'ios-camera',
              cssClass:'camera-button',
              handler : () =>  this.takePhoto(),
            },
            {
              text:'Upload A Photo',
              icon : 'md-image',
              cssClass:'image-button',
              handler : () =>  this.uploadPhoto(),
            },
          ]
        },
        actionSheetAnotherUserOpts:ActionSheetOptions = {
           buttons:[
            {
              icon:'md-eye',
              handler:()=> this.photoViewer.show(this.data.profilePicUrl ,'', {share:false})
            }
          ]
        },
        actionSheet =   this.actionSheet.create(!this.anotherUser ? actionSheetUserOpts : actionSheetAnotherUserOpts).present();
  
  }
   takePhoto() {
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

    this.camera.getPicture(cameraOpts).then (
      pic => this.photo = pic,
      e => {
        this.toast.create({
          message:`You Haven't Take A Photo`,
          duration:3200,
          position:'middle',
        }).present();
    });
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

    this.photo = await this.camera.getPicture(cameraOpts).then( 
      pic => this.photo = pic,
      err => {
        this.toast.create({
          message:`You Haven't Take A Photo`,
          duration:3200,
          position:'middle',
        }).present();
      }
    );
 }

  async saveInfo(formValues){
    if (!this.photo) {
      let loading = this.loading.create({
        content:'Loading...'
      });
      loading.present();
      let userInfo = {
        firstName:(formValues.firstName).trim(),
        lastName:(formValues.lastName).trim(),
        dateOfBirth:formValues.dateOfBirth,
        country:formValues.country,
      };
      this.usersDb.updateUserProfile(this.myId, userInfo).then( 
       () => loading.dismiss(),
       err => {
          loading.dismiss();
          this.toast.create({
            message:'Something Goes Wrong',
            duration:3200
          }).present();
       });
    } else {
      let loading = this.loading.create({
        content:'Loading...'
      });
      loading.present();

      let photo = await this.photo;
      let imageData = `data:image/jpeg;base64,${photo}`;
      let picture = storage().ref(`users/${this.myId}/profilePic/${this.myId}`);
      picture.putString(imageData, 'data_url').then(async (res) => {
        let userInfo = {
          firstName:(formValues.firstName).trim(),
          lastName:(formValues.lastName).trim(),
          dateOfBirth:formValues.dateOfBirth,
          country:formValues.country,
          profilePicUrl : await res.ref.getDownloadURL(),
        };
        this.usersDb.updateUserProfile(this.myId,userInfo).then( 
          () => loading.dismiss(),
          err => {
            loading.dismiss();
            this.toast.create({
              message:'Something Goes Wrong',
              duration:3200
            }).present();
          })
      })
    }
  }

	logOut(){
		this.userAuth.logOut();
		this.app.getRootNav().setRoot(LoginPage);;
	}

}
