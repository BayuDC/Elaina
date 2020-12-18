const fs = require("fs");
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));
commandFiles.forEach((file) => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
});

const cooldowns = new Discord.Collection();

client.once("ready", () => {
    console.log("Bot is ready");
});
client.on("message", async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command =
        client.commands.get(commandName) ||
        client.commands.find(
            (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
        );
    if (!command) return;

    const errorEmbed = new Discord.MessageEmbed().setColor("#e74c3c");
    // ! required args commands
    if (command.args && !args.length)
        return message.channel.send(
            errorEmbed.setDescription(
                `Invalid command usage!\nUse \`${prefix}help\` to get some help`
            )
        );
    // ! server only commands
    if (command.guildOnly && message.channel.type == "dm")
        return message.channel.send(
            errorEmbed.setDescription(
                "I can't execute that command inside DMs!"
            )
        );
    // ! command cooldown
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;
    if (timestamps.has(message.author.id)) {
        const expirationTime =
            timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.channel.send(
                errorEmbed.setDescription(
                    `Please wait ${timeLeft.toFixed(
                        1
                    )} second(s) before reusing the \`${command.name}\` command`
                )
            );
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    // ? command execute
    try {
        await command.execute(message, args);
    } catch (error) {
        console.log(error);
    }
});

client.login(token);
