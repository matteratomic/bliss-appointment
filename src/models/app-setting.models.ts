import {Serializable} from "./serializalble.interface";

export class AppSetting {
	id: number;
	slot: number;
	app_title: string;
	clinic_name: string;
	doctor_name: string;
	mobile_number: string;
	email: string;
	address: string;
	longitude: number;
	latitude: number;
}