const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autorole') // Nom unique pour éviter l'erreur DUPLICATE_NAME
        .setDescription('Set a role to be automatically given to new members')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to assign automatically')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        
        // Ici, tu peux ajouter la logique pour sauvegarder l'ID du rôle
        await interaction.reply({ 
            content: `✅ Autorole has been set to: **${role.name}**`, 
            ephemeral: true 
        });
    },
};