import { JWTService, UserInfo } from '~helpers/jwt';

export class JWTManager {
	userInfo: UserInfo;
	token: string;

	constructor(userInfo: UserInfo) {
		this.token = JWTService.encode(userInfo);
	}
	decode(token = this.token) {
		return JWTService.decode(token);
	}
}
