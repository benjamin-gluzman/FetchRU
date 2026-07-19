import { database } from "./core/database.js";
import { startBot, client } from "./bot/bot.js";
import { getCourseInfo } from "./shared/rutgersApi.js";
import { pollCourses } from "./core/poller.js";

process.on("SIGINT", async () => {
    console.log("Shutting down bot");
    client.destroy();
    process.exit(0);
});


database.importCourseInfo(await getCourseInfo());

await startBot();
pollCourses();