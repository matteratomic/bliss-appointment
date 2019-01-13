import { Component } from '@angular/core';
import { NavController, AlertController, Loading, LoadingController, ToastController } from 'ionic-angular';
import { Appointment_ConfirmPage } from '../appointment_confirm/appointment_confirm';
import {Availability} from "../../models/availability.models";
import { ApiClient } from "../../providers/api-client.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'page-appointment_book',
  templateUrl: 'appointment_book.html',
  providers: [ApiClient]
})

export class Appointment_BookPage {
	private loading:Loading;
	private loadingShown:Boolean = false;
	private availabilities = new Array<Availability>();
	private subscriptions:Array<Subscription> = [];
	private availabilityTimes:Array<Array<string>>;
	private availabilityTime = new Array<string>();
	dates: Array<Date> = [];
	dateSelected: Date;
	timeSelected: string;
	weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
	months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
	
	constructor(private toastCtrl: ToastController, public navCtrl: NavController, private service:ApiClient, private loadingCtrl:LoadingController, private alertCtrl:AlertController) {
		for(let i=0; i<7; i++) {
			let d = new Date();
			d.setDate(d.getDate() + i);
			this.dates.push(d);
		}
		this.loadAvailabilityList();
	}
	
	loadAvailabilityList() {
		this.presentLoading('Refreshing availabilities');
		let subscription:Subscription = this.service.availabilityList(window.localStorage.getItem('api_key')).subscribe(data => {
		this.availabilities = data;
		this.loadTimes();
		this.dismissLoading();
		}, err=> {
			console.log('loading error');
			this.dismissLoading();
			this.presentErrorAlert("Unable to process your request at this time");
		});
		this.subscriptions.push(subscription);
	}
	
	loadTimes() {
		this.availabilityTimes = new Array<Array<string>>();
		for(let i = 0; i < 7; i++){
			this.availabilityTimes.push(new Array<string>());
		}
		let date = new Date();
		for (let avail of this.availabilities) {
			let dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(avail.start.split(':')[0]), Number(avail.start.split(':')[1]), 0);
			let dateEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(avail.end.split(':')[0]), Number(avail.end.split(':')[1]), 0);
			
			let availabilityTime = new Array<string>();
			let time: number = dateStart.getTime();
			while(time <= dateEnd.getTime()) {
				let dateIn = new Date(time);
				availabilityTime.push((dateIn.getHours()<10?('0'+dateIn.getHours()):String(dateIn.getHours())) +':'+ (dateIn.getMinutes()<10?('0'+dateIn.getMinutes()):String(dateIn.getMinutes())) +':00');
				time = time + 1800000;
			}
			switch(avail.day) {
				case "SUN": {
					this.availabilityTimes[0] = availabilityTime;
					break;
				}
				case "MON": {
					this.availabilityTimes[1] = availabilityTime;
					break;
				}
				case "TUE": {
					this.availabilityTimes[2] = availabilityTime;
					break;
				}
				case "WED": {
					this.availabilityTimes[3] = availabilityTime;
					break;
				}
				case "THU": {
					this.availabilityTimes[4] = availabilityTime;
					break;
				}
				case "FRI": {
					this.availabilityTimes[5] = availabilityTime;
					break;
				}
				case "SAT": {
					this.availabilityTimes[6] = availabilityTime;
					break;
				}
			}
		}
		this.markSelected(this.dates[0]);
		console.log(this.availabilityTimes);
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
	
	markSelected(date) {
		this.dateSelected = date;
		//dates sun mon tue wed thu fri sat
		//availabilityTimes mon tue wed thu fri sat sun
		this.availabilityTime = this.availabilityTimes[date.getDay()];
	}
	
	selectedTime(time) {
		this.timeSelected = time;
		//console.log('date: '+this.dateSelected.getFullYear()+'-'+((this.dateSelected.getMonth()+1)<10?'0'+(this.dateSelected.getMonth()+1):(this.dateSelected.getMonth()+1))+'-'+this.dateSelected.getDate()+' '+this.timeSelected);
	}
	
	next() {
		if(this.dateSelected == null) {
			this.showToast("Select date");
		} else if(this.timeSelected == null) {
			this.showToast("Select time");
		} else {
			let selectedTime: string = this.dateSelected.getFullYear()+'-'+((this.dateSelected.getMonth()+1)<10?'0'+(this.dateSelected.getMonth()+1):(this.dateSelected.getMonth()+1))+'-'+((this.dateSelected.getDate())<10?'0'+(this.dateSelected.getDate()):(this.dateSelected.getDate()))+' '+this.timeSelected;
			
			let apointmentDate:Date = new Date(selectedTime);
			let today = new Date();
			
			if(apointmentDate > today) {
				this.navCtrl.push(Appointment_ConfirmPage, {time:selectedTime});
			} else {
				this.showToast('selected time has already passed.');
			}
		}
	}
}
