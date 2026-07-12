import { EmbedBuilder } from "discord.js";
import { MAX_WATCHES } from "../bot/commands.js";

const COLORS = {
    BLUE: 0x0099FF,
    LIGHT_BLUE: 0x00BCFF,
    GREEN: 0x00FF38,
    RED: 0xFF0000,
};

function getWatchEmbed(user, courseIndex, watchesUsed) {
    const embed = new EmbedBuilder()
    .setTitle("Successfully added Watch Request!")
    .setDescription(`Successfully added course ${codeText(courseIndex)} to your watch requests.\n
                    Currently using ${codeText(`${watchesUsed}/${MAX_WATCHES}`)} watches`);

    addExtraStyle(embed, user, COLORS.GREEN);
    return embed;
}

function getUnwatchEmbed(user, courseIndex, watchesUsed) {
    const embed = new EmbedBuilder()
    .setTitle("Successfully Removed Course!")
    .setDescription(`Successfully removed course ${codeText(courseIndex)} from your watch requests.\n
                    Currently using ${codeText(`${watchesUsed}/${MAX_WATCHES}`)} watches`);

    addExtraStyle(embed, user, COLORS.GREEN);
    return embed;
}

function getCheckEmbed(user, courses) {
    const description = courses.map(course => 
        `${codeText(course.courseIndex)} - Section ${course.section} | ${course.title}`)
        .join("\n");

    const embed = new EmbedBuilder()
    .setTitle("Currently Watching")
    .setDescription(description);

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

function getSearchEmbed(user, courseInfo, meetingTime) {
    const description = meetingTime.map(meet => 
        `> ${formatTime(meet.day, meet.startTime, meet.endTime, meet.timeOfDay)} ◾ **${meet.campusName}**`)
        .join("\n");

    const embed = new EmbedBuilder()
    .setTitle(`\n${courseInfo.title} (${courseInfo.courseString})`)
    .setDescription(`**📌 Section Meeting Times**\n${description}`)
    .addFields(
        {
            name: "Section",
            value: codeText(courseInfo.section),
            inline: true
        },
        {
            name: "Index",
            value: codeText(courseInfo.courseIndex),
            inline: true
        }
    )

    addExtraStyle(embed, user, COLORS.LIGHT_BLUE);
    return embed;
}

function getNotifyEmbed(courseInfo, courseIndex) {
    const embed = new EmbedBuilder()
    .setTitle(`${courseInfo.title} (${courseIndex}) has opened!`)
    .addFields(
        {
            name: "Course Number",
            value: codeText(courseInfo.courseString),
            inline: true
        },
        {
            name: "Index",
            value: codeText(courseIndex),
            inline: true
        },
        {
            name: "Section",
            value: codeText(courseInfo.section),
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
    .setDescription(`Successfully re-added course ${codeText(courseIndex)} to your watch requests.`)
    .setFooter({
        text: user.username,
        iconURL: user.displayAvatarURL()
    });

    addExtraStyle(embed, user, COLORS.GREEN);
    return embed;
}

function getInvalidRequestEmbed(user, message) {
    const embed = new EmbedBuilder()
    .setTitle(message.title)
    .setDescription(message.description);

    addExtraStyle(embed, user, COLORS.RED);
    return embed;
}

function formatTime(day, startTime, endTime, timeOfDay) {
    if(day === "N/A" || startTime === "N/A" || endTime === "N/A") return "";

    switch(day) {
        case "M": day = "Mon"; break;
        case "T": day = "Tue"; break;
        case "W": day = "Wed"; break;
        case "H": day = "Thu"; break;
        case "F": day = "Fri"; break;
    }

    return `${day} ${startTime.slice(0, 2)}:${startTime.slice(2, 4)}${timeOfDay}M - ${endTime.slice(0, 2)}:${endTime.slice(2, 4)}${timeOfDay}M`;
}

function addExtraStyle(embed, user, color) {
    embed.setFooter({
        text: user.username,
        iconURL: user.displayAvatarURL()
    })
    .setTimestamp()
    .setColor(color);
}

function codeText(text) {
    return `\`${text}\``;
}

export const em = {
    getWatchEmbed,
    getUnwatchEmbed,
    getCheckEmbed,
    getClearEmbed,
    getSearchEmbed,
    getRewatchEmbed,
    getInvalidRequestEmbed,
};

export { getNotifyEmbed };