const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "avatar",
    description: "Menampilkan avatar dari user",
    aliases: ["icon", "pp"],
    usage: "[user]",
    async execute(message, args) {
        const sendUserAvatar = async (user) =>
            await message.channel.send(
                new MessageEmbed()
                    .setColor("#4cd137")
                    .setAuthor(
                        `Avatar dari ${user.username}`,
                        user.displayAvatarURL({ dynamic: true })
                    )
                    .setImage(
                        user.displayAvatarURL({
                            dynamic: true,
                            size: 1024,
                        })
                    )
            );
        if (message.mentions.users.size)
            return message.mentions.users.forEach(sendUserAvatar);

        await sendUserAvatar(message.author);
    },
};
