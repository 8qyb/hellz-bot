const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bang')
        .setDescription('Shoot a member (virtually!)')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user you want to shoot')
                .setRequired(true)),

    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const author = interaction.user;

        try {
            const res = await fetch('https://api.otakugifs.xyz/gif?reaction=shot');
            const json = await res.json();

            const embed = new EmbedBuilder()
                .setColor(0x2b2d31)
                .setDescription(`**${author.username}** shot **${target.username}**! 💥`)
                .setImage(json.url)
                .setFooter({ text: 'Hellz Fun System' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: "❌ Failed to fetch the GIF. Try again later!", 
                ephemeral: true 
            });
        }
    }
};