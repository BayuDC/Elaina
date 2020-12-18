const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "user",
    description: "Show the user's info",
    usage: "[user]",
    aliases: ["member", "mem"],
    guildOnly: true,
    execute(message, args) {
        const sendUserInfo = (user) => {
            message.channel.send(
                new MessageEmbed()
                    .setColor("#4cd137")
                    .setAuthor(
                        user.tag,
                        user.displayAvatarURL({ dynamic: true })
                    )
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .addField("Id", user.id)
                    .addField(
                        "Status",
                        user.presence.status.charAt(0).toUpperCase() +
                            user.presence.status.slice(1)
                    )
                    .addField("Is Human", user.bot ? "No" : "Yes")
                    .addField(
                        "Created Date",
                        `${user.createdAt.getDate()}/${user.createdAt.getMonth()}/${user.createdAt.getFullYear()}`
                    )
                    .addField(
                        "Joined Date",
                        `${message.guild
                            .member(user)
                            .joinedAt.getDate()}/${message.guild
                            .member(user)
                            .joinedAt.getMonth()}/${message.guild
                            .member(user)
                            .joinedAt.getFullYear()}`
                    )
            );
        };

        if (message.mentions.users.size) {
            message.mentions.users.forEach((user) => sendUserInfo(user));
        } else {
            sendUserInfo(message.author);
        }
    },
};
