module.exports = {
    name: "stop",
    description: "Menghentikan musik yang dimainkan",
    guildOnly: true,
    async execute(message, args) {
        const { channel, client, guild, member } = message;
        const connection = guild.me.voice.connection;
        if (!connection || !connection.dispatcher) return channel.send("Tidak ada musik yang sedang dimainkan");

        const memberChannel = member.voice.channel;
        const clientChannel = guild.me.voice.channel;
        if (!memberChannel || !memberChannel.equals(clientChannel))
            return channel.send("Kamu harus berada di channel yang sama denganku");

        connection.dispatcher.destroy();
        await channel.send("Pemutaran musik berhasil dihentikan");

        if (client.playingMessages.has(guild.id)) {
            client.playingMessages.get(guild.id).delete();
            client.playingMessages.delete(guild.id);
        }
        if (client.queue.has(guild.id)) {
            client.queue.set(guild.id, []);
        }
    },
};
