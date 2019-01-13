import {Serializable} from "./serializalble.interface";

export class ApointmentResponse {
	id: number;
	user_id: number;
	service_id: number;
	scheduled_on: string;
}