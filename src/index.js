import { database } from "./database.js";
import { startBot, client } from "./bot.js";
import { getCourseInfo } from "./rutgersApi.js";
import { startPolling } from "./poller.js";

process.on("SIGINT", async () => {
    console.log("Shutting down bot");
    client.destroy();
    process.exit(0);
});


database.importCourseInfo(await getCourseInfo());

startBot();
startPolling();