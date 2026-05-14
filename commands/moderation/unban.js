const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Revoke a user ban using their ID')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(option => 
            option.setName('target_id')
                .setDescription('The Discord ID of the user to unban')
                .setRequired(true)),

    async execute(interaction) {
        const targetId = interaction.options.getString('target_id');

        try {
            await interaction.guild.members.unban(targetId);
            
            const embed = new EmbedBuilder()
                .setColor(0x2b2d31)
                .setDescription(`✅ Successfully unbanned ID: \`${targetId}\``)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ 
                content: "❌ **Error:** User not found in ban list or invalid ID.", 
                ephemeral: true 
            });
        }
    }
};