const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Set channel slowmode')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addIntegerOption(option => 
            option.setName('seconds')
                .setDescription('The slowmode time in seconds (0 to disable)')
                .setMinValue(0)
                .setMaxValue(21600) // Limite de 6 heures par Discord
                .setRequired(true)),

    async execute(interaction) {
        const time = interaction.options.getInteger('seconds');

        try {
            await interaction.channel.setRateLimitPerUser(time);

            const embed = new EmbedBuilder()
                .setColor(0x2b2d31)
                .setTitle('⏳ SLOWMODE UPDATED')
                .setDescription(time === 0 
                    ? 'Slowmode has been **disabled**.' 
                    : `Slowmode has been set to **${time}** seconds.`)
                .setFooter({ text: 'Anti-Spam Active' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: "❌ **Error:** I cannot set slowmode in this channel.", 
                ephemeral: true 
            });
        }
    }
};