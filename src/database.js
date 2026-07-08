import Database from "better-sqlite3";

const db = new Database("FetchRU.db");

// Create all tables
db.exec(`
CREATE TABLE IF NOT EXISTS watches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    course_index CHARACTER(5)
);
`);

// Prepare all SQL statements being used
const _addWatch = db.prepare(`
    INSERT INTO watches (user_id, course_index)
    VALUES (?, ?)
`);

const _removeWatch = db.prepare(`
    DELETE FROM watches
    WHERE user_id = ? AND course_index = ?
`);

const _clearWatches = db.prepare(`
    DELETE FROM watches
    WHERE user_id = ?
`)

const _getWatches = db.prepare(`
    SELECT course_index
    FROM watches
    WHERE user_id = ?
`);

const _getUsers = db.prepare(`
    SELECT user_id
    FROM watches
    WHERE course_index = ? 
`)
 

function addWatch(user_id, course_index) {
    _addWatch.run(user_id, course_index);
}

function removeWatch(user_id, course_index) {
    _removeWatch.run(user_id, course_index);
}

function clearWatches(user_id) {
    _clearWatches.run(user_id);
}

function getWatches(user_id) {
    return _getWatches.all(user_id).map(row => row.course_index);
}

function getUsers(course_index) {
    return _getUsers.all(course_index).map(row => row.user_id);
}


export { addWatch, removeWatch, getWatches, getUsers, clearWatches};