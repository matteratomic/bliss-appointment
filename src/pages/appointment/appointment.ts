import { Component } from '@angular/core';
import { Appointment_BookPage } from '../appointment_book/appointment_book';
import { NavController, AlertController, Loading, LoadingController, ToastController } from 'ionic-angular';
import { ApiClient } from "../../providers/api-client.service";
import { Subscription } from "rxjs/Subscription";
import {Apointment} from "../../models/apointment.models";

@Component({
  selector: 'page-appointment',
  templateUrl: 'appointment.html',
  providers: [ApiClient]
})

export class AppointmentPage {
	appointmentbookPage = Appointment_BookPage;
	appointment: string = "coming";
	
	private upcoming = new Array<Apointment>();
	private past = new Array<Apointment>();
	private loading:Loading;
	private loadingShown:Boolean = false;
	private subscriptions:Array<Subscription> = [];
	
	private months = ["January", "February","March","April","May","June","July","August","September","October","November","December"];
	private weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
	
	constructor(public navCtrl: NavController, private service:ApiClient, private loadingCtrl:LoadingController, private alertCtrl:AlertController, private toastCtrl: ToastController) {
		this.appointmentList();
	}
	
	appointmentList() {
		this.presentLoading('Refreshing appointments');
		let subscription:Subscription = this.service.appointmentList(window.localStorage.getItem('api_key')).subscribe(data => {
			this.dismissLoading();
			let appointments: Array<Apointment> = data;
			let upcoming = new Array<Apointment>();
			let past = new Array<Apointment>();
			let today = new Date();
			for(let i=0; i<appointments.length; i++) {
				let apointmentDate:Date = new Date(appointments[i].scheduled_on);
				
				appointments[i].dateMonth = this.months[apointmentDate.getMonth()];
				appointments[i].dateDate = String(apointmentDate.getDate());
				appointments[i].dateDay = this.weekDays[apointmentDate.getDay()];
				appointments[i].dateTime = apointmentDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
				
				if(apointmentDate > today) {
					upcoming.push(appointments[i]);
				} else {
					past.push(appointments[i]);
				}
			}
			this.upcoming = upcoming;
			this.past = past;
		}, err=> {
			console.log('loading error');
			this.dismissLoading();
			this.presentErrorAlert("Unable to process your request at this time");
		});
		this.subscriptions.push(subscription);
	}
	
	cancel(apoint:Apointment) {
		let alert = this.alertCtrl.create({
            title: 'Cancel appointment',
            subTitle: 'Are you sure you want to cancel this appointment?',
            buttons: [{
				text: 'Yes',
				handler: () => {
					this.showToast('Cancelling appointment');
					let subscription:Subscription = this.service.cancelAppointment(window.localStorage.getItem('api_key'), apoint.id).subscribe(data => {
						this.upcoming = new Array<Apointment>();
						this.past = new Array<Apointment>();
						this.appointmentList();
					}, err=> {
						console.log('loading error');
						this.dismissLoading();
						this.presentErrorAlert("Unable to process your request at this time");
					});
					this.subscriptions.push(subscription);
				}
			}, {
				text: 'No',
				handler: () => {
				}
			}]
        });
        alert.present();
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
