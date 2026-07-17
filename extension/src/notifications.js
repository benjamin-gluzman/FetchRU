import { storage } from "./storage.js";
import logo from "../assets/logo.png";

const notif = chrome.notifications;
const WEBREG_URL = "https://sims.rutgers.edu/webreg/editSchedule.htm?login=cas&semesterSelection=92026&indexList=";

notif.onClicked.addListener(async (notificationId) => {
    await updateBadge();
});

notif.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
    await updateBadge();

    // currently, notificationId is just the courseIndex, as the only notifs being sent are for course openings
    const courseIndex = notificationId;

    if(buttonIndex === 0) {
        chrome.tabs.create({
            url: `${WEBREG_URL}${courseIndex}`
        });
    }
    else {
        await storage.addWatch(courseIndex);
    }
});

async function notifyUser(courseIndex) {
    await notif.create(courseIndex, {
        type: "basic",
        iconUrl: logo,
        title: "Course Open!",
        message: `${courseIndex} is now open!`,
        buttons: [
            { title: "Register ↗" },
            { title: "Rewatch 🔍" }
        ]
    });

    await updateBadge();
}

async function updateBadge() {
    const unreadNotifsCount = Object.keys(await chrome.notifications.getAll()).length;

    let badgeText = "";
    if(unreadNotifsCount > 0 && unreadNotifsCount <= 99)
        badgeText = unreadNotifsCount.toString(); 
    else if(unreadNotifsCount > 99)
        badgeText = "99+";

    await chrome.action.setBadgeText({ text: badgeText });
    await chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
}

export { notifyUser }