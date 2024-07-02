import { sign } from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';

export interface UserInfo {
	firstName: string;
	lastName: string;
	email: string;
	isActive: boolean;
}

export namespace JWTService {
	const secret = 'secretkodkod';
	export const encode = (obj: UserInfo) => {
		return sign(obj, secret, { expiresIn: 300 });
	};
	export const decode = (token: string) => {
		return jwtDecode(token);
	};
}
