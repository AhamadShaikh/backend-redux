const { default: mongoose } = require("mongoose");

const bTokenSchema = mongoose.Schema({
    token: { type: String, required: true }
})

const BlacklistToken = mongoose.model("blacklisttoken", bTokenSchema)

module.exports = BlacklistToken