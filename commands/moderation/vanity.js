const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vanity')
        .setDescription('Configure the automatic role for vanity in bio')
        .addSubcommand(sub =>
            sub.setName('set')
                .setDescription('Set the vanity string and the reward role')
                .addStringOption(opt => opt.setName('text').setDescription('The link to look for (e.g., .gg/hellz)').setRequired(true))
                .addRoleOption(opt => opt.setName('role').setDescription('The role to give').setRequired(true))
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        const role = interaction.options.getRole('role');

        // Initialize the global config map if it doesn't exist
        if (!global.vanityConfigs) global.vanityConfigs = new Map();
        
        // Save the settings for this specific Server ID
        global.vanityConfigs.set(interaction.guildId, {
            string: text,
            roleId: role.id
        });

        await interaction.reply({ 
            content: `✅ **Configuration Saved!**\nTarget Text: \`${text}\`\nReward Role: ${role}`, 
            flags: [MessageFlags.Ephemeral] 
        });
    },
};