const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Add a user to the blacklist')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to blacklist')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the blacklist'))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const user = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        
        // Logique pour ajouter à ta DB ici
        await interaction.reply({ content: `🚫 **${user.tag}** has been added to the blacklist. Reason: ${reason}`, ephemeral: true });
    },
};