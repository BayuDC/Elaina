const { play } = require("../include/music");
module.exports = {
    name: "skip",
    description: "Melewati musik yang sedang diputar",
    guildOnly: true,
    async execute(message, args) {
        const { channel, client, guild, member } = message;
        const connection = guild.me.voice.connection;
        if (!connection || !connection.dispatcher) return channel.send("Tidak ada musik yang sedang dimainkan");

        const memberChannel = member.voice.channel;
        const clientChannel = guild.me.voice.channel;
        if (!memberChannel || !memberChannel.equals(clientChannel))
            return channel.send("Kamu harus berada di channel yang sama denganku");

        client.playingMessages.get(guild.id).delete();
        client.playingMessages.delete(guild.id);

        if (client.queue.has(guild.id)) {
            const songs = client.queue.get(guild.id);
            if (songs.length) {
                play(message, songs.shift());
            } else {
                connection.dispatcher.destroy();
            }
        }
    },
};
