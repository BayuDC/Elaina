module.exports = {
    name: "join",
    description: "Mamanggil Elaina ke voice channel",
    aliases: ["j", "connect"],
    guildOnly: true,
    async execute(message, args) {
        const { client, channel, guild, member } = message;
        const memberChannel = member.voice.channel;
        const clientChannel = guild.me.voice.channel;

        if (!memberChannel) return channel.send("Kamu harus berada di voice channel terlebih dahulu!");
        if (clientChannel && clientChannel.members.filter((member) => !member.user.bot).size)
            return channel.send("Aku sudah berada di voice channel!");

        const waitingMessage = await channel.send("Tunggu sebentar ya...");
        const temp = guild.me.voice.connection;
        const connection = await memberChannel.join();
        if (!temp) {
            connection.on("disconnect", () => {
                if (client.playingMessages.has(guild.id)) {
                    client.playingMessages.get(guild.id).delete();
                    client.playingMessages.delete(guild.id);
                }
                if (client.queue.has(guild.id)) {
                    client.queue.delete(guild.id);
                }
            });
            guild.me.voice.setSelfDeaf(true);
        }
        waitingMessage.delete();
        await channel.send("Berhasil bergabung ke voice channel");

        if (!client.queue.has(guild.id)) {
            client.queue.set(guild.id, []);
        }

        return "success";
    },
};
