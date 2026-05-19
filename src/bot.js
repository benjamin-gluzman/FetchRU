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
        )
];

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

async function registerCommands() {
    await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: commands }
    );

    console.log('commands registered');
}

function startBot(courseMap) {
    client.on("clientReady", () => {
        console.log("Bot is Ready!");
        console.log(`Tag: ${client.user.tag}`);
    });


    client.on("interactionCreate", async (interaction) => {
        if(!interaction.isChatInputCommand())
            return;

        if(interaction.commandName === "watch") {
            const course = interaction.options.getString("course");
            if(courseMap.get(course) === undefined) {
                courseMap.set(course, [interaction.user.id]);
            }
            else {
                courseMap.get(course).push(interaction.user_id);
            }

            await interaction.reply(`Watching ${course} index`);
        }
        else if(interaction.commandName === "unwatch") {
            const course = interaction.options.getString("course");
            if(courseMap.get(course) === undefined || !courseMap.get(course).includes(interaction.user.id)) {
                await interaction.reply(`Not currently watching this course`);
            }
            else {
                courseMap.set(course, courseMap.get(course).filter((userId) => userId !== interaction.user.id));
            }

            await interaction.reply(`Stopped watching ${course} index`);
        }
    });

    registerCommands();
    client.login(process.env.BOT_TOKEN);
}


export {startBot, client};