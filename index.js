// console.log("hello world");

const express = require("express");
const connectdb = require("./db");

const signUpRouter = require("./routes/signUp");
const loginRouter = require("./routes/login");
const homeRouter = require("./routes/home");

const cors = require("cors");

const app = express();
const port = 4000;
connectdb();

app.use(express.json());
app.use(cors({orgin:"*"}));

app.use("/signUp",signUpRouter);
app.use("/login",loginRouter);
app.use("/home",homeRouter);

app.get("/",(req ,res) => {
    res.send("Hello ... welcome to the site");
});

app.get("/mysite",(req ,res) => {
    // res.send("this is a demo workspace");
    res.send("All is well ..!");
});


app.listen(port, () => {
    console.log('Example app listening on port '+port);
});