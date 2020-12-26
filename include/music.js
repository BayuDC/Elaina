const { MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
module.exports = {
    async play(message, song) {
        const { guild, channel, client, author } = message;
        const connection = guild.me.voice.connection;
        const waitingMessage = await channel.send("Tunggu sebentar ya...");

        const stream = ytdl(song.url, { filter: "audioonly" });
        const dispatcher = connection.play(stream);
        dispatcher.on("start", async () => {
            waitingMessage.delete();

            client.playingMessages.set(
                guild.id,
                await channel.send(
                    new MessageEmbed()
                        .setColor("#00a8ff")
                        .setAuthor(`Request dari ${author.username}`, author.displayAvatarURL({ dynamic: true }))
                        .addField("Sedang dimainkan", `[${song.title}](${song.url})`)
                        .setImage(song.thumbnail)
                )
            );
        });
        dispatcher.on("finish", () => {
            client.playingMessages.get(guild.id).delete();
            client.playingMessages.delete(guild.id);

            if (client.queue.has(guild.id)) {
                const songs = client.queue.get(guild.id);
                if (songs.length) this.play(message, songs.shift());
            }
        });
    },
};
