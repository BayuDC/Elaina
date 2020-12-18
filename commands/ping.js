const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "ping",
    description: "Test connection",
    aliases: ["tes", "p"],
    execute(message, args) {
        message.channel.send(
            new MessageEmbed()
                .setTitle("Pong!")
                .setColor("#00a8ff")
                .addField(
                    "Gateway",
                    `\`${Date.now() - message.createdTimestamp} ms\``
                )
                .addField(
                    "Rest",
                    `\`${Math.round(message.client.ws.ping)} ms\``
                )
        );
    },
};
