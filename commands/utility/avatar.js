const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Displays the avatar of a member')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to view (leave blank for yourself)')
                .setRequired(false)),

    async execute(interaction) {
        // Si aucune cible n'est choisie, on prend l'utilisateur qui tape la commande
        const target = interaction.options.getUser('target') || interaction.user;

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setTitle(`${target.username}'s Avatar`)
            .setImage(target.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setFooter({ text: 'Hellz Utility' });

        await interaction.reply({ embeds: [embed] });
    }
};