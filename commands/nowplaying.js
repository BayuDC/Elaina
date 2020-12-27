module.exports = {
    name: "nowplaying",
    description: "Menamplikan musik yang sedang dimainkan",
    aliases: ["np"],
    guildOnly: true,
    async execute(message, args) {
        const {
            client: { playingMessages },
            guild: { id },
            channel,
        } = message;

        if (!playingMessages.has(id)) return channel.send("Tidak ada musik yang sedang dimainkan");

        channel.send(playingMessages.get(id).embeds[0]);
    },
};
