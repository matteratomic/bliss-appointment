import { Component } from '@angular/core';
import {Service} from "../../models/service.models";
import { NavController, AlertController, Loading, LoadingController, ToastController, NavParams } from 'ionic-angular';
import { ApiClient } from "../../providers/api-client.service";
import { Subscription } from "rxjs/Subscription";
import {HomePage} from '../home/home';

import {ApointmentRequest} from "../../models/apointment-request.models";
import {ApointmentResponse} from "../../models/apointment-response.models";

@Component({
  selector: 'page-appointment_confirm',
  templateUrl: 'appointment_confirm.html',
  providers: [ApiClient]
})

export class Appointment_ConfirmPage {
	private subscriptions:Array<Subscription> = [];
	private services = new Array<Service>();
	private selectedTime: string;
	private selectedService: Service;
	
	private loading:Loading;
	private loadingShown:Boolean = false;
	
	constructor(private navParams:NavParams, private toastCtrl: ToastController, public navCtrl: NavController, private service:ApiClient, private loadingCtrl:LoadingController, private alertCtrl:AlertController) {
		let savedList: Array<Service> = JSON.parse(window.localStorage.getItem('services'));
		if(savedList != null && savedList.length!=0) {
			this.services = savedList;
		} else {
			this.loadServices();
		}
		this.selectedTime = this.navParams.get('time');
	}
	
	loadServices() {
		let subscription:Subscription = this.service.serviceList(window.localStorage.getItem('api_key')).subscribe(data => {
		this.services = data;
		window.localStorage.setItem('services', JSON.stringify(this.services));
		}, err=> {
		});
		this.subscriptions.push(subscription);
	}
	
	selectService(service: Service) {
		this.selectedService = service;
	}
	
	confirm() {
		if(this.selectedService == null) {
			this.showToast('Select service');
		} else {
			this.presentLoading('Booking Appointment');
			let subscription:Subscription = this.service.createAppointment(window.localStorage.getItem('api_key'), new ApointmentRequest(this.selectedService.id, this.selectedTime)).subscribe(data => {
				this.dismissLoading();
				let response:ApointmentResponse = data;
				this.presentErrorAlert('Appointment booked', 'Your appointment is reserved and schedules on: ' + response.scheduled_on, true);
			}, err=> {
				this.dismissLoading();
				this.presentErrorAlert('Slot unavailable for appointment', 'Selected Date and Time slot is already booked, Kindly try again with different Date or Time slot.', false);
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
	
	private presentErrorAlert(title:string, msg:string, goHome:boolean) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: msg,
            buttons: [{
				text: 'Okay',
				handler: () => {
					if(goHome) {
						this.navCtrl.setRoot(HomePage);
					} else {
						this.navCtrl.pop();
					}
				}
			}]
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
