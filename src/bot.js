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

function startBot(courseUserMap) {
    client.on("clientReady", () => {
        console.log("Bot is Ready!");
        console.log(`Tag: ${client.user.tag}`);
    });

    // handles slash commands
    client.on("interactionCreate", async (interaction) => {
        if(!interaction.isChatInputCommand())
            return;

        const commandName = interaction.commandName, userID = interaction.user.id;

        if(commandName === "watch") {
            const courseIndex = interaction.options.getString("course");
            if(courseUserMap.get(courseIndex) === undefined) {
                courseUserMap.set(courseIndex, [userID]);
            }
            else {
                courseUserMap.get(courseIndex).push(userID);
            }


            await interaction.reply({
                components: createWatchComponents(courseIndex),
                flags: MessageFlags.IsComponentsV2
            });
        }
        else if(commandName === "unwatch") {
            const courseIndex = interaction.options.getString("course");
            if(courseUserMap.get(courseIndex) === undefined || !courseUserMap.get(courseIndex).includes(userID)) {
                await interaction.reply(`Not currently watching this course`);
            }
            else {
                courseUserMap.set(courseIndex, courseUserMap.get(courseIndex).filter((id) => id !== userID));
            }

            await interaction.reply({
                components: createUnwatchComponents(courseIndex),
                flags: MessageFlags.IsComponentsV2
            });
        }
        else if(commandName === "check") {
            let coursesBeingWatched = [];
            for(let [courseIndex, userIds] of courseUserMap) {
                if(userIds.includes(userID)) {
                    coursesBeingWatched.push(courseIndex);
                }
            }

            await interaction.reply(coursesBeingWatched.join(" "));
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