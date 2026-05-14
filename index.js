const { Client, GatewayIntentBits, Collection, REST, Routes, MessageFlags } = require('discord.js');
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

// --- SERVEUR POUR RENDER (FIX PORT) ---
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Hellʐ is alive!'));
app.listen(port, () => console.log(`Serveur prêt sur le port ${port}`));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Mémoire globale pour les locks
global.uwuUsers = new Set(); 
global.toxicUsers = new Set(); 

// --- CHARGEMENT DES COMMANDES ---
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

// --- LOGIQUE UWUIFY AVANCÉE (TYPE GREED) ---
function uwuify(text) {
    let result = text.toLowerCase();

    // Filtre anti-bypass pour les insultes
    const badWords = {
        'nigger': 'nyigga',
        'nigga': 'nyigga',
        'kill yourself': 'kiww youwsewf',
        'kys': 'kiww youwsewf',
        'fuck': 'fwick',
        'stfu': 'shut up pwease'
    };

    for (const [bad, good] of Object.entries(badWords)) {
        result = result.replace(new RegExp(bad, 'gi'), good);
    }

    result = result
        .replace(/[lr]/g, 'w')
        .replace(/[LR]/g, 'W')
        .replace(/n([aeiou])/g, 'ny$1')
        .replace(/N([aeiou])/g, 'Ny$1')
        .replace(/ove/g, 'uv');

    const endings = [' uwu', ' owo', ' :3', ' >w<'];
    return result + endings[Math.floor(Math.random() * endings.length)];
}

// --- GESTION DES MESSAGES (TRANSFORMATION) ---
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    const isUwu = global.uwuUsers.has(message.author.id);
    const isToxic = global.toxicUsers.has(message.author.id);

    if (isUwu || isToxic) {
        try {
            let newText = message.content;
            if (isUwu) newText = uwuify(message.content);
            else if (isToxic) newText = message.content.replace(/\b(hi|hello)\b/gi, 'stfu') + ' #HELLZ';

            await message.delete().catch(() => {});

            const webhook = await message.channel.createWebhook({
                name: message.member.displayName,
                avatar: message.author.displayAvatarURL(),
            });

            await webhook.send(newText);
            await webhook.delete();
        } catch (err) {
            console.error('Erreur transformation:', err);
        }
    }
});

// --- GESTION DES SLASH COMMANDS ---
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        const replyOptions = { content: 'Erreur d\'exécution !', flags: [MessageFlags.Ephemeral] };
        if (interaction.replied || interaction.deferred) await interaction.followUp(replyOptions).catch(() => {});
        else await interaction.reply(replyOptions).catch(() => {});
    }
});

const rest = new REST().setToken(process.env.TOKEN);
(async () => {
    try {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('✅ Commandes slash enregistrées.');
    } catch (e) { console.error(e); }
})();

client.login(process.env.TOKEN);