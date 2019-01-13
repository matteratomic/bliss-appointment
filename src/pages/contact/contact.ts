import {Component} from '@angular/core';

import { NavController, AlertController, Loading, LoadingController } from 'ionic-angular';
import { ApiClient } from "../../providers/api-client.service";
import { Subscription } from "rxjs/Subscription";
import { ToastController } from 'ionic-angular';

import {SupportRequest} from "../../models/support-request.models";
import {SupportResponse} from "../../models/support-response.models";
import {AppSetting} from "../../models/app-setting.models";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
  providers: [ApiClient]
})

export class ContactPage {
	private loading:Loading;
	private loadingShown:Boolean = false;
	
	private subscriptions:Array<Subscription> = [];
	private credentials:SupportRequest = new SupportRequest('', '', '');
	private email:string;
	private mobile_number:string;
	
	constructor(private toastCtrl: ToastController, public navCtrl: NavController, private service:ApiClient, private loadingCtrl:LoadingController, private alertCtrl:AlertController) {
		let setting: AppSetting = JSON.parse(window.localStorage.getItem('setting'));
		if(setting != null) {
			this.email = setting.email;
			this.mobile_number = setting.mobile_number;
		}
	}
	
	sendSupport() {
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if(this.credentials.name.length==0) {
			this.showToast('Enter username', false);
		} else if(this.credentials.email.length <= 5 || !reg.test(this.credentials.email)) {
            this.showToast('Enter valid email address', false);
        } else if(this.credentials.message.length==0) {
			this.showToast('Enter valid message', false);
		} else {
			this.presentLoading('Submitting request');
			let subscription:Subscription = this.service.support(window.localStorage.getItem('api_key'), this.credentials).subscribe(data => {
				this.dismissLoading();
				this.showToast('Request submitted', true);
			}, err=> {
				this.dismissLoading();
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
            title: 'Error',
            subTitle: msg,
            buttons: ['Dismiss']
        });
        alert.present();
    }
	
	showToast(message:string, goBack:boolean) {
		let toast = this.toastCtrl.create({
			message: message,
			duration: 2000,
			position: 'bottom'
		});
		toast.onDidDismiss(() => {
			console.log('Dismissed toast');
			if(goBack) { this.navCtrl.pop(); }
		});
		toast.present();
	}
}
