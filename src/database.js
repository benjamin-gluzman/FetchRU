import Database from "better-sqlite3";

const db = new Database("FetchRU.db");
db.exec("PRAGMA foreign_keys = ON;");

// Create all tables
db.exec(`
CREATE TABLE IF NOT EXISTS courses (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   title TEXT,
   course_string TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS sections (
   course_index TEXT PRIMARY KEY,
   course_id INTEGER NOT NULL,
   section TEXT,

   FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE IF NOT EXISTS watches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    course_index TEXT
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
`);

const _getWatches = db.prepare(`
    SELECT course_index
    FROM watches
    WHERE user_id = ?
`);

const _getUsers = db.prepare(`
    SELECT user_id
    FROM watches
    WHERE course_index = ? 
`);
 
const _upsertCourse = db.prepare(`
    INSERT INTO courses (title, course_string)
    VALUES (?, ?)
    ON CONFLICT (course_string)
    DO UPDATE 
        SET title = excluded.title
    RETURNING id
`);

const _upsertSection = db.prepare(`
    INSERT INTO sections (course_index, course_id, section)
    VALUES (?, ?, ?)
    ON CONFLICT (course_index)
    DO UPDATE
        SET course_index = excluded.course_index,
            section      = excluded.section
`);


const _isValidCourseIndex = db.prepare(`
    SELECT EXISTS(SELECT 1 FROM sections WHERE course_index = ?) AS valid
`);

const _getInfoByCourseIndex = db.prepare(`
    SELECT title, course_string AS courseString, section, course_index AS courseIndex
    FROM sections
    INNER JOIN courses
    ON sections.course_id = courses.id
    WHERE sections.course_index = ?
`);

const _isValidCourseString = db.prepare(`
    SELECT EXISTS(SELECT 1 FROM courses WHERE course_string = ?) AS valid
`);

const _getInfoByCourseString = db.prepare(`
    SELECT title, course_string AS courseString
    FROM courses
    WHERE course_string = ?
`);

const _getSectionInfoByCourseString = db.prepare(`
    SELECT course_index AS courseIndex, section
    FROM sections
    WHERE course_id = (SELECT id FROM courses WHERE course_string = ?)
`);

const _getMostWatchedCourses = db.prepare(`
    SELECT course_index AS courseIndex, COUNT(user_id) AS count
    FROM watches
    GROUP BY course_index
    ORDER BY count DESC LIMIT 5
`);




// Wrap 'private' SQL statements in public functions
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

const importCourseInfo = db.transaction(courses => {
    for(const course of courses) {
        const id = _upsertCourse.get(course.title, course.courseString).id;

        for(const section of course.sections) {
            _upsertSection.run(section.index, id, section.number);
        }
    }
});

function isValidCourseIndex(course_index) {
    return _isValidCourseIndex.get(course_index).valid;
}

function getInfoByCourseIndex(course_index) {
    return _getInfoByCourseIndex.get(course_index);
}

function isValidCourseString(course_string) {
    return _isValidCourseString.get(course_string).valid;
}

function getInfoByCourseString(course_string) {
    return _getInfoByCourseString.get(course_string);
}

function getSectionInfoByCourseString(course_string) {
    return _getSectionInfoByCourseString.all(course_string);
}

function getMostWatchedCourses() {
    return _getMostWatchedCourses.all();
}



export const database = {
    addWatch,
    removeWatch,
    clearWatches,
    getWatches,
    getUsers,
    importCourseInfo,
    isValidCourseIndex,
    getInfoByCourseIndex,
    isValidCourseString,
    getInfoByCourseString,
    getSectionInfoByCourseString,
    getMostWatchedCourses,
};