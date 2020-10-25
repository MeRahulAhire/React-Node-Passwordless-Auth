require('dotenv').config();

const express = require('express');
const cors = require('cors');
var cookieParser = require('cookie-parser');

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const crypto = require('crypto');
const smsKey = process.env.SMS_SECRET_KEY;

const jwt = require('jsonwebtoken');
const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
let refreshTokens = [];

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get('/', (req, res) => {
	res.cookie('AccessToken', `${Math.random()*10000}`, {
		expires: new Date(new Date().getTime() + 30 * 1000),
		sameSite: 'strict',
		httpOnly: true,
		// secure: true,
	}).send('hello')
	
});
app.post('/sendOTP', (req, res) => {
	const phone = req.body.phone;
	const otp = Math.floor(100000 + Math.random() * 900000);
	const ttl = 2 * 60 * 1000;
	const expires = Date.now() + ttl;
	const data = `${phone}.${otp}.${expires}`;
	const hash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
	const fullHash = `${hash}.${expires}`;

	// client.messages
	// 	.create({
	// 		body: `Your One Time Login Password For CFM is ${otp}`,
	// 		from: '+12246555011',
	// 		to: phone
	// 	})
	// 	.then((messages) => console.log(messages))
	// 	.catch((err) => console.error(err));

	res.status(200).send({ phone, hash: fullHash, otp });
});

app.post('/verifyOTP', (req, res) => {
	const phone = req.body.phone;
	const hash = req.body.hash;
	const otp = req.body.otp;
	let [ hashValue, expires ] = hash.split('.');

	let now = Date.now();
	if (now > parseInt(expires)) {
		return res.status(504).send({ msg: 'Timeout. Please try again' });
	}
	let data = `${phone}.${otp}.${expires}`;
	let newCalculatedHash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
	if (newCalculatedHash === hashValue) {
		console.log('user confirmed');
		const accessToken = jwt.sign({ phone }, process.env.JWT_AUTH_TOKEN, { expiresIn: '30s' });
		const refreshToken = jwt.sign({ phone }, process.env.JWT_REFRESH_TOKEN, { expiresIn: '1y' });
		refreshTokens.push(refreshToken);
		res.status(200).send({ accessToken: accessToken, refreshToken: refreshToken, msg: 'Device verified' });
	} else {
		console.log('not authenticated');
		return res.status(400).send({ verification: false, msg: 'Incorrect OTP' });
	}
});

app.post('/home', authenticateUser, (req, res) => {
	res.send('welcome');
});

async function authenticateUser(req, res, next) {
	let token = req.headers['authorization'];
	token = token.split(' ')[1];

	jwt.verify(token, JWT_AUTH_TOKEN, async (err, user) => {
		if (user) {
			req.user = user;
			next();
		} else if (err.message === 'TokenExpiredError') {
			return res.status(403).send({
				success: false,
				msg: 'Access token expired'
			});
		} else {
			console.log(err);
			return res.status(403).send({ err, msg: 'User not authenticated' });
		}
	});
}

app.post('/refresh', (req, res) => {
	const refreshToken = req.body.refreshToken;
	if (!refreshToken) return res.status(403).send({ message: 'Refresh token not found, login again' });
	// if (!!refreshTokens.includes(refreshToken))
	// 	return res.status(403).send({ message: 'Refresh token blocked, login again' });

	jwt.verify(refreshToken, JWT_REFRESH_TOKEN, (err, user) => {
		if (!err) {
			const accessToken = jwt.sign({ username: user.name }, 'access', {
				expiresIn: '30s'
			});
			return res.status(200).send({ previousSessionExpired: true, success: true, accessToken: accessToken });
		} else {
			return res.status(403).send({
				success: false,
				msg: 'Invalid refresh token'
			});
		}
	});
});
app.listen(process.env.PORT || 8888);
