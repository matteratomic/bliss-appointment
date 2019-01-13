import {Component} from '@angular/core';
import {SigninPage} from '../signin/signin';

import { NavController, AlertController, Loading, LoadingController, ToastController } from 'ionic-angular';
import { ApiClient } from "../../providers/api-client.service";
import { Subscription } from "rxjs/Subscription";

import {User} from "../../models/user.models";
import {RegisterRequest} from "../../models/register-request.models";
import {AuthResponse} from "../../models/auth-response.models";
import {UserUpdateRequest} from "../../models/user-update-request.models";
import {PasswordUpdateRequest} from "../../models/password-update-request.models";

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [ApiClient]
})
export class ProfilePage {
	sign:string = "signin";
	
	private loading:Loading;
	private loadingShown:Boolean = false;
	
	private subscriptions:Array<Subscription> = [];
	private userUpdateRequest:UserUpdateRequest;
	private passwordUpdateRequest:PasswordUpdateRequest;
	
	constructor(private toastCtrl: ToastController, public navCtrl: NavController, private service:ApiClient, private loadingCtrl:LoadingController, private alertCtrl:AlertController) {
		let user:User = JSON.parse(window.localStorage.getItem('user'));
		this.userUpdateRequest = new UserUpdateRequest(user.email, user.name, user.mobile);
		this.passwordUpdateRequest = new PasswordUpdateRequest('', '', '');
	}
	
	confirmLogout() {
		let alert = this.alertCtrl.create({
            title: 'Logout?',
            message: 'Are you sure your want to logout?',
            buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Okay',
        handler: () => {
          this.done();
        }
      }]
        });
        alert.present();
	}
	
	singIn() {
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if(this.userUpdateRequest.mobile.length!=10 && Number.isNaN(Number(this.userUpdateRequest.mobile))) {
			this.showToast('Enter valid 10 digit mobile number');
		} else if(this.userUpdateRequest.name.length<4) {
			this.showToast('Enter username atleast 4 char long');
		} else if(this.userUpdateRequest.email.length <= 5 || !reg.test(this.userUpdateRequest.email)) {
            this.showToast('Enter valid email address');
        } else {
			this.presentLoading('Updating details');
			let subscription:Subscription = this.service.updateUser(window.localStorage.getItem('api_key'), this.userUpdateRequest).subscribe(data => {
				this.dismissLoading();
				this.done();
			}, err=> {
				this.dismissLoading();
				this.presentErrorAlert("Unable to update profile");
			});
			this.subscriptions.push(subscription);
		}
	}
	
	singUp() {
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if(this.passwordUpdateRequest.password.length==0) {
			this.showToast('Enter current password');
		} else if(this.passwordUpdateRequest.new_password.length==0 || !(this.passwordUpdateRequest.new_password === this.passwordUpdateRequest.new_password_confirmation)) {
			this.showToast('Enter valid new passwords, twice.');
		} else {
			this.presentLoading('Updating password');
			let subscription:Subscription = this.service.updatePassword(window.localStorage.getItem('api_key'), this.passwordUpdateRequest).subscribe(data => {
				this.dismissLoading();
				this.done();
			}, err=> {
				this.dismissLoading();
				this.presentErrorAlert("Unable to update password with provided credentials");
			});
			this.subscriptions.push(subscription);
		}
	}
	
	private done() {
		window.localStorage.removeItem('api_key');
		window.localStorage.removeItem('user');
		this.navCtrl.setRoot(SigninPage);
	}
	
	private presentLoading(message:string) {
        this.loading = this.loadingCtrl.create({
            content: message
        });

        this.loading.onDidDismiss(() => {});

        this.loading.present();
		this.loadingShown = true;
    }
	
	private dismissLoading(){
		if(this.loadingShown){
			this.loadingShown = false;
			this.loading.dismiss();
		}
	}
	
	private presentErrorAlert(msg:string) {
        let alert = this.alertCtrl.create({
            title: 'Oops!',
            subTitle: msg,
            buttons: ['Okay']
        });
        alert.present();
    }
	
	showToast(message:string) {
		let toast = this.toastCtrl.create({
			message: message,
			duration: 3000,
			position: 'bottom'
		});
		toast.onDidDismiss(() => {
			console.log('Dismissed toast');
		});
		toast.present();
	}
	
}
