const User = require("../models/User");
const { sendMail }= require("./sendMail");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const verifyUser = require("../models/verifyUser");
dotenv.config();

async function InsertVerifyUser(name, email, password){
    try{
        const salt =  await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const token = generateToken(email);
        const activationLink = `http://localhost:4000/signUp/${token}`;
        const content = `<html>
                         <body>
                         <h4> hi, there </h4>
                         <h5> Welcome to the app </h5>
                         <p> Thank you for sigining up. Click on the below link to activate </p>
                         <a href="${activationLink}">Click here</a>
                         <p>Regards,</p>
                         <p>Team</p>
                         </body>
                         </html>`
        const newUser = new verifyUser({
            name: name,
            email: email,
            password: hashedPassword,
            token: token
        });
    await newUser.save();
    sendMail(email, "verifyUser", content);
    } catch(error) {
        console.log(error);
    } 
}

function generateToken(email){
    const token = jwt.sign(email, process.env.signUp_secret_token);
    return token;
}

async function InsertSignUpUser(token){
    try{
        const userVerify = await verifyUser.findOne({token:token});
        if(userVerify){
            const newUser = new User({
                name: userVerify.name,
                email: userVerify.email,
                password: userVerify.password,
                forgetPassword:{}
            });

            await newUser.save();

            await userVerify.deleteOne({token:token});

            const content = `<html>
                            <body>
                            <h4> hi, there </h4>
                            <h5> Welcome to the app </h5>
                            <p> You are Successfully Registered. </p>
                            <p>Regards,</p>
                            <p>Team</p>
                            </body>
                            </html>`

            sendMail(newUser.email,"Registeration Successful",content);
            return `<html>
                    <body>
                    <h4> hi, there </h4>
                    <h5> Welcome to the app </h5>
                    <p> You are Successfully Registered. </p>
                    <p>Regards,</p>
                    <p>Team</p>
                    </body>
                    </html>`
        }
        return `<html>
                <body>
                <h4> Registeration Failed </h4>
                <p> The Link has been expired..... </p>
                <p>Regards,</p>
                <p>Team</p>
                </body>
                </html>`
        } catch(error){
            console.log(error);
            return `<html>
            <body>
            <h4> Registeration Failed </h4>
            <p> ! ~ ! Unexpected Error Occured ! ~ ! </p>
            <p>Regards,</p>
            <p>Team</p>
            </body>
            </html>`
        }
}

module.exports = { InsertVerifyUser, InsertSignUpUser };