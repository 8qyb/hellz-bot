module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        // Ignore bots and DM messages
        if (message.author.bot || !message.guild) return;

        // --- Specialty: Uwulock Logic ---
        if (client.uwulocked && client.uwulocked.has(message.author.id)) {
            // Transform L/R into W for that elite troll vibe
            let content = message.content
                .replace(/[lr]/g, 'w')
                .replace(/[LR]/g, 'W');
            
            try {
                await message.delete();
                return message.channel.send(`**${message.author.username}**: ${content} (u w u)`);
            } catch (error) {
                console.error("Permission error: Could not delete message for Uwulock.");
            }
        }

        // --- Command Handler ---
        const prefix = ",";
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Check if command exists in the Collection
        const command = client.commands.get(commandName);
        if (!command) return;

        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            message.reply("❌ **Internal Error:** Could not execute this command.");
        }
    },
};