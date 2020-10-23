import React, { useState } from 'react';
import styles from './styles/style.module.css';
import axios from 'axios';
// import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
function OtpVerify(props) {
	const cookies = new Cookies();

	const [ error, setError ] = useState({
		error: '',
		success: ''
	});
	const { value, handleChange } = props;
	const back = (e) => {
		e.preventDefault();
		props.prevStep();
	};

	const confirmOtp = () => {
		axios
			.post('http://localhost:8888/verifyOTP', {
				phone: `${value.phone}`,
				hash: `${value.hash}`,
				otp: `${value.otp}`
			})
			.then(function(res) {
				console.log(res.data);
				const { accessToken, refreshToken } = res.data;

				cookies.set('accessToken', accessToken, {
					expires: new Date(new Date().getTime() + 30 * 1000),
					sameSite: 'strict'
				});
				cookies.set('refreshToken', refreshToken, {
					expires: new Date(new Date().getTime() + 31557600000),
					sameSite: 'strict'
				});
				window.location.reload();
				// setError({...error, success:res.data.msg})
			})
			.catch(function(error) {
				console.log(error.response.data);
				setError({ ...error, error: error.response.data.msg });
			});
	};
	const refreshToken = () => {
		console.log('click');
		const refreshToken = cookies.get('refreshToken');
		const config = {
			headers: { 'Content-Type': 'application/json' },
			withCredentials: true
		};
		axios
			.post(
				'http://localhost:8888/home',
				{
					refreshToken: refreshToken
				},
				// config
			)
			.then(function(res) {
				console.log(res);
				const { accessToken } = res.data;

				cookies.set('accessToken', accessToken, {
					expires: new Date(new Date().getTime() + 30 * 1000),
					sameSite: 'strict'
				});
			})
			.catch(function(error) {
				console.log(error.response);
			});
	};
	return (
		<div className={styles}>
			<div className={styles.background}>
				<div className={styles.container}>
					<div className={styles.heading}>PixCase</div>
					<div className={styles.error}>{error.error}</div>
					<div className={styles.success}>{error.success}</div>
					<div className={styles.input_text}>Enter One Time Password:</div>
					<div className={styles.input_container}>
						<input
							type="tel"
							value={value.otp}
							onChange={handleChange('otp')}
							placeholder="Enter the 6 digits OTP"
							className={styles.input}
						/>
					</div>
					<button onClick={back} className={styles.back}>
						Back
					</button>
					<button onClick={confirmOtp} className={styles.submit}>
						Confirm OTP
					</button>
					<button onClick={refreshToken}> Refresh Token </button>
				</div>
			</div>
		</div>
	);
}

export default OtpVerify;
