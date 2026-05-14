const { Client, GatewayIntentBits, Collection, REST, Routes, ActivityType } = require('discord.js');
const { GiveawaysManager } = require('discord-giveaways');
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

// --- 1. KEEP-ALIVE SERVER (Pour Render) ---
const app = express();
app.get('/', (req, res) => res.send('Hellʐ is online.'));
app.listen(process.env.PORT || 3000);

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

// --- 2. STORAGE GIVEAWAY FIX ---
const storagePath = path.join(__dirname, 'giveaways.json');
if (!fs.existsSync(storagePath) || fs.readFileSync(storagePath, 'utf8').trim() === "") {
    fs.writeFileSync(storagePath, '[]', 'utf-8');
}

client.giveawaysManager = new GiveawaysManager(client, {
    storage: './giveaways.json',
    default: {
        botsCanWin: false,
        embedColor: '#FF0000',
        reaction: '🎉'
    }
});

// --- 3. TES VARIABLES (UwU, Toxic, Vanity) ---
client.commands = new Collection();
global.uwuUsers = new Set(); 
global.toxicUsers = new Set(); 
global.vanityConfigs = new Map();

// --- 4. CHARGEMENT DES COMMANDES ---
const commands = [];
const foldersPath = path.join(__dirname, 'commands');
if (fs.existsSync(foldersPath)) {
    for (const folder of fs.readdirSync(foldersPath)) {
        const commandsPath = path.join(foldersPath, folder);
        if (fs.lstatSync(commandsPath).isDirectory()) {
            for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
                const command = require(path.join(commandsPath, file));
                if (command.data && command.execute) {
                    client.commands.set(command.data.name, command);
                    commands.push(command.data.toJSON());
                }
            }
        }
    }
}

// --- 5. LOGIQUE UWU & TOXIC ---
function uwuify(text) {
    return text.toLowerCase().replace(/[lr]/g, 'w').replace(/[LR]/g, 'W') + ' uwu';
}

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    // UwULock ou ToxicLock
    if (global.uwuUsers.has(message.author.id) || global.toxicUsers.has(message.author.id)) {
        try {
            let content = global.uwuUsers.has(message.author.id) ? uwuify(message.content) : "stfu #HELLZ";
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

// --- 6. LOGIQUE VANITY ROLE ---
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

// --- 7. GESTION DES INTERACTIONS ---
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (command) {
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
        }
    }
});

// --- 8. SYNC & LOGIN ---
const rest = new REST().setToken(process.env.TOKEN);
(async () => {
    try {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('✅ Commands Synced.');
    } catch (e) { console.error(e); }
})();

client.once('ready', () => console.log(`🚀 ${client.user.tag} est prêt !`));
client.login(process.env.TOKEN);