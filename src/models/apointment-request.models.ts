import {Serializable} from "./serializalble.interface";

export class ApointmentRequest {
	service_id: number;
	scheduled_on: string;
	
	constructor(service_id: number, scheduled_on: string) {
        this.service_id = service_id;
		this.scheduled_on = scheduled_on;
    }
}