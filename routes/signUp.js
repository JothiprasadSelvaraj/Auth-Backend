const express = require("express");
const { CheckUser } = require("../controller/login");
const { InsertVerifyUser, InsertSignUpUser } = require("../controller/signUp");
const router = express.Router();

router.get("/:token", async (req, res) => {
    try{
        const response = await InsertSignUpUser(req.params.token);
        res.status(200).send(response);
    } catch(error){
        console.log(error);
        res.status(500).send(
            `<html>
                <body>
                    <h4> Registeration Failed </h4>
                    <p> The Link has been expired..... </p>
                    <p>Regards,</p>
                    <p>Team</p>
                </body>
            </html>`
        );
    }
});

router.post("/verify", async (req, res) => {
    try { 
        const{ name, email, password } = await req.body;
        console.log(name, email, password);

        const registerCredential = await CheckUser(email);
        
            if( registerCredential === false ) {
                await InsertVerifyUser(name, email, password);
                res.status(200).send(true);
            } else if ( registerCredential ===  true ) {
                res.status(200).send(false);
            } else if ( registerCredential === "Server Bussy ..!" ) {
                res.status(500).send("Server Busy")
            }
            } catch (error) {
                console.log(error);
            }
});

module.exports= router;