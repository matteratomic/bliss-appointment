import {Component} from '@angular/core';
import {HomePage} from '../home/home';

import { NavController, AlertController, Loading, LoadingController, ToastController } from 'ionic-angular';
import { ApiClient } from "../../providers/api-client.service";
import { Subscription } from "rxjs/Subscription";

import {LoginRequest} from "../../models/login-request.models";
import {RegisterRequest} from "../../models/register-request.models";
import {AuthResponse} from "../../models/auth-response.models";

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
  providers: [ApiClient]
})
export class SigninPage {
	sign:string = "signin";
	
	private loading:Loading;
	private loadingShown:Boolean = false;
	
	private subscriptions:Array<Subscription> = [];
	private credentials:LoginRequest = new LoginRequest('', '');
	private registerRequest:RegisterRequest = new RegisterRequest('', '', '', '');
	private registerRequestPasswordConfirm: string = '';
	
	constructor(private toastCtrl: ToastController, public navCtrl: NavController, private service:ApiClient, private loadingCtrl:LoadingController, private alertCtrl:AlertController) {
		let key: string = window.localStorage.getItem('api_key');
		if(key!=null && key.length>0) {
			navCtrl.setRoot(HomePage);
		}
	}
	
	singIn() {
		if(this.credentials.login.length == 0 || this.credentials.password.length == 0) {
			this.showToast('Phone or Password cannot be empty!');
		} else {
			this.presentLoading('Logging in');
			let subscription:Subscription = this.service.login(this.credentials).subscribe(data => {
				this.dismissLoading();
				let authResponse:AuthResponse = data;
				window.localStorage.setItem('api_key', authResponse.token);
				window.localStorage.setItem('user', JSON.stringify(authResponse.user));
				this.navCtrl.setRoot(HomePage);
			}, err=> {
				this.dismissLoading();
				this.presentErrorAlert("Unable to login with provided credentials");
			});
			this.subscriptions.push(subscription);
		}
	}
	
	singUp() {
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if(this.registerRequest.mobile.length!=10 && Number.isNaN(Number(this.registerRequest.mobile))) {
			this.showToast('Enter valid 10 digit mobile number');
		} else if(this.registerRequest.name.length<4) {
			this.showToast('Enter username atleast 4 char long');
		} else if(this.registerRequest.email.length <= 5 || !reg.test(this.registerRequest.email)) {
            this.showToast('Enter valid email address');
        } else if(this.registerRequest.password.length==0 || !(this.registerRequest.password === this.registerRequestPasswordConfirm)) {
			this.showToast('Enter valid passwords, twice.');
		} else {
			this.presentLoading('Registering user');
			let subscription:Subscription = this.service.register(this.registerRequest).subscribe(data => {
				this.dismissLoading();
				let authResponse:AuthResponse = data;
				window.localStorage.setItem('api_key', authResponse.token);
				window.localStorage.setItem('user', JSON.stringify(authResponse.user));
				this.navCtrl.setRoot(HomePage);
			}, err=> {
				this.dismissLoading();
				this.presentErrorAlert("Unable to register with provided credentials");
			});
			this.subscriptions.push(subscription);
		}
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
