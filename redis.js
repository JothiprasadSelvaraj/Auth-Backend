const redis = require("redis");
const dotenv = require("dotenv");
dotenv.config();


const redisClient = () => {
    return redis.createClient();
}

const client = redisClient();

client.on("error", (error) => {
    console.log(error);
});

client.on("connect", () => {
    console.log("Connected to redis");
});

client.on("end", () =>{
    console.log("redis connection ended")
});

client.on("SIGQUIT", () => {
    client.quit();
});

module.exports = client;