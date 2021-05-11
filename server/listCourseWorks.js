function listCourseWork(courseId) {
    const topics = listTopics_(courseId);
    topics.push({ topicId: undefined, name: 'No Topic' });
    let groupedCourseWorks = topics.map((topic) => { return { topic: topic, courseWorks: [] } });
    const courseWorks = toArray_(Classroom.Courses.CourseWork.list(courseId).courseWork);
    const courseWorkMaterials = toArray_(Classroom.Courses.CourseWorkMaterials.list(courseId).courseWorkMaterial);
    courseWorks.concat(courseWorkMaterials).forEach((courseWork) => {
        groupedCourseWorks.find(o => o.topic.topicId === courseWork.topicId).courseWorks.push({ id: courseWork.id, title: courseWork.title, state: courseWork.state, alternateLink: courseWork.alternateLink });
    });
    sortGroupedCourseWork_(groupedCourseWorks)
    return groupedCourseWorks;
}

function listTopics_(courseId) {
   return toArray_(Classroom.Courses.Topics.list(courseId).topic);
}

function sortGroupedCourseWork_(groupedCourseWorks) {
    groupedCourseWorks.forEach((courseWork) => courseWork.courseWorks.sort((a, b) => judgeDiff_(a.title, b.title)));
    groupedCourseWorks.sort((a, b) => judgeDiff_(a.topic.name, b.topic.name));
}

function judgeDiff_(a, b) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}

function toArray_(object) {
    return Array.isArray(object) ? object : [];
}