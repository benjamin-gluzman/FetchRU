import { getOpenCourses } from "../../src/shared/rutgersApi.js";
import { storage } from "./storage.js";
import { notifyUser } from "./notifications.js";

await storage.initializeStorage();

const currWatches = await storage.getWatches();

storage.trackWatches(currWatches);

chrome.alarms.create("poll", {
    periodInMinutes: 0.5
});

chrome.alarms.onAlarm.addListener(async alarm => {
    if (alarm.name !== "poll") return;

    await pollCourses();
});

async function pollCourses() {
    const openCourses = (await getOpenCourses()).sort();

    for(const courseIndex of currWatches) {
        if(containsIndex(openCourses, courseIndex)) {
            await notifyUser(courseIndex);
            await storage.removeWatch(courseIndex);
        }
    }

    setTimeout(() => { pollCourses() }, 5000);
}

function containsIndex(openCourses, courseIndex) {
    let l = 0, r = openCourses.length - 1;
    while(l <= r) {
        let m = Math.trunc(l + (r - l) / 2);
        if(openCourses[m] === courseIndex) {
            return true;
        }
        else if(openCourses[m] > courseIndex) {
            r = m - 1;
        }
        else {
            l = m + 1;
        }
    }
    
    return false;
}