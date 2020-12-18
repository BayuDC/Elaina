const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "avatar",
    description: "Show the user's avatar",
    aliases: ["icon", "pp"],
    usage: "<user>",
    args: true,
    execute(message, args) {
        if (message.mentions.users.size) {
            message.mentions.users.forEach((user) => {
                message.channel.send(
                    new MessageEmbed()
                        .setColor("#4cd137")
                        .setAuthor(
                            `${user.username}'s avatar`,
                            user.displayAvatarURL({ dynamic: true })
                        )
                        .setImage(
                            user.displayAvatarURL({
                                dynamic: true,
                                size: 1024,
                            })
                        )
                );
            });
        } else {
            message.channel.send(
                new MessageEmbed()
                    .setColor("#e74c3c")
                    .setDescription("You don't mention any user!")
            );
        }
    },
};
