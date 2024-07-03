import { jwtDecode } from 'jwt-decode';
/**
 * todo to fix this error of JWT, it posts error but it's useable (trust me)
 * and because it's conflicted with the eslint.config.js, Any attempt to fix this style
 * will result with an error from eslint.config.js file.
 * And since we may not use this JWT in actual practice. just leave it be
 */
import jwt from 'jsonwebtoken';
export interface UserInfo {
	firstName: string;
	lastName: string;
	email: string;
	isActive: boolean;
}

export namespace JWTService {
	const secret = 'secretkodkod';
	const { sign } = jwt;
	export const encode = (obj: UserInfo) => {
		return sign(obj, secret, { expiresIn: 300 });
	};
	export const decode = (token: string) => {
		return jwtDecode(token);
	};
}
