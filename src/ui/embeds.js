import { EmbedBuilder } from "discord.js";
import { database } from "../database.js";

const EMBED_COLOR = 0x0099FF;

function get_watch_embed(interaction, course_index) {
    const embed = new EmbedBuilder()
    .setTitle("Successfully added Watch Request!")
    .setDescription(`Successfully added course ${styleText(course_index)} to your watch requests.`)
    .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL()
    })

    addExtraStyle(embed);

    return embed;
}

function get_unwatch_embed(interaction, course_index) {
    const embed = new EmbedBuilder()
    .setTitle("Successfully Removed Course!")
    .setDescription(`Successfully removed course ${styleText(course_index)} from your watch requests.`)
    .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL()
    })

    addExtraStyle(embed);

    return embed;
}

function get_check_embed(interaction, watches) {
    const body = watches.map(course_index => {
        const info = database.getInfoByCourseIndex(course_index);
        return `${styleText(course_index)} - Section ${info.section} | ${info.title}`;
    }).join("\n");

    const embed = new EmbedBuilder()
    .setTitle("Currently Watching")
    .setDescription(body)
    .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL()
    })

    addExtraStyle(embed);

    return embed;
}

function get_clear_embed() {
    const embed = new EmbedBuilder()
    .setTitle("Successful clear!")
    .setDescription("Successfully removed all courses from your watch requests")

    addExtraStyle(embed);

    return embed;
}

function get_search_embed(info, course_index) {
    const embed = new EmbedBuilder()
    .setTitle(`Search results for index ${styleText(course_index)}`)
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
    )

    addExtraStyle(embed);

    return embed;
}

function get_stats_embed(mostWatched) {
    const body = mostWatched.map(watch => {
        const info = database.getInfoByCourseIndex(watch.course_index);
        return `Watches: ${watch.count} - ${styleText(watch.course_index)} - Section ${info.section} | ${info.title}`;
    }).join("\n");

    const embed = new EmbedBuilder()
    .setTitle("Top 5 Most Watched Courses")
    .setDescription(body)
    .setFooter({
        text: "FetchRU"
    })

    addExtraStyle(embed);

    return embed;
}

function get_notify_embed(course_info, course_index) {
    const embed = new EmbedBuilder()
    .setTitle(`${course_info.title} (${course_index}) has opened!`)
    .addFields(
        {
            name: "Course Number",
            value: styleText(course_info.course_string),
            inline: true
        },
        {
            name: "Index",
            value: styleText(course_index),
            inline: true
        },
        {
            name: "Section",
            value: styleText(course_info.section),
            inline: true
        }
    )
    .setFooter({
        text: "FetchRU"
    });

    addExtraStyle(embed);

    return embed;
}

function get_rewatch_embed(interaction, course_index) {
    const embed = new EmbedBuilder()
    .setTitle("Successfully Re-added Watch Request!")
    .setDescription(`Successfully re-added course ${styleText(course_index)} to your watch requests.`)
    .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL()
    })

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
    get_watch_embed,
    get_unwatch_embed,
    get_check_embed,
    get_clear_embed,
    get_search_embed,
    get_stats_embed,
    get_rewatch_embed,
};

export { get_notify_embed };