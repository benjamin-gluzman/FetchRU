import { EmbedBuilder } from "discord.js";
import { MAX_WATCHES, INVALID_REQUESTS } from "../bot/commands.js";
import { commandIds } from "../bot/bot.js";

const COLORS = {
    BLUE: 0x0099FF,
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

function getCheckEmbed(user, courses, watchesUsed) {
    let title, description;
    if(courses.length === 0) {
        title = "Not Watching any Courses";
        description = `To start watching a course, use </watch:${commandIds.get(`watch`)}> <index>`;
    }
    else {
        title = "Currently Watching";
        description = courses.map(course => 
            `${codeText(course.courseIndex)} - ${course.title} (${course.courseString}:${course.section})`)
            .join("\n") + `\n\nCurrently using ${codeText(`${watchesUsed}/${MAX_WATCHES}`)} watches`;
    }
    
    const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description);

    addExtraStyle(embed, user, COLORS.BLUE);
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

    addExtraStyle(embed, user, COLORS.BLUE);
    return embed;
}

function getHelpEmbed(user) {
    const embed = new EmbedBuilder()
    .setTitle("Commands")
    .setDescription(`
    </watch:${commandIds.get(`watch`)}> starts watching a course index\n
    </unwatch:${commandIds.get(`unwatch`)}> stops watching a course index\n
    </check:${commandIds.get(`check`)}> lists all courses you are currently watching\n
    </clear:${commandIds.get(`clear`)}> clears all courses you are currently watching\n
    </search:${commandIds.get(`search`)}> looks up extra info about a specific course index\n
    `);

    addExtraStyle(embed, user, COLORS.BLUE);
    return embed;
}

function getNotifyEmbed(user, courseInfo, courseIndex) {
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

    addExtraStyle(embed, user, COLORS.RED);
    return embed;
}

function getRewatchEmbed(user, courseIndex) {
    const embed = new EmbedBuilder()
    .setTitle("Successfully Re-added Watch Request!")
    .setDescription(`Successfully re-added course ${codeText(courseIndex)} to your watch requests.`);

    addExtraStyle(embed, user, COLORS.GREEN);
    return embed;
}

function getInvalidRequestEmbed(user, code) {
    let description;
    switch(code) {
        case INVALID_REQUESTS.WATCH:
            description = `You must specify a valid index of the course you are trying to snipe.\n
            Valid Usage: </watch:${commandIds.get(`watch`)}> <index>`;
            break;
        case INVALID_REQUESTS.UNWATCH:
            description = `You are not currently watching this course.\n
            Please use </unwatch:${commandIds.get(`unwatch`)}> with a course index you are currently watching.`
            break;
        case INVALID_REQUESTS.CLEAR:
            description = `You are not currently watching any courses.\n
            Start watching a course using </watch:${commandIds.get(`watch`)}> <index>`
            break;
        case INVALID_REQUESTS.SEARCH:
            description = `You must specify a valid index of the course you are trying to search.\n
            Valid Usage: </search:${commandIds.get(`search`)}> <index>`
            break;
        case INVALID_REQUESTS.DUPLICATE_INDEX:
            description = `You are already watching this course.`
            break;
        case INVALID_REQUESTS.NO_MORE_WATCHES:
            description = `You have no more watches left.\n
            Use </unwatch:${commandIds.get(`unwatch`)}> or ${commandIds.get(`clear`)} to make room.`
            break;
    }

    const embed = new EmbedBuilder()
    .setTitle("Invalid Request")
    .setDescription(description);

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
    .setThumbnail(user.displayAvatarURL())
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
    getHelpEmbed,
    getRewatchEmbed,
    getInvalidRequestEmbed,
};

export { getNotifyEmbed };