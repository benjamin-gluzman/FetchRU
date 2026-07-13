import { SlashCommandBuilder } from "discord.js";
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
                .setAutocomplete(true)
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
                .setAutocomplete(true)
        ),
    
    new SlashCommandBuilder()
        .setName("help")
        .setDescription("View how to use each command")
];

const MAX_WATCHES = 20;

const INVALID_REQUESTS = {
    WATCH: 1,
    UNWATCH: 2,
    CLEAR: 3,
    SEARCH: 4,
    DUPLICATE_INDEX: 5,
    NO_MORE_WATCHES: 6,
};

async function handleCommand(interaction) {
    switch(interaction.commandName) {
        case "watch":   handleWatch(interaction); break;
        case "unwatch": handleUnwatch(interaction); break;
        case "check":   handleCheck(interaction); break;
        case "clear":   handleClear(interaction); break;
        case "search":  handleSearch(interaction); break;
        case "help":    handleHelp(interaction); break;
    }
}


async function handleWatch(interaction) {
    const courseIndex = interaction.options.getString("index");
    if(!database.isValidCourseIndex(courseIndex)) {
        await interaction.reply({
            embeds: [ em.getInvalidRequestEmbed(interaction.user, INVALID_REQUESTS.WATCH) ]
        });
        return;
    }

    const watches = database.getWatches(interaction.user.id), watchesUsed = watches.length;
    if(watches.includes(courseIndex)) {
        await interaction.reply({
            embeds: [ em.getInvalidRequestEmbed(interaction.user, INVALID_REQUESTS.DUPLICATE_INDEX) ]
        });
        return;
    }
    
    if(watchesUsed >= MAX_WATCHES) {
        await interaction.reply({
            embeds: [ em.getInvalidRequestEmbed(interaction.user, INVALID_REQUESTS.NO_MORE_WATCHES) ]
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
            embeds: [ em.getInvalidRequestEmbed(interaction.user, INVALID_REQUESTS.UNWATCH) ]
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
    
    await interaction.reply({
        embeds: [ em.getCheckEmbed(interaction.user, 
            watches.map(courseIndex => database.getInfoByCourseIndex(courseIndex)), 
            watches.length) ]
    });
}

async function handleClear(interaction) {
    if(database.getWatches(interaction.user.id).length === 0) {
        await interaction.reply({
            embeds: [ em.getInvalidRequestEmbed(interaction.user, INVALID_REQUESTS.CLEAR) ]
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
            embeds: [ em.getInvalidRequestEmbed(interaction.user, INVALID_REQUESTS.SEARCH) ]
        });
        return;
    }

    const courseInfo = database.getInfoByCourseIndex(courseIndex),
        meetingTime = database.getMeetingTimeByCourseIndex(courseIndex);

    await interaction.reply({
        embeds: [ em.getSearchEmbed(interaction.user, courseInfo, meetingTime) ]
    });
}

async function handleHelp(interaction) {
    await interaction.reply({
        embeds: [ em.getHelpEmbed(interaction.user) ]
    });
}


export { commands, handleCommand };
export { MAX_WATCHES, INVALID_REQUESTS };