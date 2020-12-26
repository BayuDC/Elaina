const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "queue",
    description: "Menampilkan daftar antrian musik",
    guildOnly: true,
    async execute(message, args) {
        const {
            client: { queue, playingMessages, user },
            channel,
            guild: { id },
        } = message;

        const nowPlaying = { name: "Sedang dimainkan", value: "Tidak ada" };
        const nextPlaying = { name: "Dimainkan berikutnya", value: "Tidak ada" };
        if (playingMessages.has(id)) {
            const playingMessage = playingMessages.get(id);
            const embed = playingMessage.embeds[0];
            const field = embed.fields[0];
            nowPlaying.value = field.value;
        }
        if (queue.has(id)) {
            const songs = queue.get(id);
            if (songs.length)
                nextPlaying.value = songs.reduce(
                    (result, song, index) => result + `${index + 1}) [${song.title}](${song.url})\n`,
                    ""
                );
        }

        await channel.send(
            new MessageEmbed()
                .setAuthor(`Daftar Musik`, user.displayAvatarURL({ dynamic: true }))
                .setColor("#00a8ff")
                .addFields(nowPlaying, nextPlaying)
        );
    },
};
