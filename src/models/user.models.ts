import {Serializable} from "./serializalble.interface";

export class User {
	id: number;
	active: number;
	confirmed: number;
	mobile: string;
	name: string;
	email: string;
	confirmation_code: string;
}