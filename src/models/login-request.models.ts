import {Serializable} from "./serializalble.interface";

export class LoginRequest {
	login: string;
	password: string;
	
	constructor(login: string, password: string) {
        this.login = login;
		this.password = password;
    }
}