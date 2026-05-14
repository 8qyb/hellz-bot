const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addrole')
        .setDescription('Assign a role to a member')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to give the role to')
                .setRequired(true))
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('The role to assign')
                .setRequired(true)),

    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const role = interaction.options.getRole('role');

        // Hierarchy Check
        if (role.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ 
                content: "❌ **Error:** You cannot assign a role equal or higher than your own.", 
                ephemeral: true 
            });
        }

        try {
            await target.roles.add(role);

            const embed = new EmbedBuilder()
                .setColor(0x2b2d31)
                .setAuthor({ name: 'Role Management', iconURL: target.user.displayAvatarURL() })
                .setDescription(`✅ Added ${role} to **${target.user.tag}**`)
                .setFooter({ text: 'Hellz Security' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: "❌ **Error:** I cannot add this role. Check my permissions or role hierarchy.", 
                ephemeral: true 
            });
        }
    }
};