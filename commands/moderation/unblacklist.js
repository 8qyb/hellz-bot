const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unblacklist') // Bien vérifier que c'est différent de blacklist
        .setDescription('Remove a user from the blacklist')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to remove from blacklist')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const user = interaction.options.getUser('target');
        
        // Logique pour retirer de ta DB ici
        await interaction.reply({ content: `✅ **${user.tag}** has been removed from the blacklist.`, ephemeral: true });
    },
};