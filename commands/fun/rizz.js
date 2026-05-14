const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rizz')
        .setDescription('Deploy elite rizz on a target')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user you want to rizz up')
                .setRequired(true)),

    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const author = interaction.user;

        const rizzLines = [
            "I’m not a photographer, but I can definitely picture us together.",
            "Are you a magician? Because whenever I look at you, everyone else disappears.",
            "I’d say God bless you, but it looks like He already did.",
            "Do you have a map? I just got lost in your eyes.",
            "Is your name Google? Because you have everything I’m searching for.",
            "If being sexy was a crime, you’d be serving a life sentence.",
            "I’m learning about important dates in history. Do you want to be one of them?",
            "Are you French? Because Eiffel for you.",
            "I hope you know CPR, because you are taking my breath away.",
            "Hand over your phone, I need to call God and tell him one of his angels is missing.",
            "My parents told me to follow my dreams, so I’m following you home.",
            "Is there an airport nearby or is that just my heart taking off?",
            "You look like you're missing something... me.",
            "Do you believe in love at first sight, or should I walk by again?"
        ];

        const randomRizz = rizzLines[Math.floor(Math.random() * rizzLines.length)];

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setTitle('💎 UNLIMITED RIZZ')
            .setDescription(`${author} to ${target}:\n\n*"${randomRizz}"*`)
            .setFooter({ text: 'Hellz Rizzler System' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};