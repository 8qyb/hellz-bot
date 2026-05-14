const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Hellʐ is alive!'));
app.listen(port, () => console.log(`Listening on port ${port}`));

// ... rest of your index.js code starts here

const { Client, GatewayIntentBits, Collection, REST, Routes, MessageFlags } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Global Memory
global.uwuUsers = new Set(); 
global.toxicUsers = new Set(); 

client.commands = new Collection();
const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        }
    }
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    try {
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );
        console.log('✅ Commands registered successfully.');
    } catch (error) {
        console.error(error);
    }
})();

// --- TRANSFORMATION LOGIC ---
function transformText(text, mode) {
    if (mode === 'uwu') {
        return text.replace(/[lr]/g, 'w').replace(/[LR]/g, 'W') + ' uwu';
    }
    if (mode === 'toxic') {
        return text.replace(/\b(hello|hi)\b/gi, 'what do you want').replace(/\b(ok)\b/gi, 'stfu') + ' #HELLZ';
    }
    return text;
}

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    const isUwu = global.uwuUsers.has(message.author.id);
    const isToxic = global.toxicUsers.has(message.author.id);

    if (isUwu || isToxic) {
        try {
            const newText = transformText(message.content, isUwu ? 'uwu' : 'toxic');
            await message.delete().catch(() => {});

            const webhook = await message.channel.createWebhook({
                name: message.member.displayName,
                avatar: message.author.displayAvatarURL(),
            });

            await webhook.send(newText);
            await webhook.delete();
        } catch (err) {
            console.error('Replacement error:', err);
        }
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        const replyOptions = { content: 'Error executing command!', flags: [MessageFlags.Ephemeral] };
        if (interaction.replied || interaction.deferred) await interaction.followUp(replyOptions).catch(() => {});
        else await interaction.reply(replyOptions).catch(() => {});
    }
});

client.once('ready', () => console.log(`✅ ${client.user.tag} is online!`));
client.login(process.env.TOKEN);