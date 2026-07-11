import { EmbedBuilder } from "discord.js";
import { database } from "../database.js";

const EMBED_COLOR = 0x0099FF;

function getWatchEmbed(interaction, courseIndex) {
    const embed = new EmbedBuilder()
    .setTitle("Successfully added Watch Request!")
    .setDescription(`Successfully added course ${styleText(courseIndex)} to your watch requests.`)
    .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL()
    });

    addExtraStyle(embed);

    return embed;
}

function getUnwatchEmbed(interaction, courseIndex) {
    const embed = new EmbedBuilder()
    .setTitle("Successfully Removed Course!")
    .setDescription(`Successfully removed course ${styleText(courseIndex)} from your watch requests.`)
    .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL()
    });

    addExtraStyle(embed);

    return embed;
}

function getCheckEmbed(interaction, watches) {
    const body = watches.map(courseIndex => {
        const info = database.getInfoByCourseIndex(courseIndex);
        return `${styleText(courseIndex)} - Section ${info.section} | ${info.title}`;
    }).join("\n");

    const embed = new EmbedBuilder()
    .setTitle("Currently Watching")
    .setDescription(body)
    .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL()
    });

    addExtraStyle(embed);

    return embed;
}

function getClearEmbed() {
    const embed = new EmbedBuilder()
    .setTitle("Successful clear!")
    .setDescription("Successfully removed all courses from your watch requests");

    addExtraStyle(embed);

    return embed;
}

function getSearchEmbed(info, courseIndex) {
    const embed = new EmbedBuilder()
    .setTitle(`Search results for index ${styleText(courseIndex)}`)
    .addFields(
        {
            name: "Title",
            value: styleText(info.title),
            inline: true
        },
        {
            name: "Course Number",
            value: styleText(info.course_string),
            inline: true
        },
        {
            name: "Section",
            value: styleText(info.section),
            inline: true
        }
    );

    addExtraStyle(embed);

    return embed;
}

function getStatsEmbed(mostWatched) {
    const body = mostWatched.map(watch => {
        const info = database.getInfoByCourseIndex(watch.course_index);
        return `Watches: ${watch.count} - ${styleText(watch.course_index)} - Section ${info.section} | ${info.title}`;
    }).join("\n");

    const embed = new EmbedBuilder()
    .setTitle("Top 5 Most Watched Courses")
    .setDescription(body)
    .setFooter({
        text: "FetchRU"
    });

    addExtraStyle(embed);

    return embed;
}

function getNotifyEmbed(courseInfo, courseIndex) {
    const embed = new EmbedBuilder()
    .setTitle(`${courseInfo.title} (${courseIndex}) has opened!`)
    .addFields(
        {
            name: "Course Number",
            value: styleText(courseInfo.course_string),
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
    });

    addExtraStyle(embed);

    return embed;
}

function getRewatchEmbed(interaction, courseIndex) {
    const embed = new EmbedBuilder()
    .setTitle("Successfully Re-added Watch Request!")
    .setDescription(`Successfully re-added course ${styleText(courseIndex)} to your watch requests.`)
    .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL()
    });

    addExtraStyle(embed);

    return embed;
}

function addExtraStyle(embed) {
    embed
    .setTimestamp()
    .setColor(EMBED_COLOR);
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