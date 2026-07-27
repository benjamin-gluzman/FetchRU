import { getOpenCourses } from "../../src/shared/rutgersApi.js";
import { storage } from "./storage.js";
import { notifyUser } from "./notifications.js";

storage.registerStorageListeners();

chrome.runtime.onInstalled.addListener(async () => {
    await storage.initializeStorage();

    await chrome.alarms.create("poll", {
        periodInMinutes: 0.5,
        persistAcrossSessions: true
    });
});

chrome.alarms.onAlarm.addListener(async alarm => {
    if (alarm.name !== "poll") return;
    
    await pollCourses();
});

async function pollCourses() {
    const POLLS = 6, FETCH_INTERVAL = 5000;

    for(let i = 0; i < POLLS; i++) {
        const watches = await storage.getWatches();
        const openCourses = (await getOpenCourses()).sort();

        for(const courseIndex of watches) {
            if(containsIndex(openCourses, courseIndex)) {
                await notifyUser(courseIndex);
                await storage.removeWatch(courseIndex);
            }
        }

        if(i < POLLS - 1) await sleep(FETCH_INTERVAL);
    }
}

async function sleep(time) {
    await new Promise(resolve => setTimeout(resolve, time));
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