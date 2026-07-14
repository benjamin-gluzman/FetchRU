import Database from "better-sqlite3";
import path from "path";

const db = new Database("FetchRU.db");
db.exec("PRAGMA foreign_keys = ON;");

// Create all tables
db.exec(`
CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campus TEXT,
    title TEXT,
    course_string TEXT UNIQUE,
    credits FLOAT
);

CREATE TABLE IF NOT EXISTS sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    course_index TEXT UNIQUE,
    section TEXT,

    FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE IF NOT EXISTS meeting_times (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id INTEGER NOT NULL,
    campus_name TEXT,
    day TEXT,
    time_of_day TEXT,
    start_time TEXT,
    end_time TEXT,

    FOREIGN KEY (section_id) REFERENCES sections(id)
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



const _isValidCourseIndex = db.prepare(`
    SELECT EXISTS(SELECT 1 FROM sections WHERE course_index = ?) AS valid
`);

const _getInfoByCourseIndex = db.prepare(`
    SELECT campus, title, course_string AS courseString, credits, section, course_index AS courseIndex
    FROM sections
    INNER JOIN courses
    ON sections.course_id = courses.id
    WHERE sections.course_index = ?
`);

const _getMeetingTimeByCourseIndex = db.prepare(`
    SELECT campus_name AS campusName, day, time_of_day AS timeOfDay, start_time AS startTime, end_time AS endTime
    FROM meeting_times
    WHERE section_id = (SELECT id FROM sections WHERE course_index = ?)
`);

const _clearMeetingTimes = db.prepare(`
    DELETE FROM meeting_times
`);


// Upserts
const _upsertCourse = db.prepare(`
    INSERT INTO courses (campus, title, course_string, credits)
    VALUES (?, ?, ?, ?)
    ON CONFLICT (course_string)
    DO UPDATE 
        SET campus = excluded.campus,
            title = excluded.title,
            credits = excluded.credits
    RETURNING id
`);

const _upsertSection = db.prepare(`
    INSERT INTO sections (course_id, course_index, section)
    VALUES (?, ?, ?)
    ON CONFLICT (course_index)
    DO UPDATE
        SET course_index = excluded.course_index,
            section      = excluded.section
    RETURNING id
`);

const _insertMeetingTime = db.prepare(`
    INSERT INTO meeting_times (section_id, campus_name, day, time_of_day, start_time, end_time)
    VALUES (?, ?, ?, ?, ?, ?)
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
    _clearMeetingTimes.run();

    for(const course of courses) {
        const course_id = _upsertCourse.get(course.campus, course.title, course.courseString, course.credits).id;

        for(const section of course.sections) {
            const section_id = _upsertSection.get(course_id, section.courseIndex, section.number).id;
        
            for(const meet of section.meetingTimes) {
                _insertMeetingTime.run(section_id, meet.campusName, meet.day, meet.timeOfDay, meet.startTime, meet.endTime);
            }
        }
    }
});

function isValidCourseIndex(course_index) {
    return _isValidCourseIndex.get(course_index).valid;
}

function getInfoByCourseIndex(course_index) {
    return _getInfoByCourseIndex.get(course_index);
}

function getMeetingTimeByCourseIndex(course_index) {
    return _getMeetingTimeByCourseIndex.all(course_index);
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
    getMeetingTimeByCourseIndex,
};