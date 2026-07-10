import { SlashCommandBuilder, MessageFlags } from "discord.js";
import { em } from "./ui/embeds.js";
import { database } from "./database.js";

const commands = [
    new SlashCommandBuilder()
        .setName("watch")
        .setDescription("Watch a course index")
        .addStringOption(option =>
            option
                .setName("course")
                .setDescription("Course index")
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("unwatch")
        .setDescription("Stop watching a course index")
        .addStringOption(option => 
            option
                .setName("course")
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
        .setDescription("Search for course indices by the course title and/or section")
        .addStringOption(option =>
            option
                .setName("course")
                .setDescription("Course index")
                .setRequired(true)
        ),
    
    new SlashCommandBuilder()
        .setName("stats")
        .setDescription("View the most watched courses")
];




async function handle_watch(interaction) {
    const course_index = interaction.options.getString("course");
    if(!database.isValidCourseIndex(course_index)) {
        await interaction.reply("Course index is invalid");
        return;
    }

    const watches = database.getWatches(interaction.user.id), watchesUsed = watches.length;
    if(watches.includes(course_index)) {
        await interaction.reply(`You are already sniping ${course_index}`);
        return;
    }
    
    if(watchesUsed >= 20) {
        await interaction.reply("You have no more watches left");
        return;
    }

    database.addWatch(interaction.user.id, course_index);

    await interaction.reply({
        embeds: [ em.get_watch_embed(interaction, course_index) ]
    });
}

async function handle_unwatch(interaction) {
    const course_index = interaction.options.getString("course");
    if(!database.getWatches(interaction.user.id).includes(course_index)) {
        await interaction.reply("Invalid course index");
        return;
    }

    database.removeWatch(interaction.user.id, course_index);

    await interaction.reply({
        embeds: [ em.get_unwatch_embed(interaction, course_index) ]
    });
}

async function handle_check(interaction) {
    const watches = database.getWatches(interaction.user.id);
    if(watches.length === 0) {
        await interaction.reply("Not currently watching any courses");
        return;
    }
    
    await interaction.reply({
        embeds: [ em.get_check_embed(interaction, watches) ]
    });
}

async function handle_clear(interaction) {
    if(database.getWatches(interaction.user.id).length === 0) {
        await interaction.reply("Invalid request: Not currently watching any courses");
        return;
    }

    database.clearWatches(interaction.user.id);

    await interaction.reply({
        embeds: [ em.get_clear_embed() ]
    });
}

async function handle_search(interaction) {
    const course_index = interaction.options.getString("course");
    if(!database.isValidCourseIndex(course_index)) {
        await interaction.reply("Course index is invalid");
        return;
    }

    const info = database.getInfoByCourseIndex(course_index);

    await interaction.reply({
        embeds: [ em.get_search_embed(info, course_index) ]
    });
}

async function handle_stats(interaction) {
    const mostWatched = database.getMostWatchedCourses();
    if(mostWatched.length === 0) {
        await interaction.reply("No courses currently being watched");
    }

    await interaction.reply({
        embeds: [ em.get_stats_embed(mostWatched) ]
    });
}

export const cmd = {
    commands,
    handle_watch,
    handle_unwatch,
    handle_check,
    handle_clear,
    handle_search,
    handle_stats,
};