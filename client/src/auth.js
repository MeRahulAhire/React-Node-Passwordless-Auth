import axios from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

axios.defaults.withCredentials = true;
class Auth {
	constructor() {
		this.authenticated = false;
	}

	isAuthenticated() {
		const accessToken = cookies.get('authSession');
		const refreshToken = cookies.get('refreshTokenID');
		if (!accessToken && !refreshToken) {
			return (this.authenticated = false);
		}
		if (accessToken && refreshToken) {
			return (this.authenticated = true);
		}
		if (!accessToken && refreshToken) {
			axios
				.post('http://localhost:8888/refresh', {
					withCredentials: true,
					'phone':789456
					// credentials: 'include'
				})
				.then(function(res) {
					console.log(res.data);
					const { accessToken } = res.data;

					cookies.set('accessToken', accessToken, {
						expires: new Date(new Date().getTime() + 30 * 1000),
						sameSite: 'strict'
					});
					window.location.reload();
				})
				.catch(function(error) {
					console.log(error.response);
				});
		}
	}
}

export default new Auth();
