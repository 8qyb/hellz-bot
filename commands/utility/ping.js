const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot and Discord API latency'),

    async execute(interaction) {
        // We send a quick message to measure the round-trip time
        const sent = await interaction.reply({ 
            content: 'Pinging...', 
            fetchReply: true, 
            ephemeral: true 
        });

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setTitle('📡 SYSTEM LATENCY')
            .addFields(
                { 
                    name: 'Bot Latency', 
                    value: `\`${sent.createdTimestamp - interaction.createdTimestamp}ms\``, 
                    inline: true 
                },
                { 
                    name: 'API Latency', 
                    value: `\`${Math.round(interaction.client.ws.ping)}ms\``, 
                    inline: true 
                }
            )
            .setFooter({ text: 'Hellz Network Monitoring' });

        await interaction.editReply({ content: null, embeds: [embed] });
    }
};