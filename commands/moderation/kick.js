const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Remove a member from the server')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for the kick')
                .setRequired(false)),

    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!target) {
            return interaction.reply({ content: "❌ **Target not found.**", ephemeral: true });
        }

        // Hierarchy Check
        if (target.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ 
                content: "❌ **Error:** Target has a higher or equal aura.", 
                ephemeral: true 
            });
        }

        try {
            await target.kick(`${interaction.user.tag}: ${reason}`);

            const embed = new EmbedBuilder()
                .setColor(0xffa500)
                .setAuthor({ name: 'Case: Kick', iconURL: target.user.displayAvatarURL() })
                .addFields(
                    { name: '👤 Target', value: `\`${target.user.tag}\` (${target.id})`, inline: false },
                    { name: '🛡️ Moderator', value: `${interaction.user}`, inline: true },
                    { name: '📄 Reason', value: `\`${reason}\``, inline: true }
                )
                .setFooter({ text: 'Hellz Security' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: "❌ **Error:** I cannot kick this user. Check my permissions.", 
                ephemeral: true 
            });
        }
    }
};