import { Client, Events, GatewayIntentBits, REST, Routes } from "discord.js";
import { cmd } from "./commands.js"
import dotenv from 'dotenv';

dotenv.config({ path: "./.env" });
const BOT_TOKEN = process.env.BOT_TOKEN, CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({    
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

async function registerCommands() {
    await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: cmd.commands }
    );

    console.log('commands registered');
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

        switch(commandName) {
            case "watch":   cmd.respond_to_watch(interaction); break;
            case "unwatch": cmd.respond_to_unwatch(interaction); break;
            case "check":   cmd.respond_to_check(interaction); break;
            case "clear":   cmd.respond_to_clear(interaction); break;
            case "search":  cmd.respond_to_search(interaction); break;
            case "stats":   cmd.respond_to_stats(interaction); break;
        }  
    });

    // Handles component interactions
    client.on("interactionCreate", async (interaction) => {
        if(!interaction.isButton()) return;


    })


    registerCommands();
    client.login(BOT_TOKEN);
}




export {startBot, client};