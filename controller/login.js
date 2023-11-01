const User = require("../models/User");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const client = require("../redis");
var jwt = require("jsonwebtoken");
dotenv.config();

async function CheckUser(email){
    try{
        const user = await User.findOne({email:email});
        if(user){
            return true;
        }
        else return false;
    } catch(error){
        return "Server Bussy ..!";
    }
}

async function AuthenticateUser(email, password){
    try{
        const usercheck = await User.findOne({email: email});
        const validPassword = await bcrypt.compare(password, usercheck.password)
        if(validPassword){
            const token = jwt.sign({email}, process.env.login_secret_token);
            const response = {
                id: usercheck._id,
                name: usercheck.name,
                email: usercheck.email,
                token: token,
                status: true
            };
            await client.set(`key-${email}`,JSON.stringify(response));
            await User.findOneAndUpdate({email:usercheck.email}, {$set: {token: token}}, {new: true});
            return response;
        }     
        return "Invalid Username Or Password";
    } catch(error){
        console.log(error);
        return "Server Busy";
    }
}

async function AuthorizeUser(token){
    try{
        const decodedToken = jwt.verify(token, process.env.login_secret_token);
        if(decodedToken){
            const email = decodedToken.email;
            const auth = await client.get(`key-${email}`);
            if(auth){
                const data = JSON.parse(auth);
                return data;
            } else {
                const data = await User.findOne({email: email});
                return data;
            }
        }
        return false;
    } catch(error){
        console.log(error);
    }

}

module.exports = { CheckUser, AuthenticateUser, AuthorizeUser };