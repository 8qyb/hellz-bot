const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uwulock-remove')
        .setDescription('Release a user from UwU mode')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to release')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const user = interaction.options.getUser('target');

        // On vérifie si l'utilisateur est bien dans la liste
        if (global.uwuUsers.has(user.id)) {
            global.uwuUsers.delete(user.id);
            
            await interaction.reply({ 
                content: `✅ **${user.username}** has been released from the UwU curse.`, 
                flags: [MessageFlags.Ephemeral] 
            });
        } else {
            await interaction.reply({ 
                content: `ℹ️ **${user.username}** is not currently locked.`, 
                flags: [MessageFlags.Ephemeral] 
            });
        }
    },
};