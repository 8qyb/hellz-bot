const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Timeout a member (silence them)')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to mute')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('duration')
                .setDescription('Duration in minutes (default is 10)')
                .setMinValue(1)
                .setMaxValue(43200) // Max timeout is 30 days
                .setRequired(false))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for the mute')
                .setRequired(false)),

    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const duration = interaction.options.getInteger('duration') || 10;
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!target) {
            return interaction.reply({ content: "❌ **Target not found.**", ephemeral: true });
        }

        // Hierarchy Check
        if (target.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ 
                content: "❌ **Error:** Cannot mute higher aura.", 
                ephemeral: true 
            });
        }

        try {
            // Convert minutes to milliseconds
            await target.timeout(duration * 60 * 1000, reason);

            const embed = new EmbedBuilder()
                .setColor(0x000000)
                .setAuthor({ name: 'Case: Timeout', iconURL: target.user.displayAvatarURL() })
                .setDescription(`**${target.user.tag}** has been silenced for ${duration} minutes.`)
                .addFields({ name: 'Reason', value: `\`${reason}\`` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: "❌ **Error:** I cannot mute this user. Check my permissions.", 
                ephemeral: true 
            });
        }
    }
};