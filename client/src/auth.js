import axios from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class Auth {
	// accessToken = cookies.get('accessToken');
	// refreshToken = cookies.get('refreshToken');
	constructor() {
		this.authenticated = false;
	}

	login() {
		const accessToken = cookies.get('accessToken');
        const refreshToken = cookies.get('refreshToken');

		if (!accessToken && !refreshToken) {
			this.authenticated = false;
		}
		if (accessToken && refreshToken) {
			this.authenticated = true;
		}
		if (!accessToken && refreshToken) {
            const refreshToken = cookies.get('refreshToken');
			axios
				.post('http://localhost:8888/home', {
					refreshToken
				})
				.then(function(res) {
					console.log(res.data);
					const { accessToken } = res.data;

					cookies.set('accessToken', accessToken, {
						expires: new Date(new Date().getTime() + 30 * 1000),
						sameSite: 'strict'
					});
					this.authenticated = true;
				})
				.catch(function(error) {
					console.log(error.response);
				});
		}

	}

	isAuthenticated() {
		return this.login;
	}
}
export default new Auth();

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'universal-cookie';
// const cookies = new Cookies();

// function auth() {
// 	const [ authState, setAuthState ] = useState({auth: false});
// 	// useEffect(() => {
// 	const accessToken = cookies.get('accessToken');
// 	const refreshToken = cookies.get('refreshToken');

// 	if (!accessToken && !refreshToken) {
// 		setAuthState({...authState, auth: false });
// 	}
// 	if (accessToken && refreshToken) {
// 		setAuthState({ ...authState, auth: true });
// 	}
// 	if (!accessToken && refreshToken) {
// 		axios
// 			.post('http://localhost:8888/home', {
// 				refreshToken
// 			})
// 			.then(function(res) {
// 				console.log(res.data);
// 				const { accessToken } = res.data;

// 				cookies.set('accessToken', accessToken, {
// 					expires: new Date(new Date().getTime() + 30 * 1000),
// 					sameSite: 'strict'
// 				});
// 				setAuthState({ ...authState, auth: true  });
// 			})
// 			.catch(function(error) {
// 				console.log(error.response);
// 			});
// 	}
// 	return authState.auth
	
// 	// });
// }


// export default auth
