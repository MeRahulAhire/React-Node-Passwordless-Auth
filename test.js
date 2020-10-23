function test(){
    render1() {
        console.log("one")
    }
    render2(){
        console.log("two")
    }
    render1()
    render2()
}
jwt.verify(token, JWT_AUTH_TOKEN, async (err, phone) => {
    if (phone) {
        req.phone = phone;
        next();
    } else if (err.message === "jwt expired") {
        const refreshToken = req.body.token;
        if (!refreshToken || !refreshTokens.includes(refreshToken)) {
            return res.json({ message: "Refresh token not found, login again" });
        }
        
    } else {
        console.log(err);
        return res
            .status(403)
            .json({ err, message: "User not authenticated" });
    }
});

const addUser = async (req, res, next) => {
    const token = req.headers['x-token'];
    if (token) {
      try {
        const { user } = jwt.verify(token, SECRET);
        req.user = user;
      } catch (err) {
        const refreshToken = req.headers['x-refresh-token'];
        const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET_2);
        if (newTokens.token && newTokens.refreshToken) {
          res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
          res.set('x-token', newTokens.token);
          res.set('x-refresh-token', newTokens.refreshToken);
        }
        req.user = newTokens.user;
      }
    }
    next();
  };