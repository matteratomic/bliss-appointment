import {Serializable} from "./serializalble.interface";

export class RegisterRequest {
	email: string;
	name: string;
	mobile: string;
	password: string;
	
	constructor(email: string, name: string, mobile: string, password: string) {
        this.email = email;
		this.name = name;
		this.mobile = mobile;
		this.password = password;
    }
}