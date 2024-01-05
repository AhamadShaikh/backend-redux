const express = require("express")
const { default: mongoose } = require("mongoose")
require("dotenv").config()
const app = express()
const userRouter = require("./routes/userRoutes")
const bookRouter = require("./routes/bookRoutes")
const cors = require("cors")
const bodyParser = require('body-parser');


app.use(bodyParser.json());

app.use(express.json())

const connectToDatabase = () => {
    const URL = process.env.MONGO_URL
    try {
        mongoose.connect(URL)
        console.log('connected to database');
    } catch (error) {
        console.log(error);
    }
}

app.use(cors({
    origin: 'http://localhost:3000'
}))

app.use("/api", userRouter)
app.use("/api", bookRouter)

const PORT = process.env.PORT || 7000

app.listen(PORT, () => {
    connectToDatabase()
    console.log(`Port is runnig on ${PORT}`);
})