import React, { useState } from 'react';
import styles from './styles/style.module.css';
import axios from 'axios';

function OtpVerify(props) {
	axios.defaults.withCredentials = true;

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
				otp: `${value.otp}`,
				withCredentials: true
			})
			.then(function(res) {
				console.log(res.data);
				window.location.reload();
			})
			.catch(function(error) {
				console.log(error.response.data);
				setError({ ...error, error: error.response.data.msg });
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
				</div>
			</div>
		</div>
	);
}

export default OtpVerify;
