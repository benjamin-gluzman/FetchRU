import "./popup.css";
import { storage } from "./storage.js";

const watchesList = document.querySelector("#watchesList");

// Display stored watches
document.addEventListener("DOMContentLoaded", async () => {
    await loadWatches();
});

// Update DOM when a course being watched is removed (meaning it opened) in the background
chrome.runtime.onMessage.addListener(async (message) => {
    if(message.action === "update_dom") {
        await loadWatches();
    }
});

createInteractionHandlers();


function createInteractionHandlers() {
    const courseIndexInput = document.querySelector("#courseIndex"),
          addWatchBtn = document.querySelector("#addWatchBtn");

    addWatchBtn.addEventListener("click", () => {
        const courseIndex = courseIndexInput.value;
        courseIndexInput.value = "";

        storage.addWatch(courseIndex);
        watchesList.appendChild(createNewWatch(courseIndex));
    });
}

async function loadWatches() {
    watchesList.replaceChildren();
    const watches = await storage.getWatches();
    
    for(const courseIndex of watches) {
        watchesList.appendChild(createNewWatch(courseIndex));
    }
}

function createNewWatch(courseIndex) {
    const item = document.createElement("li"),
          h3 = document.createElement("h3"),
          removeBtn = document.createElement("button");
    
    h3.textContent = `${courseIndex}`;

    removeBtn.classList.add("removeBtn");
    removeBtn.addEventListener("click", async () => {
        await storage.removeWatch(courseIndex);
        watchesList.removeChild(item);
    });

    item.append(h3, removeBtn);
    return item;
}