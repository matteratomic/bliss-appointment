//import {Platform, AlertController} from 'ionic-angular';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

import {Appointment_BookPage} from '../appointment_book/appointment_book';
import {AppSetting} from "../../models/app-setting.models";

declare var google;

@Component({
  selector: 'page-reach',
  templateUrl: 'reach.html'
})
export class ReachPage {
	@ViewChild('map') mapElement: ElementRef;
	map: any;
	appointmentbookPage = Appointment_BookPage;
	
	address:string;
	latitude:number = 28.634418;
	longitude:number = 77.219184;
	
	constructor(public navCtrl: NavController) {
		let setting: AppSetting = JSON.parse(window.localStorage.getItem('setting'));
		if(setting != null) {
			this.address = setting.address;
			this.latitude = setting.latitude;
			this.longitude = setting.longitude;
		}
    }
	
	ionViewDidLoad(){
		this.loadMap();
	}
	
	loadMap() {
		let latLng = new google.maps.LatLng(this.latitude, this.longitude);
 
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
 
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
		
		let marker = new google.maps.Marker({
			position: latLng,
			map: this.map,
			title: 'We are here!'
		});
	}
	
	openMap() {
		window.open('https://www.google.com/maps/dir/?api=1&destination=' + this.latitude + ',' + this.longitude);
	}

}

