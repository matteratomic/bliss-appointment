import { Component } from '@angular/core';
import {Photo} from "../../models/photo.models";
import { NavController, AlertController, Loading, LoadingController } from 'ionic-angular';
import { ApiClient } from "../../providers/api-client.service";
import { Subscription } from "rxjs/Subscription";
import { ToastController } from 'ionic-angular';
import {PhotoViewer} from '@ionic-native/photo-viewer';

@Component({
  selector: 'page-gallery',
  templateUrl: 'gallery.html',
  providers: [ApiClient]
})

export class GalleryPage {
	private loading:Loading;
	private loadingShown:Boolean = false;
	private subscriptions:Array<Subscription> = [];
	private gallery = new Array<Photo>();
	
	constructor(private toastCtrl: ToastController, public navCtrl: NavController, private service:ApiClient, private loadingCtrl:LoadingController, private alertCtrl:AlertController, private photoViewer:PhotoViewer) {
		this.loadPhotos();
	}
	
	loadPhotos() {
		this.presentLoading('Loading gallery');
		let subscription:Subscription = this.service.galleryList(window.localStorage.getItem('api_key')).subscribe(data => {
		this.gallery = data;
		this.dismissLoading();
		}, err=> {
			console.log('loading error');
			this.dismissLoading();
			this.presentErrorAlert("Unable to process your request at this time");
		});
		this.subscriptions.push(subscription);
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
	
	private showImage(photo: Photo) {
		this.photoViewer.show(photo.image_url);
	}
}
