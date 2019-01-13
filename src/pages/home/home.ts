import {Component} from '@angular/core';
import {AboutPage} from '../about/about';
import {ProfilePage} from '../profile/profile';
import {ServicesPage} from '../services/services';
import {AppointmentPage} from '../appointment/appointment';
import {Blog_DocPage} from '../blog_doc/blog_doc';
import {TestimonialsPage} from '../testimonials/testimonials';
import {GalleryPage} from '../gallery/gallery';
import {AvailabilityPage} from '../availability/availability';
import {ReachPage} from '../reach/reach';
import {ContactPage} from '../contact/contact';
import {Appointment_BookPage} from '../appointment_book/appointment_book';
import { NavController } from 'ionic-angular';

import { ApiClient } from "../../providers/api-client.service";
import { Subscription } from "rxjs/Subscription";

import {AppSetting} from "../../models/app-setting.models";
import {UserUpdateRequest} from "../../models/user-update-request.models";
import {User} from "../../models/user.models";
import { FCM } from '@ionic-native/fcm';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ApiClient]
})
export class HomePage {
	aboutPage = AboutPage;
	servicesPage = ServicesPage;
	appointmentPage = AppointmentPage;
	blog_docPage = Blog_DocPage;
	testimonialsPage = TestimonialsPage;
	galleryPage = GalleryPage;
	availabilityPage = AvailabilityPage;
	reachPage = ReachPage;
	contactPage = ContactPage;
	appointmentbookPage = Appointment_BookPage
	
	private subscriptions:Array<Subscription> = [];
	private doctor_name:string = 'Dr';
	
	constructor(private service:ApiClient, public navCtrl: NavController, private fcm: FCM) {
		let setting: AppSetting = JSON.parse(window.localStorage.getItem('setting'));
		if(setting != null) {
			this.doctor_name = setting.doctor_name;
		}
		this.loadAppSetting();
		this.registerFcmToken();
	}
	
	registerFcmToken() {
		this.fcm.getToken().then(token=> {
			let user:User = JSON.parse(window.localStorage.getItem('user'));
			let userUpdateRequest = new UserUpdateRequest(user.email, user.name, user.mobile);
			userUpdateRequest.fcm_registration_id = token;
			let subscription:Subscription = this.service.updateUser(window.localStorage.getItem('api_key'), userUpdateRequest).subscribe(data => {
			}, err=> {
			});this.subscriptions.push(subscription);
		});
	}
	
	loadAppSetting() {
		let subscription:Subscription = this.service.appSettings(window.localStorage.getItem('api_key')).subscribe(data => {
			let setting: AppSetting = data;
			this.doctor_name = setting.doctor_name;
			window.localStorage.setItem('setting', JSON.stringify(setting));
		}, err=> {
			console.log(err);
		});
		this.subscriptions.push(subscription);
	}
	
	profileScreen() {
		this.navCtrl.push(ProfilePage);
	}
}
