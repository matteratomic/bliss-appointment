import {Serializable} from "./serializalble.interface";
import {Service} from "./service.models";

export class Apointment {
	id: number;
	user_id: number;
	service: Service;
	scheduled_on: string;
	status: string;
	
	dateMonth: string;
	dateDate: string;
	dateDay: string;
	dateTime: string;
}