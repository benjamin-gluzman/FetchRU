const TERMS = {
    SPRING: 1,
    SUMMER: 7,
    FALL: 9
}

const CAMPUSES = {
    NEW_BRUNSWICK: "NB",
    CAMDEN: "CM",
    NEWARK: "NK"
};

const YEAR = 2026, TERM = TERMS.FALL;
const RETRY_TIME = 5000, ABORT_TIME = 30_000;

const OPEN_COURSES_URL = (year, term, campus) => 
    `https://classes.rutgers.edu/soc/api/openSections.json?year=${year}&term=${term}&campus=${campus}`;

const COURSE_INFO_URL = (year, term, campus) => 
    `https://classes.rutgers.edu/soc/api/courses.json?year=${year}&term=${term}&campus=${campus}`;


async function getOpenCourses() {
    let openCourses;
    while(true) {
        const controller = new AbortController();
        const timeout = setTimeout(() => { controller.abort() }, ABORT_TIME);
        const options = {signal: controller.signal};

        try {
            const results = await Promise.all([
                fetch(OPEN_COURSES_URL(YEAR, TERM, CAMPUSES.NEW_BRUNSWICK), options),
                fetch(OPEN_COURSES_URL(YEAR, TERM, CAMPUSES.CAMDEN), options),
                fetch(OPEN_COURSES_URL(YEAR, TERM, CAMPUSES.NEWARK), options)
            ]);

            for(const res of results) {
                if(!res.ok) throw new Error(`HTTP error status: ${res.status}`);
            }
            
            openCourses = (await Promise.all(results.map(res => res.json()))).flat();
            break;
        }
        catch(err) {
            console.error(`getOpenCourses() error: ${err}`);
            await new Promise(resolve => setTimeout(resolve, RETRY_TIME));
            
            console.log("retrying...");
        }
        finally {
            clearTimeout(timeout);
        }
    }

    return openCourses;
}

async function getCourseInfo() {
    let courseInfo;
    while(true) {
        const controller = new AbortController();
        const timeout = setTimeout(() => { controller.abort() }, ABORT_TIME);
        const options = {signal: controller.signal};

        try {
            const results = await Promise.all([
                fetch(COURSE_INFO_URL(YEAR, TERM, CAMPUSES.NEW_BRUNSWICK), options),
                fetch(COURSE_INFO_URL(YEAR, TERM, CAMPUSES.CAMDEN), options),
                fetch(COURSE_INFO_URL(YEAR, TERM, CAMPUSES.NEWARK), options)
            ]);

            for(const res of results) {
                if(!res.ok) throw new Error(`HTTP error status: ${res.status}`);
            }

            courseInfo = (await Promise.all(results.map(res => res.json()))).flat();
            break;
        }
        catch(err) {
            console.error(`getCourseInfo() error: ${err}`);
            await new Promise(resolve => setTimeout(resolve, RETRY_TIME));
            
            console.log("retrying...");
        }
        finally {
            clearTimeout(timeout);
        }
    }

    return courseInfo.map(course => ({
            campus: course.campusCode,
            title: course.title,
            courseString: course.courseString,
            credits: course.credits,
            sections: course.sections.map(section => ({
                courseIndex: section.index,
                number: section.number,
                meetingTimes: section.meetingTimes.map(meet => ({
                    campusName: meet.campusName || "N/A",
                    day: meet.meetingDay        || "N/A",
                    timeOfDay: meet.pmCode      || "N/A",
                    startTime: meet.startTime   || "N/A",
                    endTime: meet.endTime       || "N/A",
                }))
            }))
        }));
}

export { getOpenCourses, getCourseInfo };