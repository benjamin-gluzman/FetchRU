import { SlashCommandBuilder, MessageFlags } from "discord.js";
import { database } from "../database.js";
import { em } from "../ui/embeds.js";


const commands = [
    new SlashCommandBuilder()
        .setName("watch")
        .setDescription("Watch a course index")
        .addStringOption(option =>
            option
                .setName("index")
                .setDescription("Course index")
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("unwatch")
        .setDescription("Stop watching a course index")
        .addStringOption(option => 
            option
                .setName("index")
                .setDescription("Course index")
                .setRequired(true)
        ),
    
    new SlashCommandBuilder()
        .setName("check")
        .setDescription("List all courses you are currently watching"),

    new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clear all courses you are currently watching"),

    new SlashCommandBuilder()
        .setName("search")
        .setDescription("Lookup information for a specific course index")
        .addStringOption(option =>
            option
                .setName("index")
                .setDescription("Course index")
                .setRequired(true)
        )
];

const MAX_WATCHES = 20;

async function handleCommand(interaction) {
    switch(interaction.commandName) {
        case "watch":   handleWatch(interaction); break;
        case "unwatch": handleUnwatch(interaction); break;
        case "check":   handleCheck(interaction); break;
        case "clear":   handleClear(interaction); break;
        case "search":  handleSearch(interaction); break;
        case "stats":   handleStats(interaction); break;
    }
}


async function handleWatch(interaction) {
    const courseIndex = interaction.options.getString("index");
    if(!database.isValidCourseIndex(courseIndex)) {
        await interaction.reply({
            embeds: [ em.getInvalidRequestEmbed(interaction.user, {
                title: "Invalid Request",
                description: `You must specify a valid index of the course you are trying to snipe\n
                Valid Usage: /snipe <index>`
            }) ]
        });
        return;
    }

    const watches = database.getWatches(interaction.user.id), watchesUsed = watches.length;
    if(watches.includes(courseIndex)) {
        await interaction.reply({
            embeds: [ em.getInvalidRequestEmbed(interaction.user, {
                title: "Invalid Request: Duplicate Index",
                description: `You are already sniping \`${courseIndex}\``
            }) ]
        });
        return;
    }
    
    if(watchesUsed >= MAX_WATCHES) {
        await interaction.reply({
            embeds: [ em.getInvalidRequestEmbed(interaction.user, {
                title: "Invalid Request",
                description: `You have no more watches left`
            }) ]
        });
        return;
    }

    database.addWatch(interaction.user.id, courseIndex);

    await interaction.reply({
        embeds: [ em.getWatchEmbed(interaction.user, courseIndex, watchesUsed + 1) ]
    });
}

async function handleUnwatch(interaction) {
    const courseIndex = interaction.options.getString("index");
    const watches = database.getWatches(interaction.user.id), watchesUsed = watches.length;

    if(!watches.includes(courseIndex)) {
        await interaction.reply({
            embeds: [ em.getInvalidRequestEmbed(interaction.user, {
                title: "Invalid Request",
                description: `You are not currently watching \`${courseIndex}\``
            }) ]
        });
        return;
    }

    database.removeWatch(interaction.user.id, courseIndex);

    await interaction.reply({
        embeds: [ em.getUnwatchEmbed(interaction.user, courseIndex, watchesUsed - 1) ]
    });
}

async function handleCheck(interaction) {
    const watches = database.getWatches(interaction.user.id);
    if(watches.length === 0) {
        await interaction.reply({
            embeds: [ em.getInvalidRequestEmbed(interaction.user, {
                title: "Invalid Request",
                description: `You are not currently watching any courses`
            }) ]
        });
        return;
    }
    
    await interaction.reply({
        embeds: [ em.getCheckEmbed(interaction.user, watches.map(courseIndex => database.getInfoByCourseIndex(courseIndex))) ]
    });
}

async function handleClear(interaction) {
    if(database.getWatches(interaction.user.id).length === 0) {
        await interaction.reply({
            embeds: [ em.getInvalidRequestEmbed(interaction.user, {
                title: "Invalid Request",
                description: `You are not currently watching any courses`
            }) ]
        });
        return;
    }

    database.clearWatches(interaction.user.id);

    await interaction.reply({
        embeds: [ em.getClearEmbed(interaction.user) ]
    });
}

async function handleSearch(interaction) {
    const courseIndex = interaction.options.getString("index");

    if(!database.isValidCourseIndex(courseIndex)) {
        await interaction.reply({
            embeds: [ em.getInvalidRequestEmbed(interaction.user, {
                title: "Invalid Request",
                description: `You must specify a valid index of the course you are trying to search\n
                Valid Usage: /search <index>`
            }) ]
        });
        return;
    }

    const courseInfo = database.getInfoByCourseIndex(courseIndex),
        meetingTime = database.getMeetingTimeByCourseIndex(courseIndex);

    await interaction.reply({
        embeds: [ em.getSearchEmbed(interaction.user, courseInfo, meetingTime) ]
    });
}


export { commands, handleCommand };
export { MAX_WATCHES };