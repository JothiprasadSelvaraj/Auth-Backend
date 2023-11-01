const express = require("express");
const { AuthorizeUser } = require("../controller/login");
const router = express.Router();

router.get("/", async (req, res) => {
    try{
        const auth_token = await req.headers.authorization;
        const loginCredentials = await AuthorizeUser(auth_token);
        if(loginCredentials === false){
            res.status(200).send("Invalid Token");
        } else {
            res.status(200).json(loginCredentials);
        }
    } catch(error){
        console.log(error);
        res.status(400).send("Server Busy");
    }
});

module.exports = router;