const { Client, GatewayIntentBits, Collection, REST, Routes, MessageFlags, ActivityType } = require('discord.js');
const { GiveawaysManager } = require('discord-giveaways');
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

// --- 1. KEEP-ALIVE SERVER (FOR RENDER) ---
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Hellʐ is online.'));
app.listen(port, () => console.log(`Server listening on port ${port}`));

// --- 2. CLIENT CONFIG ---
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions 
    ]
});

// --- 3. GIVEAWAY MANAGER (FIXED FORMAT) ---
const storagePath = path.join(__dirname, 'giveaways.json');

// CRITICAL FIX: Initialize with [] (array) to avoid SyntaxError
if (!fs.existsSync(storagePath) || fs.readFileSync(storagePath, 'utf8').trim() === "") {
    fs.writeFileSync(storagePath, JSON.stringify([]), 'utf-8');
    console.log('📝 Initialized giveaways.json with an array [].');
}

client.giveawaysManager = new GiveawaysManager(client, {
    storage: './giveaways.json',
    default: {
        botsCanWin: false,
        embedColor: '#FF0000',
        reaction: '🎉'
    }
});

// Global Memory
client.commands = new Collection();
global.uwuUsers = new Set(); 
global.toxicUsers = new Set(); 
global.vanityConfigs = new Map();

// --- 4. COMMAND LOADER ---
const commands = [];
const foldersPath = path.join(__dirname, 'commands');
if (fs.existsSync(foldersPath)) {
    const commandFolders = fs.readdirSync(foldersPath);
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(path.join(commandsPath, file));
            if (command.data && command.execute) {
                client.commands.set(command.data.name, command);
                commands.push(command.data.toJSON());
            }
        }
    }
}

// --- 5. LOGIC: UWUIFY ---
function uwuify(text) {
    let result = text.toLowerCase();
    const badWords = {
        'nigger': 'nyigga', 'nigga': 'nyigga',
        'kill yourself': 'kiww youwsewf', 'kys': 'kiww youwsewf',
        'fuck': 'fwick', 'stfu': 'shuttie up pwease'
    };
    for (const [bad, good] of Object.entries(badWords)) {
        result = result.replace(new RegExp(bad, 'gi'), good);
    }
    result = result.replace(/[lr]/g, 'w').replace(/[LR]/g, 'W');
    return result + ' uwu';
}

// --- 6. EVENT: VANITY ROLE ---
client.on('presenceUpdate', async (oldPresence, newPresence) => {
    if (!newPresence?.guild || !newPresence?.member) return;
    const config = global.vanityConfigs.get(newPresence.guild.id);
    if (!config) return;

    const hasVanity = newPresence.activities.some(act => 
        act.type === ActivityType.Custom && act.state && act.state.includes(config.string)
    );

    try {
        const role = newPresence.guild.roles.cache.get(config.roleId);
        if (!role) return;
        const hasRole = newPresence.member.roles.cache.has(config.roleId);
        if (hasVanity && !hasRole) await newPresence.member.roles.add(role);
        else if (!hasVanity && hasRole) await newPresence.member.roles.remove(role);
    } catch (err) { console.error("Vanity Error:", err.message); }
});

// --- 7. EVENT: GIVEAWAY DM ---
client.giveawaysManager.on('giveawayEnded', (giveaway, winners) => {
    winners.forEach((member) => {
        if (giveaway.extraData?.dmEnabled) {
            member.send(`🏆 **Congrats!** You won **${giveaway.prize}**!`).catch(() => {});
        }
    });
});

// --- 8. EVENT: MESSAGE TRANSFORM ---
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;
    const isUwu = global.uwuUsers.has(message.author.id);
    const isToxic = global.toxicUsers.has(message.author.id);

    if (isUwu || isToxic) {
        try {
            let content = isUwu ? uwuify(message.content) : "stfu #HELLZ";
            await message.delete().catch(() => {});
            const webhook = await message.channel.createWebhook({ 
                name: message.member.displayName, 
                avatar: message.author.displayAvatarURL() 
            });
            await webhook.send(content);
            await webhook.delete();
        } catch (err) { console.error('Webhook Error:', err); }
    }
});

// --- 9. EVENT: INTERACTIONS ---
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (command) await command.execute(interaction).catch(console.error);
});

// --- 10. LOGIN ---
const rest = new REST().setToken(process.env.TOKEN);
(async () => {
    try {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('✅ Commands Synced.');
    } catch (e) { console.error(e); }
})();

client.once('ready', () => console.log(`🚀 ${client.user.tag} is online!`));
client.login(process.env.TOKEN);