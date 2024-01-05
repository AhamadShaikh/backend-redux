const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt")
const User = require('../models/userModel')
const jwt = require("jsonwebtoken")
const BlacklistToken = require('../models/blacklist')

router.post("/register", async (req, res) => {
    const { email, password } = req.body
    try {
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ msg: 'user already registered' })
        }

        const bcryptPass = await bcrypt.hash(password, 10)

        const newUser = await User.create({ ...req.body, password: bcryptPass })

        // await newUser.save()

        return res.status(200).json({ msg: 'user registered' })

    } catch (error) {
        res.status(500).json({ msg: 'internal server error' })
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const existingUser = await User.findOne({ email })

        if (!existingUser) {
            return res.status(400).json({ msg: 'user register first' })
        }

        const verifyPass = await bcrypt.compare(password, existingUser.password);

        if (!verifyPass) {
            return res.status(400).json({ msg: 'wrong credentials' })
        }

        const token = jwt.sign({ userId: existingUser._id, name: existingUser.username }, "ironman", { expiresIn: '2d' })

        const rToken = jwt.sign({ userId: existingUser._id, name: existingUser.username }, "thanos", { expiresIn: '5d' })

        return res.status(200).json({ msg: 'user logged in ', token: token, rToken: rToken })

    } catch (error) {
        res.status(500).json({ msg: 'internal server error' })
    }
})

router.get("/logout", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(400).json({ message: "Token not provided" });
        }

        const isTokenBlacklisted = await BlacklistToken.exists({ token });

        if (isTokenBlacklisted) {
            return res.status(400).json({ message: "Token has already been invalidated" });
        }

        await BlacklistToken.create({ token });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout failed:", error);
        res.status(500).json({ message: "Logout failed" });
    }
});

module.exports = router