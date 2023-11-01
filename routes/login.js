const express = require("express");
const { AuthenticateUser } = require("../controller/login");
const router = express.Router();
const client = require("../redis");

client
    .connect()
    .then( () => {
        console.log("Connected to redis");
    })
    .catch((error) => {
        console.log(error);
    });
    
router.post("/", async (req, res) =>{
    try{
        const {email, password} = await req.body;
        const logincredential = await AuthenticateUser(email, password);
    if(logincredential === "Invalid Username Or Password"){
        res.status(200).send("Invalid Username Or Password");
    }
    else if(logincredential === "Server Busy"){
        res.status(200).send("Server Busy");
    } 
    else {
        res.status(200).json({token: logincredential.token});
    }
    } catch (error){
        console.log(error);
        res.status(500).send("Server Busy");
    }
});

module.exports = router;