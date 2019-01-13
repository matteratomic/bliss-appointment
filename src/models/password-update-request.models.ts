import {Serializable} from "./serializalble.interface";

export class PasswordUpdateRequest {
	password: string;
	new_password: string;
	new_password_confirmation: string;
	
	constructor(password: string, new_password: string, new_password_confirmation: string) {
        this.password = password;
		this.new_password = new_password;
		this.new_password_confirmation = new_password_confirmation;
    }
}