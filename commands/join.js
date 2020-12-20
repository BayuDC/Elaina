const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "join",
    description: "Bergabung ke voice channel",
    guildOnly: true,
    async execute(message, args) {
        const voiceChannel = message.member.voice.channel;
        const clientVoiceChannel = message.guild.me.voice.channel;

        if (!voiceChannel)
            return await message.channel.send(
                new MessageEmbed()
                    .setColor("#e74c3c")
                    .setDescription("Kamu harus bergabung ke voice channel terlebih dahulu!")
            );
        if (clientVoiceChannel && clientVoiceChannel.members.filter((member) => !member.user.bot).size)
            return await message.channel.send(
                new MessageEmbed().setColor("#00a8ff").setDescription(`Aku sudah berada di voice channel`)
            );

        await voiceChannel.join();
        await message.channel.send(
            new MessageEmbed().setColor("#4cd137").setDescription("Berhasil bergabung ke voice channel")
        );
    },
};
