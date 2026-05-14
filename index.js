const { Client, GatewayIntentBits, Collection, REST, Routes, MessageFlags, ActivityType } = require('discord.js');
const { GiveawaysManager } = require('discord-giveaways');
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
        GatewayIntentBits.GuildPresences
    ]
});

// --- 3. GIVEAWAY MANAGER ---
client.giveawaysManager = new GiveawaysManager(client, {
    storage: './giveaways.json',
    default: {
        botsCanWin: false,
        embedColor: '#FF0000',
        reaction: '🎉'
    }
});

// Memory and Collections
client.commands = new Collection();
global.uwuUsers = new Set(); 
global.toxicUsers = new Set(); 
global.vanityConfigs = new Map();

// --- 4. COMMAND LOADER ---
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

// --- 5. LOGIC: UWUIFY ---
function uwuify(text) {
    let result = text.toLowerCase();
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

// --- 6. EVENT: DYNAMIC VANITY ROLE ---
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
        if (hasVanity && !newPresence.member.roles.cache.has(config.roleId)) {
            await newPresence.member.roles.add(role);
        } else if (!hasVanity && newPresence.member.roles.cache.has(config.roleId)) {
            await newPresence.member.roles.remove(role);
        }
    } catch (err) { 
        console.error("Vanity Error:", err.message); 
    }
});

// --- 7. EVENT: GIVEAWAY DM WINNER ---
client.giveawaysManager.on('giveawayEnded', (giveaway, winners) => {
    winners.forEach((member) => {
        if (giveaway.extraData && giveaway.extraData.dmEnabled) {
            member.send(`🏆 **Congrats!** You won **${giveaway.prize}** in **${member.guild.name}**!`)
                .catch(() => console.log(`Failed to DM ${member.user.tag}`));
        }
    });
});

// --- 8. EVENT: MESSAGE HANDLING (TRANSFORMATIONS) ---
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;
    const isUwu = global.uwuUsers.has(message.author.id);
    const isToxic = global.toxicUsers.has(message.author.id);

    if (isUwu || isToxic) {
        try {
            let newContent = isUwu 
                ? uwuify(message.content) 
                : message.content.replace(/\b(hi|hello)\b/gi, 'stfu') + ' #HELLZ';
            
            await message.delete().catch(() => {});
            
            const webhook = await message.channel.createWebhook({ 
                name: message.member.displayName, 
                avatar: message.author.displayAvatarURL() 
            });
            
            await webhook.send(newContent);
            await webhook.delete();
        } catch (err) { 
            console.error('Webhook Error:', err); 
        }
    }
});

// --- 9. EVENT: SLASH COMMANDS ---
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try { 
        await command.execute(interaction); 
    } catch (e) { 
        console.error(e); 
    }
});

// --- 10. LOGIN & SYNC ---
const rest = new REST().setToken(process.env.TOKEN);
(async () => {
    try {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('✅ Commands synced.');
    } catch (e) { 
        console.error(e); 
    }
})();

client.once('ready', () => {
    console.log(`🚀 ${client.user.tag} is ready!`);
});

client.login(process.env.TOKEN);