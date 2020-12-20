const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "leave",
    description: "Keluar dari voice channel",
    guildOnly: true,
    async execute(message, args) {
        const { channel, connection } = message.guild.me.voice;
        if (!channel)
            return await message.channel.send(
                new MessageEmbed().setColor("#00a8ff").setDescription("Aku sudah tidak berada di voice channel")
            );
        if (channel.members.filter((member) => !member.user.bot && !member.user.equals(message.author)).size)
            return await message.channel.send(
                new MessageEmbed()
                    .setColor("#e74c3c")
                    .setDescription("Tidak bisa keluar sekarang!\nAku masih dibutuhkan disini")
            );

        const disconnect = async () => {
            try {
                if (connection.status != 0) throw "wait";

                connection.disconnect();
                await message.channel.send(
                    new MessageEmbed().setColor("#4cd137").setDescription("Berhasil keluar dari voice channel")
                );
            } catch (error) {
                if (error == "wait") return setTimeout(() => disconnect(), 500);

                await message.channel.send(
                    new MessageEmbed()
                        .setColor("#e74c3c")
                        .setDescription("Gagal keluar dari voice channel!\nSilahkan coba lagi!")
                );
            }
        };
        await disconnect();
    },
};
