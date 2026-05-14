const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removerole')
        .setDescription('Remove a role from a member')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to remove the role from')
                .setRequired(true))
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('The role to remove')
                .setRequired(true)),

    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const role = interaction.options.getRole('role');

        if (!target) {
            return interaction.reply({ content: "❌ **Target not found.**", ephemeral: true });
        }

        // Hierarchy Check
        if (role.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ 
                content: "❌ **Error:** Role position is too high for your current aura.", 
                ephemeral: true 
            });
        }

        try {
            await target.roles.remove(role);

            const embed = new EmbedBuilder()
                .setColor(0x2b2d31)
                .setDescription(`✅ Removed ${role} from **${target.user.tag}**`)
                .setFooter({ text: 'Hellz Role Management' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: "❌ **Error:** I cannot remove this role. Check my permissions or role hierarchy.", 
                ephemeral: true 
            });
        }
    }
};