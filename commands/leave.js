module.exports = {
    name: "leave",
    description: "Mengeluarkan Elaina dari voice channel",
    guildOnly: true,
    async execute(message, args) {
        const { channel, guild } = message;
        const voice = guild.me.voice;
        if (!voice.channel) return channel.send("Aku sudah tidak berada di voice channel");
        if (voice.channel.members.filter((member) => !member.user.bot && !member.user.equals(message.author)).size)
            return channel.send("Tidak bisa keluar sekarang! Aku masih dibutuhkan disini");

        const disconnect = async () => {
            try {
                if (voice.connection.status != 0) throw "wait";

                voice.connection.disconnect();
                await channel.send("Berhasil keluar dari voice channel");
            } catch (error) {
                if (error == "wait") return setTimeout(() => disconnect(), 500);

                await channel.send("Tidak bisa keluar dari voice channel! Silahkan coba lagi!");
            }
        };
        await disconnect();
    },
};
