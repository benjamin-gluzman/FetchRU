import { Client, Events, GatewayIntentBits, REST, Routes } from "discord.js";
import { commands, handleCommand } from "./commands.js";
import { handleInteraction } from "./interactions.js";
import { handleAutocomplete } from "./autocomplete.js";
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

async function startBot() {
    client.on("clientReady", () => {
        console.log("Bot is Ready!");
        console.log(`Tag: ${client.user.tag}`);
    });

    client.on("interactionCreate", async (interaction) => {
        if(interaction.isChatInputCommand())
            await handleCommand(interaction); // Handles slash commands
        else if(interaction.isAutocomplete())
            await handleAutocomplete(interaction) // Handles autocomplete for commands
        else
            await handleInteraction(interaction); // Handles component interactions
    });

    await registerCommands();
    await client.login(BOT_TOKEN);
}


export {startBot, client};