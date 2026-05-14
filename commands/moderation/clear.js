const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Mass delete messages from a channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Number of messages to delete (1-100)')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)),

    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        try {
            await interaction.channel.bulkDelete(amount, true);

            const embed = new EmbedBuilder()
                .setColor(0x2b2d31)
                .setDescription(`✅ Successfully purged **${amount}** messages.`)
                .setFooter({ text: 'Cleanup Complete' });

            // On répond à l'interaction
            await interaction.reply({ embeds: [embed] });

            // On supprime la confirmation après 3 secondes
            setTimeout(() => interaction.deleteReply().catch(() => null), 3000);
            
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: "❌ **Error:** I cannot delete messages older than 14 days.", 
                ephemeral: true 
            });
        }
    }
};