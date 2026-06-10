import { Client, Events, GatewayIntentBits, SlashCommandBuilder, REST, Routes } from 'discord.js';
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


    client.on("interactionCreate", async (interaction) => {
        if(!interaction.isChatInputCommand())
            return;

        const commandName = interaction.commandName, userID = interaction.user.id;

        if(commandName === "watch") {
            const course = interaction.options.getString("course");
            if(courseUserMap.get(course) === undefined) {
                courseUserMap.set(course, [userID]);
            }
            else {
                courseUserMap.get(course).push(userID);
            }

            await interaction.reply(`Watching ${course} index`);
        }
        else if(commandName === "unwatch") {
            const course = interaction.options.getString("course");
            if(courseUserMap.get(course) === undefined || !courseUserMap.get(course).includes(userID)) {
                await interaction.reply(`Not currently watching this course`);
            }
            else {
                courseUserMap.set(course, courseUserMap.get(course).filter((id) => id !== userID));
            }

            await interaction.reply(`Stopped watching ${course} index`);
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

    registerCommands();
    client.login(BOT_TOKEN);
}


export {startBot, client};