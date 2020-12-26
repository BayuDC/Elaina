const { MessageEmbed } = require("discord.js");
const { youtubeKey } = require("../config.json");
const { validateURL, getURLVideoID } = require("ytdl-core");
const fetch = require("node-fetch");
const join = require("../commands/join");
const music = require("../include/music");
const { includes } = require("ffmpeg-static");
module.exports = {
    name: "play",
    description: "Memainkan musik dari Youtube",
    guildOnly: true,
    args: true,
    usage: "<url>",
    async execute(message, args) {
        const { guild, channel, client, member } = message;
        const memberChannel = member.voice.channel;
        const clientChannel = guild.me.voice.channel;
        if (!memberChannel || !clientChannel || !clientChannel.members.filter((member) => !member.user.bot).size) {
            const status = await join.execute(message, args);
            if (status !== "success") return;
        } else if (!memberChannel.equals(clientChannel))
            return channel.send("Kamu harus berada di channel yang sama denganku");

        const getSong = (item) => {
            const { snippet, id } = item;
            return {
                url: "https://youtu.be/" + (typeof id === "string" ? id : id.videoId),
                title: snippet.title,
                thumbnail: (
                    snippet.thumbnails.maxres ||
                    snippet.thumbnails.standard ||
                    snippet.thumbnails.high ||
                    snippet.thumbnails.medium ||
                    snippet.thumbnails.default
                ).url,
            };
        };
        const pushAndPlay = async (song) => {
            const songs = client.queue.get(guild.id);
            songs.push(song);

            await channel.send(
                new MessageEmbed()
                    .setColor("#4cd137")
                    .setAuthor(`Request dari ${member.user.username}`, member.user.displayAvatarURL({ dynamic: true }))
                    .addField("Berhasil ditambahkan ke antrian", `[${song.title}](${song.url})`)
            );

            if (guild.me.voice.connection.dispatcher) return;
            music.play(message, songs.shift());
        };

        const waitingMessage = await channel.send("Tunggu sebentar ya...");
        const url = args.find((arg) => arg.startsWith("https://") || arg.startsWith("http://"));
        if (url) {
            let song = null;
            if (validateURL(url)) {
                const id = getURLVideoID(url);
                const { items } = await fetch(
                    `https://www.googleapis.com/youtube/v3/videos?key=${youtubeKey}&id=${id}&part=snippet`
                ).then((result) => result.json());
                if (items.length) {
                    const [item] = items;
                    song = getSong(item);
                }
            }
            waitingMessage.delete();

            return song ? pushAndPlay(song) : channel.send("Musik tidak ditemukan");
        }

        const query = args.join("%20");
        const { items } = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${youtubeKey}&q=${query}&part=snippet&type=video`
        ).then((result) => result.json());
        const songList = items.reduce(
            (result, item, index) =>
                result + `${index + 1}) [${item.snippet.title}](https://youtu.be/${item.id.videoId})\n`,
            ""
        );
        waitingMessage.delete();
        const selectingMessage = await channel.send(
            new MessageEmbed()
                .setColor("#00a8ff")
                .setAuthor("Hasil Pencarian", member.user.displayAvatarURL({ dynamic: true }))
                .setDescription("Silahkan pilih musik yang akan dimainkan dengan cara memberi reaction")
                .addField(`Hasil pencarian dari *${args.join(" ")}*`, songList)
        );
        const reactions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "❎"];

        const collector = selectingMessage.createReactionCollector(
            (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === member.user.id,
            { time: 30000 }
        );
        collector.on("collect", (reaction) => {
            selectingMessage.delete();
            const index = reactions.indexOf(reaction.emoji.name);
            if (index == 5) return;
            pushAndPlay(getSong(items[index]));
        });
        collector.on("end", () => {
            if (selectingMessage.deletable && !selectingMessage.deleted) selectingMessage.delete();
        });

        for (reaction of reactions) {
            try {
                await selectingMessage.react(reaction);
            } catch (error) {
                break;
            }
        }
    },
};
