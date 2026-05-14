const { Client, GatewayIntentBits, Collection, REST, Routes, MessageFlags, ActivityType } = require('discord.js');
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

// --- 1. KEEP-ALIVE SERVER (FOR RENDER) ---
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Hellʐ is online!'));
app.listen(port, () => console.log(`Web server listening on port ${port}`));

// --- 2. CLIENT CONFIGURATION ---
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences // REQUIRED for bio/status detection
    ]
});

// Memory and Collections
client.commands = new Collection();
global.uwuUsers = new Set(); 
global.toxicUsers = new Set(); 
global.vanityConfigs = new Map(); // Stores { string: ".gg/hellz", roleId: "ID" } per guildId

// --- 3. COMMAND LOADER ---
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

// --- 4. ADVANCED UWUIFY LOGIC (GREED STYLE) ---
function uwuify(text) {
    let result = text.toLowerCase();

    // Anti-bypass filter for slurs/toxicity
    const badWords = {
        'nigger': 'nyigga',
        'nigga': 'nyigga',
        'kill yourself': 'kiww youwsewf',
        'kys': 'kiww youwsewf',
        'fuck': 'fwick',
        'stfu': 'shuttie up pwease'
    };

    for (const [bad, good] of Object.entries(badWords)) {
        result = result.replace(new RegExp(bad, 'gi'), good);
    }

    result = result
        .replace(/[lr]/g, 'w')
        .replace(/[LR]/g, 'W')
        .replace(/n([aeiou])/g, 'ny$1')
        .replace(/N([aeiou])/g, 'Ny$1');

    const endings = [' uwu', ' owo', ' :3', ' >w<'];
    return result + endings[Math.floor(Math.random() * endings.length)];
}

// --- 5. EVENT: DYNAMIC VANITY DETECTION ---
client.on('presenceUpdate', async (oldPresence, newPresence) => {
    if (!newPresence || !newPresence.guild || !newPresence.member) return;

    // Get specific config for the server the user is in
    const config = global.vanityConfigs.get(newPresence.guild.id);
    if (!config) return; 

    const member = newPresence.member;
    const activities = newPresence.activities;
    
    // Check if Custom Status contains the configured vanity string
    const hasVanity = activities.some(act => 
        act.type === ActivityType.Custom && act.state && act.state.includes(config.string)
    );

    try {
        const role = member.guild.roles.cache.get(config.roleId);
        if (!role) return;

        if (hasVanity) {
            if (!member.roles.cache.has(config.roleId)) {
                await member.roles.add(role);
                console.log(`[VANITY] Role added to ${member.user.tag} in ${newPresence.guild.name}`);
            }
        } else {
            if (member.roles.cache.has(config.roleId)) {
                await member.roles.remove(role);
                console.log(`[VANITY] Role removed from ${member.user.tag} in ${newPresence.guild.name}`);
            }
        }
    } catch (err) {
        console.error("Vanity Role Error:", err.message);
    }
});

// --- 6. EVENT: MESSAGE HANDLING (UWU/TOXIC LOCK) ---
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    const isUwu = global.uwuUsers.has(message.author.id);
    const isToxic = global.toxicUsers.has(message.author.id);

    if (isUwu || isToxic) {
        try {
            let newContent = isUwu ? uwuify(message.content) : message.content.replace(/\b(hi|hello)\b/gi, 'stfu') + ' #HELLZ';
            
            await message.delete().catch(() => {});

            const webhook = await message.channel.createWebhook({
                name: message.member.displayName,
                avatar: message.author.displayAvatarURL(),
            });

            await webhook.send(newContent);
            await webhook.delete();
        } catch (err) {
            console.error('Webhook Error:', err);
        }
    }
});

// --- 7. EVENT: SLASH COMMANDS ---
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        const reply = { content: 'Execution error!', flags: [MessageFlags.Ephemeral] };
        if (interaction.replied || interaction.deferred) await interaction.followUp(reply).catch(() => {});
        else await interaction.reply(reply).catch(() => {});
    }
});

// --- 8. BOT ONLINE ---
const rest = new REST().setToken(process.env.TOKEN);
(async () => {
    try {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('✅ Slash commands synced.');
    } catch (e) { console.error(e); }
})();

client.once('ready', () => {
    console.log(`🚀 ${client.user.tag} is ready!`);
});

client.login(process.env.TOKEN);