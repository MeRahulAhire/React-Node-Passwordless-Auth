import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './styles/home.module.css';

axios.defaults.withCredentials = true;
function Home() {
	const [ state, setstate ] = useState();
	useEffect(() => {
		axios
			.post('http://localhost:8888/home', {
				withCredentials: true,
			})
			.then(function(res) {
				console.log(res.data)
				
			})
			.catch(function(error) {
				console.log(error.response);
			});
	})

	const logout = () => {
		axios
			.get('http://localhost:8888/logout')
			.then((res) => {
				console.log(res.data);
			})
			.catch((err) => {
				console.log(err.response);
			});
		window.location.reload();
	};
	return (
		<div className={styles}>
			<div className={styles.top}>
				<p>PixCase</p>
			</div>
			<div className={styles.bottom}>
				<button onClick={logout} className={styles.logout}>
					Log out
				</button>

				<div className={styles.card} />
				<div className={styles.words}> Private Protected Route - Home</div>
			</div>
		</div>
	);
}

export default Home;
