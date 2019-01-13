import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, ToastController } from 'ionic-angular';

import { SigninPage } from '../pages/signin/signin';
import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { ServicesPage } from '../pages/services/services';
import { AppointmentPage } from '../pages/appointment/appointment';
import { Appointment_BookPage } from '../pages/appointment_book/appointment_book';
import { Appointment_ConfirmPage } from '../pages/appointment_confirm/appointment_confirm';
import { Blog_DocPage } from '../pages/blog_doc/blog_doc';
import { BlogPage } from '../pages/blog/blog';
import { TestimonialsPage } from '../pages/testimonials/testimonials';
import { GalleryPage } from '../pages/gallery/gallery';
import { AvailabilityPage } from '../pages/availability/availability';
import { ReachPage } from '../pages/reach/reach';
import { ContactPage } from '../pages/contact/contact';
import { ListPage } from '../pages/list/list';
import { FCM } from '@ionic-native/fcm';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HomePage the root (or first) page
  rootPage = SigninPage
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
	private fcm: FCM,
	private toastCtrl: ToastController
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Sign In', component: SigninPage },
      { title: 'Dentle care', component: HomePage },
      { title: 'About Us', component: AboutPage },
      { title: 'Services', component: ServicesPage },
      { title: 'Appointment', component: AppointmentPage },
      { title: 'Book An Appointment', component: Appointment_BookPage },
      { title: 'Appointment Confirm', component: Appointment_ConfirmPage },
      { title: 'Doc Blog', component: Blog_DocPage },
      { title: 'Blog', component: BlogPage },
      { title: 'Testimonials', component: TestimonialsPage },
      { title: 'Gallery', component: GalleryPage },
      { title: 'Availability', component: AvailabilityPage },
      { title: 'Reach Us', component: ReachPage },
      { title: 'Contact Us', component: ContactPage },
      { title: 'My First List', component: ListPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
	  this.setupFcm();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  
	setupFcm() {
		this.fcm.subscribeToTopic('all');
		this.fcm.getToken().then(token=> {
			
		})
		this.fcm.onNotification().subscribe(data=>{
			console.log(data);
			if(data.wasTapped) {
				this.nav.setRoot(SigninPage);
				console.log("Received in background");
			} else {
				this.showToast("Appointment notification.");
				this.nav.push(AppointmentPage);
				console.log("Received in foreground");
			};
		})
		this.fcm.onTokenRefresh().subscribe(token=>{
			console.log(token);
		});
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

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
