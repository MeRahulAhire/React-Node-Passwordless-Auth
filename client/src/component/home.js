import React from 'react';
import styles from './styles/home.module.css';
function home() {
	return (
		<div className={styles}>
			<div className={styles.top}>
				<p>PixCase</p>
			</div>
			<div className={styles.bottom}>
				<button className={styles.logout}>Log out</button>

				<div className={styles.card} />
                <div className={styles.words}> Private Protected Route - Home</div>
			</div>
		</div>
	);
}

export default home;
