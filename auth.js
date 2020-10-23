require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN


module.exports ={

    token: async (phone) => {
        
       await jwt.sign( {phone} , JWT_AUTH_TOKEN, { expiresIn: '30s' }, (err, token) => {
            res.json({
                "token":token
            });
        });
    },
    refreshToken: () => {
        // const phone = req.body.phone;
        jwt.sign( {phone} , JWT_REFRESH_TOKEN, { expiresIn: '30s' }, (err, token) => {
            res.json({
                "refreshToken":token
            });
        });
    }
    
}

