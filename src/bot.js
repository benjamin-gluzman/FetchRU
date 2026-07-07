import { Client, Events, GatewayIntentBits, SlashCommandBuilder, MessageFlags, REST, Routes } from "discord.js";
import { createWatchComponents, createUnwatchComponents, createCheckComponents } from "./components.js"
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
];

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

async function registerCommands() {
    await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: commands }
    );

    console.log('commands registered');
}

function startBot(database) {
    client.on("clientReady", () => {
        console.log("Bot is Ready!");
        console.log(`Tag: ${client.user.tag}`);
    });

    // handles slash commands
    client.on("interactionCreate", async (interaction) => {
        if(!interaction.isChatInputCommand())
            return;

        const commandName = interaction.commandName, user_id = interaction.user.id;

        if(commandName === "watch") {
            const course_index = interaction.options.getString("course");

            database.addWatch(user_id, course_index);


            await interaction.reply({
                components: createWatchComponents(course_index),
                flags: MessageFlags.IsComponentsV2
            });
        }
        else if(commandName === "unwatch") {
            const course_index = interaction.options.getString("course");
            
            database.removeWatch(user_id, course_index);

            await interaction.reply({
                components: createUnwatchComponents(course_index),
                flags: MessageFlags.IsComponentsV2
            });
        }
        else if(commandName === "check") {
            const watches = database.getWatches(user_id);
            if(watches.length === 0)
                await interaction.reply("Not currently watching any courses"); 
            else 
                await interaction.reply(watches.join(", "));
        }
    });

    // handles component interactions
    client.on("interactionCreate", async (interaction) => {
        if(!interaction.isButton()) return;


    })


    registerCommands();
    client.login(BOT_TOKEN);
}




export {startBot, client};