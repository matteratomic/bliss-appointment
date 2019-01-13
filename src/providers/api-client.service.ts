import {Injectable, Inject} from '@angular/core';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concatMap';
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import {APP_CONFIG, AppConfig} from "../app/app.config";
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AuthResponse} from "../models/auth-response.models";
import {LoginRequest} from "../models/login-request.models";
import {RegisterRequest} from "../models/register-request.models";
import {Service} from "../models/service.models";
import {BlogPost} from "../models/blog-post.models";
import {Testimonial} from "../models/testimonial.models";
import {Photo} from "../models/photo.models";
import {Availability} from "../models/availability.models";
import {Apointment} from "../models/apointment.models";
import {SupportRequest} from "../models/support-request.models";
import {SupportResponse} from "../models/support-response.models";
import {ApointmentRequest} from "../models/apointment-request.models";
import {ApointmentResponse} from "../models/apointment-response.models";
import {AppSetting} from "../models/app-setting.models";
import {UserUpdateRequest} from "../models/user-update-request.models";
import {PasswordUpdateRequest} from "../models/password-update-request.models";
import {User} from "../models/user.models";


@Injectable()
export class ApiClient {
	
	private months = ["January", "February","March","April","May","June","July","August","September","October","November","December"];
	
	constructor(@Inject(APP_CONFIG) private config:AppConfig, private http:HttpClient) {
		
    }
	
	public register(registerRequest:RegisterRequest):Observable<AuthResponse> {
		const myHeaders = new HttpHeaders({'Content-Type':'application/json', 'Accept':'application/json'});
		return this.http
		.post<AuthResponse>(this.config.apiBase + '/register', JSON.stringify(registerRequest), {headers: myHeaders})
        .concatMap(data => {
            return Observable.of(data);
        });
	}
	
	public login(loginRequest:LoginRequest):Observable<AuthResponse> {
		const myHeaders = new HttpHeaders({'Content-Type':'application/json', 'Accept':'application/json'});
		return this.http
		.post<AuthResponse>(this.config.apiBase + '/login', JSON.stringify(loginRequest), {headers: myHeaders})
        .concatMap(data => {
            return Observable.of(data);
        });
	}
	
	public serviceList(token:string):Observable<Array<Service>> {
		const myHeaders = new HttpHeaders({'Authorization':'Bearer ' + token, 'Accept':'application/json'});
		return this.http
        .get<Array<Service>>(this.config.apiBase + '/services', {headers: myHeaders})
        .concatMap(data => {
            return Observable.of(data);
        });
	}
	
	public blogList(token:string):Observable<Array<BlogPost>> {
		const myHeaders = new HttpHeaders({'Authorization':'Bearer ' + token, 'Accept':'application/json'});
		return this.http
        .get<Array<BlogPost>>(this.config.apiBase + '/blogs', {headers: myHeaders})
        .concatMap(data => {
			for(let i=0; i<data.length;i++){
				let post = data[i];
				post.created_at = this.formatDate(new Date(post.created_at));
			}
            return Observable.of(data);
        });
	}
	
	public testimonialList(token:string):Observable<Array<Testimonial>> {
		const myHeaders = new HttpHeaders({'Authorization':'Bearer ' + token, 'Accept':'application/json'});
		return this.http
        .get<Array<Testimonial>>(this.config.apiBase + '/testimonials', {headers: myHeaders})
        .concatMap(data => {
			for(let i=0; i<data.length;i++){
				let post = data[i];
				post.created_at = this.formatDate(new Date(post.created_at));
			}
            return Observable.of(data);
        });
	}
	
	public galleryList(token:string):Observable<Array<Photo>> {
		const myHeaders = new HttpHeaders({'Authorization':'Bearer ' + token, 'Accept':'application/json'});
		return this.http
        .get<Array<Photo>>(this.config.apiBase + '/galleries', {headers: myHeaders})
        .concatMap(data => {
			for(let i=0; i<data.length;i++){
				let post = data[i];
				post.created_at = this.formatDate(new Date(post.created_at));
			}
            return Observable.of(data);
        });
	}
	
	public availabilityList(token:string):Observable<Array<Availability>> {
		const myHeaders = new HttpHeaders({'Authorization':'Bearer ' + token, 'Accept':'application/json'});
		return this.http
        .get<Array<Availability>>(this.config.apiBase + '/availabilities', {headers: myHeaders})
        .concatMap(data => {
            return Observable.of(data);
        });
	}
	
	public updatePassword(token:string, userPasswordRequest:PasswordUpdateRequest):Observable<User> {
		const myHeaders = new HttpHeaders({'Authorization':'Bearer ' + token, 'Accept':'application/json', 'Content-Type':'application/json'});
		return this.http
		.put<User>(this.config.apiBase + '/user/reset-password', JSON.stringify(userPasswordRequest), {headers: myHeaders})
        .concatMap(data => {
            return Observable.of(data);
        });
	}
	
	public updateUser(token:string, userUpdateRequest:UserUpdateRequest):Observable<User> {
		const myHeaders = new HttpHeaders({'Authorization':'Bearer ' + token, 'Accept':'application/json', 'Content-Type':'application/json'});
		return this.http
		.put<User>(this.config.apiBase + '/user', JSON.stringify(userUpdateRequest), {headers: myHeaders})
        .concatMap(data => {
            return Observable.of(data);
        });
	}
	
	public support(token:string, supportRequest:SupportRequest):Observable<SupportResponse> {
		const myHeaders = new HttpHeaders({'Authorization':'Bearer ' + token, 'Accept':'application/json', 'Content-Type':'application/json'});
		return this.http
		.post<SupportResponse>(this.config.apiBase + '/support', JSON.stringify(supportRequest), {headers: myHeaders})
        .concatMap(data => {
            return Observable.of(data);
        });
	}
	
	public createAppointment(token:string, apointmentRequest:ApointmentRequest):Observable<ApointmentResponse> {
		const myHeaders = new HttpHeaders({'Authorization':'Bearer ' + token, 'Accept':'application/json', 'Content-Type':'application/json'});
		return this.http
		.post<ApointmentResponse>(this.config.apiBase + '/appointments', JSON.stringify(apointmentRequest), {headers: myHeaders})
        .concatMap(data => {
            return Observable.of(data);
        });
	}
	
	public appointmentList(token:string):Observable<Array<Apointment>> {
		const myHeaders = new HttpHeaders({'Authorization':'Bearer ' + token, 'Accept':'application/json'});
		return this.http
		.get<Array<Apointment>>(this.config.apiBase + '/appointments', {headers: myHeaders})
        .concatMap(data => {
            return Observable.of(data);
        });
	}
	
	public cancelAppointment(token:string, apointId:number):Observable<Apointment> {
		const myHeaders = new HttpHeaders({'Authorization':'Bearer ' + token, 'Accept':'application/json'});
		return this.http
		.get<Apointment>(this.config.apiBase + '/appointments/' + apointId + '/cancel', {headers: myHeaders})
        .concatMap(data => {
            return Observable.of(data);
        });
	}
	
	public appSettings(token:string):Observable<AppSetting> {
		const myHeaders = new HttpHeaders({'Authorization':'Bearer ' + token, 'Accept':'application/json'});
		return this.http
		.get<AppSetting>(this.config.apiBase + '/settings', {headers: myHeaders})
        .concatMap(data => {
            return Observable.of(data);
        });
	}
	
	private formatDate(date:Date):string {
		return date.getDate() + ' ' + this.months[date.getMonth()] + ', '+ date.getFullYear();
	}
	
}