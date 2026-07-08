import { Client, Events, GatewayIntentBits, SlashCommandBuilder, MessageFlags, REST, Routes } from "discord.js";
import { createWatchComponents, createUnwatchComponents, createCheckComponents } from "./components.js";
import * as database from "./database.js";
import dotenv from 'dotenv';

dotenv.config({ path: "./.env" });
const BOT_TOKEN = process.env.BOT_TOKEN, CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({    
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]});

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
        .setDescription("Clear all courses you are currently watching")
];

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

async function registerCommands() {
    await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: commands }
    );

    console.log('commands registered');
}

async function respond_to_watch(interaction) {
    const course_index = interaction.options.getString("course");

    database.addWatch(interaction.user.id, course_index);


    await interaction.reply({
        components: createWatchComponents(course_index),
        flags: MessageFlags.IsComponentsV2
    });
}

async function respond_to_unwatch(interaction) {
    const course_index = interaction.options.getString("course");
    
    database.removeWatch(interaction.user.id, course_index);

    await interaction.reply({
        components: createUnwatchComponents(course_index),
        flags: MessageFlags.IsComponentsV2
    });
}

async function respond_to_check(interaction) {
    const watches = database.getWatches(interaction.user.id);
    if(watches.length === 0)
        await interaction.reply("Not currently watching any courses"); 
    else 
        await interaction.reply(watches.join(", "));
}

async function respond_to_clear(interaction) {
    database.clearWatches(interaction.user.id);

    await interaction.reply("All courses being watched have been cleared");
}

function startBot() {
    client.on("clientReady", () => {
        console.log("Bot is Ready!");
        console.log(`Tag: ${client.user.tag}`);
    });

    // Respond to slash commands
    client.on("interactionCreate", async (interaction) => {
        if(!interaction.isChatInputCommand())
            return;

        const commandName = interaction.commandName;

        if(commandName === "watch")         respond_to_watch(interaction);
        else if(commandName === "unwatch")  respond_to_unwatch(interaction);
        else if(commandName === "check")    respond_to_check(interaction);
        else if(commandName === "clear")    respond_to_clear(interaction);
    });

    // Handles component interactions
    client.on("interactionCreate", async (interaction) => {
        if(!interaction.isButton()) return;


    })


    registerCommands();
    client.login(BOT_TOKEN);
}




export {startBot, client};