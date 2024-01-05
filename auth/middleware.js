const jwt = require('jsonwebtoken')

const middleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            res.status(400).json({ message: "token not provided" });
        }

        const decode = jwt.verify(token, "ironman")

        if (!decode) {
            res.status(400).json({ message: "Wrong credentials" });
        }

        req.userId = decode.userId
        req.name = decode.name

        next()

    } catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
}

module.exports = middleware
