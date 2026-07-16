import { getCourseInfo } from "../../src/shared/rutgersApi.js";

const localStorage = chrome.storage.local;

async function initializeStorage() {
    const courseInfo = await getCourseInfo();
    
    await Promise.all([
        localStorage.set({ courseInfo }),
        localStorage.set({ watches: [] })
    ]);
}

async function getStoredCourseInfo() {
    return (await localStorage.get("courseInfo")).courseInfo;
}

async function getWatches() {
    return (await localStorage.get("watches")).watches;
}

async function addWatch(courseIndex) {
    const watches = (await localStorage.get("watches")).watches;
    watches.push(courseIndex);

    await localStorage.set({ watches });
}

async function removeWatch(courseIndex) {
    const watches = (await localStorage.get("watches")).watches;

    await localStorage.set({ watches: watches.filter(index => index != courseIndex) });
}

function trackWatches(currWatches) {
    localStorage.onChanged.addListener(async () => {
        const updatedWatches = (await localStorage.get("watches")).watches;
        currWatches.splice(0, currWatches.length, ...updatedWatches);

        try {
            await chrome.runtime.sendMessage({ action: "update_dom" });
        }
        catch(err) {
            console.log(`Error sending message: ${err}`);
        }
    });
}

export const storage = {
    initializeStorage,
    getStoredCourseInfo,
    getWatches,
    addWatch,
    removeWatch,
    trackWatches,
};