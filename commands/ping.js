const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "ping",
    description: "Mengetes koneksi internet",
    aliases: ["test"],
    async execute(message, args) {
        await message.channel.send(
            new MessageEmbed()
                .setAuthor("Pong!", message.client.user.displayAvatarURL({ dynamic: true }))
                .setColor("#00a8ff")
                .addField("Gateway", `\`${Date.now() - message.createdTimestamp} ms\``)
                .addField("Rest", `\`${Math.round(message.client.ws.ping)} ms\``)
        );
    },
};
