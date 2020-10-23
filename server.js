require('dotenv').config();

const express = require('express');
const cors = require('cors');

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

app.get('/', (req, res) => {
	res.send('hello world');
});
app.post('/sendOTP', (req, res) => {
	const phone = req.body.phone;
	const otp = Math.floor(100000 + Math.random() * 900000);
	const ttl = 2 * 60 * 1000;
	const expires = Date.now() + ttl;
	const data = `${phone}.${otp}.${expires}`;
	const hash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
	const fullHash = `${hash}.${expires}`;

	client.messages
		.create({
			body: `Your One Time Login Password For CFM is ${otp}`,
			from: '+12246555011',
			to: phone
		})
		.then((messages) => console.log(messages))
		.catch((err) => console.error(err));

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
		res.status(200).send({ accessToken: accessToken, refreshToken: refreshToken, msg: 'Device verified'});
	} else {
		console.log('not authenticated');
		return res.status(400).send({ verification: false, msg: 'Incorrect OTP' });
		// send({ verification: false, msg: 'Incorrect OTP' });
	}
});

app.post('/home', authenticateUser, (req, res) => {
	res.send('welcome');
});

async function authenticateUser(req, res, next) {
	let token = req.headers['authorization'];
	const refreshToken = req.body.refreshToken;

	token = token.split(' ')[1];
	jwt.verify(token, JWT_AUTH_TOKEN, async (err, phone) => {
		if (phone) {
			req.phone = phone;
			next();
		} else if (err.name === 'TokenExpiredError') {
			// const refreshToken = req.body.refreshToken;
			if (!refreshToken || !refreshTokens.includes(refreshToken)) {
				return res.json({ msg: 'Token not found, login again' });
			} else {
				jwt.verify(refreshToken, JWT_REFRESH_TOKEN, (err, phone) => {
					if (err.name === 'TokenExpiredError')
						return res
							.status(403)
							.send({ refreshTokenExpired: true, msg: 'Token expired login again, login again' });
					if (!err) {
						const accessToken = jwt.sign({ phone }, JWT_AUTH_TOKEN, { expiresIn: '30s' });
						return res.status(200).send({ sessionExpired: true, success: true, accessToken });
					} else {
						return res.status(403).send({
							success: false,
							msg: 'Invalid refresh token'
						});
					}
				});
			}
		}
	});
}

app.listen(process.env.PORT || 8888);
