import { Client, Events, GatewayIntentBits, REST, Routes } from "discord.js";
import { commands, handleCommand } from "./commands.js";
import { handleInteraction } from "./interactions.js";
import { handleAutocomplete } from "./autocomplete.js";
import dotenv from 'dotenv';

dotenv.config({ path: "./.env" });
const BOT_TOKEN = process.env.BOT_TOKEN, CLIENT_ID = process.env.CLIENT_ID;

const commandIds = new Map((await registerCommands())
    .map(cmd => [cmd.name, cmd.id]));

const client = new Client({    
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

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

    await client.login(BOT_TOKEN);
}

async function registerCommands() {
    const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

    return await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: commands }
    );
}


export {startBot, client, commandIds};