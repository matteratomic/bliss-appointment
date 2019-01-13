import {Serializable} from "./serializalble.interface";

export class UserUpdateRequest {
	email: string;
	name: string;
	mobile: string;
	fcm_registration_id: string;
	
	constructor(email: string, name: string, mobile: string) {
        this.email = email;
		this.name = name;
		this.mobile = mobile;
    }
}