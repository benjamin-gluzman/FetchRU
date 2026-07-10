import { ActionRowBuilder, ButtonBuilder, ButtonStyle, TextDisplayBuilder} from "discord.js";
import { EmbedBuilder } from "discord.js";
import { database } from "./database.js";

const EMBED_COLOR = 0x0099FF;

async function reply_to_watch(interaction, course_index) {
    const embed = new EmbedBuilder()
    .setTitle("Successfully added Watch Request!")
    .setDescription(`Successfully added course ${styleText(course_index)} to your watch requests.`)
    .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL()
    })

    addExtraStyle(embed);

    await interaction.reply({
        embeds: [embed]
    });
}

async function reply_to_unwatch(interaction, course_index) {
    const embed = new EmbedBuilder()
    .setTitle("Successfully Removed Course!")
    .setDescription(`Successfully removed course ${styleText(course_index)} from your watch requests.`)
    .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL()
    })

    addExtraStyle(embed);

    await interaction.reply({
        embeds: [embed]
    });
}

async function reply_to_check(interaction, watches) {
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

    await interaction.reply({
        embeds: [embed]
    });
}

async function reply_to_clear(interaction) {
    const embed = new EmbedBuilder()
    .setTitle("Successful clear!")
    .setDescription("Successfully removed all courses from your watch requests")

    addExtraStyle(embed);

    await interaction.reply({
        embeds: [embed]
    });
}

async function reply_to_search(interaction, info, course_index) {
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

    await interaction.reply({
        embeds: [embed]
    });
}

async function reply_to_stats(interaction, mostWatched) {
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

    await interaction.reply({
        embeds: [embed]
    });
}

async function notify_user_of_open_course(user, course_index) {
    const info = database.getInfoByCourseIndex(course_index);
    
    const embed = new EmbedBuilder()
    .setTitle(`${info.title} (${course_index}) has opened!`)
    .addFields(
        {
            name: "Course Number",
            value: styleText(info.course_string),
            inline: true
        },
        {
            name: "Index",
            value: styleText(course_index),
            inline: true
        },
        {
            name: "Section",
            value: styleText(info.section),
            inline: true
        }
    )
    .setFooter({
        text: "FetchRU"
    })

    addExtraStyle(embed);

    await user.send({
        embeds: [embed]
    });
}

function addExtraStyle(embed) {
    embed
    .setTimestamp()
    .setColor(EMBED_COLOR);
}

function styleText(text) {
    return `\`${text}\``;
}

const replier = {
    reply_to_watch,
    reply_to_unwatch,
    reply_to_check,
    reply_to_clear,
    reply_to_search,
    reply_to_stats,
};

export { replier };
export { notify_user_of_open_course };