const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "server",
    description: "Show the server's info",
    guildOnly: true,
    aliases: ["guild"],
    async execute(message, args) {
        const guild = message.guild;
        await message.channel.send(
            new MessageEmbed()
                .setColor("#00a8ff")
                .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
                .setThumbnail(guild.iconURL({ dynamic: true }))
                .addField("Id", guild.id)
                .addField("Owner", guild.owner.user.tag)
                .addField("Total members", guild.memberCount)
                .addField("Roles", guild.roles.cache.size, true)
                .addField("Channels", guild.channels.cache.size, true)
                .addField(
                    "Region",
                    guild.region.charAt(0).toUpperCase() + guild.region.slice(1)
                )
                .addField(
                    "Created Date",
                    `${guild.createdAt.getDate()}/${guild.createdAt.getMonth()}/${guild.createdAt.getFullYear()}`
                )
        );
    },
};
