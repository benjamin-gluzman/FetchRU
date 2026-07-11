import { EmbedBuilder } from "discord.js";

const COLORS = {
    BLUE: 0x0099FF,
    LIGHT_BLUE: 0x00bcff,
    GREEN: 0x00ff38
};

function getWatchEmbed(user, courseIndex, watchesUsed) {
    const embed = new EmbedBuilder()
    .setTitle("Successfully added Watch Request!")
    .setDescription(`Successfully added course ${styleText(courseIndex)} to your watch requests.\n
                    Currently using ${styleText(`${watchesUsed}/20`)} watches`);

    addExtraStyle(embed, user, COLORS.GREEN);
    return embed;
}

function getUnwatchEmbed(user, courseIndex) {
    const embed = new EmbedBuilder()
    .setTitle("Successfully Removed Course!")
    .setDescription(`Successfully removed course ${styleText(courseIndex)} from your watch requests.`);

    addExtraStyle(embed, user, COLORS.GREEN);
    return embed;
}

function getCheckEmbed(user, courses) {
    const body = courses.map(course => 
        `${styleText(course.courseIndex)} - Section ${course.section} | ${course.title}`)
        .join("\n");

    const embed = new EmbedBuilder()
    .setTitle("Currently Watching")
    .setDescription(body);

    addExtraStyle(embed, user, COLORS.LIGHT_BLUE);
    return embed;
}

function getClearEmbed(user) {
    const embed = new EmbedBuilder()
    .setTitle("Successful clear!")
    .setDescription("Successfully removed all courses from your watch requests");

    addExtraStyle(embed, user, COLORS.GREEN);
    return embed;
}

function getSearchEmbed(user, courseInfo, courseIndex) {
    const embed = new EmbedBuilder()
    .setTitle(`Search results for index ${styleText(courseIndex)}`)
    .addFields(
        {
            name: "Title",
            value: styleText(courseInfo.title),
            inline: true
        },
        {
            name: "Course Number",
            value: styleText(courseInfo.courseString),
            inline: true
        },
        {
            name: "Section",
            value: styleText(courseInfo.section),
            inline: true
        }
    );

    addExtraStyle(embed, user, COLORS.LIGHT_BLUE);
    return embed;
}

function getNotifyEmbed(courseInfo, courseIndex) {
    const embed = new EmbedBuilder()
    .setTitle(`${courseInfo.title} (${courseIndex}) has opened!`)
    .addFields(
        {
            name: "Course Number",
            value: styleText(courseInfo.courseString),
            inline: true
        },
        {
            name: "Index",
            value: styleText(courseIndex),
            inline: true
        },
        {
            name: "Section",
            value: styleText(courseInfo.section),
            inline: true
        }
    )
    .setFooter({
        text: "FetchRU"
    })
    .setTimestamp()
    .setColor(COLORS.BLUE);

    return embed;
}

function getRewatchEmbed(user, courseIndex) {
    const embed = new EmbedBuilder()
    .setTitle("Successfully Re-added Watch Request!")
    .setDescription(`Successfully re-added course ${styleText(courseIndex)} to your watch requests.`)
    .setFooter({
        text: user.username,
        iconURL: user.displayAvatarURL()
    });

    addExtraStyle(embed, user, COLORS.GREEN);
    return embed;
}

function addExtraStyle(embed, user, color) {
    embed.setFooter({
        text: user.username,
        iconURL: user.displayAvatarURL()
    })
    .setTimestamp()
    .setColor(color);
}

function styleText(text) {
    return `\`${text}\``;
}

export const em = {
    getWatchEmbed,
    getUnwatchEmbed,
    getCheckEmbed,
    getClearEmbed,
    getSearchEmbed,
    getStatsEmbed,
    getRewatchEmbed,
};

export { getNotifyEmbed };