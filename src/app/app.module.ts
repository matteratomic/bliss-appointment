import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';

import {PhotoViewer} from '@ionic-native/photo-viewer';

import {SigninPage} from '../pages/signin/signin';
import {HomePage} from '../pages/home/home';
import {AboutPage} from '../pages/about/about';
import {ServicesPage} from '../pages/services/services';
import {AppointmentPage} from '../pages/appointment/appointment';
import {Appointment_BookPage} from '../pages/appointment_book/appointment_book';
import {Appointment_ConfirmPage} from '../pages/appointment_confirm/appointment_confirm';
import {BlogPage} from '../pages/blog/blog';
import {Blog_DocPage} from '../pages/blog_doc/blog_doc';
import {TestimonialsPage} from '../pages/testimonials/testimonials';
import {GalleryPage} from '../pages/gallery/gallery';
import {AvailabilityPage} from '../pages/availability/availability';
import {ReachPage} from '../pages/reach/reach';
import {ContactPage} from '../pages/contact/contact';
import {ItemDetailsPage} from '../pages/item-details/item-details';
import {ListPage} from '../pages/list/list';
import {ProfilePage} from '../pages/profile/profile';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';

import { APP_CONFIG, BaseAppConfig } from "./app.config";
import { ApiClient } from "../providers/api-client.service";

@NgModule({
  declarations: [
    MyApp,
    SigninPage,
    HomePage,
    AboutPage,
    ServicesPage,
    AppointmentPage,
    Appointment_BookPage,
    Appointment_ConfirmPage,
    BlogPage,
    Blog_DocPage,
    TestimonialsPage,
    GalleryPage,
    AvailabilityPage,
    ReachPage,
    ContactPage,
    ItemDetailsPage,
    ListPage,
	ProfilePage
  ],
  imports: [
    BrowserModule,
	HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SigninPage,
    HomePage,
    AboutPage,
    ServicesPage,
    AppointmentPage,
    Appointment_BookPage,
    Appointment_ConfirmPage,
    BlogPage,
    Blog_DocPage,
    TestimonialsPage,
    GalleryPage,
    AvailabilityPage,
    ReachPage,
    ContactPage,
    ItemDetailsPage,
    ListPage,
	ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    PhotoViewer,
	FCM,
	{provide: APP_CONFIG, useValue: BaseAppConfig},
    {provide: ErrorHandler, useClass: IonicErrorHandler},
	ApiClient
  ]
})
export class AppModule {
}
