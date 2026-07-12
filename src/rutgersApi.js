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

const OPEN_COURSES_URL = (year, term, campus) => 
    `https://classes.rutgers.edu/soc/api/openSections.json?year=${year}&term=${term}&campus=${campus}`;

const COURSE_INFO_URL = (year, term, campus) => 
    `https://classes.rutgers.edu/soc/api/courses.json?year=${year}&term=${term}&campus=${campus}`;

async function getOpenCourses() {
    const year = 2026, term = TERMS.FALL;

    const resNB = await fetch(OPEN_COURSES_URL(year, term, CAMPUSES.NEW_BRUNSWICK)),
          resCM = await fetch(OPEN_COURSES_URL(year, term, CAMPUSES.CAMDEN)),
          resNK = await fetch(OPEN_COURSES_URL(year, term, CAMPUSES.NEWARK));

    if(!resNB.ok || !resCM.ok || !resNK.ok) {
        console.log("getOpenCourses() fetch() failed");
        return;
    }

    const openCourses = [...(await resNB.json()), ...(await resCM.json()), ...(await resNK.json())];

    return openCourses;
}

async function getCourseInfo() {
    const year = 2026, term = TERMS.FALL;

    const resNB = await fetch(COURSE_INFO_URL(year, term, CAMPUSES.NEW_BRUNSWICK)),
          resCM = await fetch(COURSE_INFO_URL(year, term, CAMPUSES.CAMDEN)),
          resNK = await fetch(COURSE_INFO_URL(year, term, CAMPUSES.NEWARK));

    if(!resNB.ok || !resCM.ok || !resNK.ok) {
        console.log("getCourseInfo() fetch() failed");
        return;
    }

    const courseInfo = [...(await resNB.json()), ...(await resCM.json()), ...(await resNK.json())];

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
                    day: meet.meetingDay || "N/A",
                    timeOfDay: meet.pmCode  || "N/A",
                    startTime: meet.startTime || "N/A",
                    endTime: meet.endTime || "N/A",
                }))
            }))
        }));
}

export { getOpenCourses, getCourseInfo };