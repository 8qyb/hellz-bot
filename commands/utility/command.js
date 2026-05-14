const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commands')
        .setDescription('Show a list of all available commands'),

    async execute(interaction) {
        const client = interaction.client;
        
        // Mapping commands to show their names in a clean list
        const cmdList = client.commands.map(cmd => `\`${cmd.data.name}\``).join(', ');

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setTitle('📂 HELLZ COMMAND LIST')
            .setDescription(`Total Commands: **${client.commands.size}**\n\n${cmdList}`)
            .setFooter({ text: 'Use / to see the options for each command' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};