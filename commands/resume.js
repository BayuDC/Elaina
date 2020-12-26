module.exports = {
    name: "resume",
    description: "Melanjutkan pemutaran musik yang dijeda",
    guildOnly: true,
    async execute(message, args) {
        const { channel, guild, member } = message;
        const connection = guild.me.voice.connection;
        if (!connection || !connection.dispatcher) return channel.send("Tidak ada musik yang sedang dimainkan");

        const memberChannel = member.voice.channel;
        const clientChannel = guild.me.voice.channel;
        if (!memberChannel || !memberChannel.equals(clientChannel))
            return channel.send("Kamu harus berada di channel yang sama denganku");

        if (!connection.dispatcher.paused) return channel.send("Pemutaran musik tidak sedang dijeda");

        connection.dispatcher.resume();
        await channel.send("Pemutaran musik berhasil dilanjutkan");
    },
};
