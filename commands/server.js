const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "server",
    description: "Menampilkan informasi dari server",
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
                .addField("Pemilik", guild.owner.user.tag)
                .addField("Jumlah Member", guild.memberCount)
                .addField("Jumlah Role", guild.roles.cache.size, true)
                .addField("Jumalh Channel", guild.channels.cache.size, true)
                .addField(
                    "Region",
                    guild.region.charAt(0).toUpperCase() + guild.region.slice(1)
                )
                .addField(
                    "Tanggal Dibuat",
                    `${guild.createdAt.getDate()}/${guild.createdAt.getMonth()}/${guild.createdAt.getFullYear()}`
                )
        );
    },
};
