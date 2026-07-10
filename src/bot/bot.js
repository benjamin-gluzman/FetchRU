import { Client, Events, GatewayIntentBits, REST, Routes } from "discord.js";
import { commands, handle_command } from "./commands.js";
import { handle_interaction } from "./interactions.js";
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
        { body: commands }
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
        if(interaction.isChatInputCommand())
            await handle_command(interaction); // Handles slash commands
        else
            await handle_interaction(interaction); // Handles component interactions
    });

    registerCommands();
    client.login(BOT_TOKEN);
}


export {startBot, client};