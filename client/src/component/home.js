import React from 'react';
import styles from './styles/home.module.css';
import Cookies from 'universal-cookie';
function home() {
	const cookies = new Cookies();
	const logout = () => {
		cookies.remove('accessToken');
		cookies.remove('refreshToken');
		window.location.reload()
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

export default home;
