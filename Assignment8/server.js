const express = require("express");
const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/Assignment";

const app = express();

mongoose.connect(url, { useNewUrlParser: true });
const con = mongoose.connection;

con.on("open", () => {
    console.log("Database connection established successfully");
});

app.use(express.json());

const userRouter = require("./routes/user");
app.use("/user", userRouter);

app.listen(8080, () => {
    console.log("Server started");
});