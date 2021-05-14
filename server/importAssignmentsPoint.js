function importPointsByTopic(courseId, topicId) {
    const courseWorks = toArray_(Classroom.Courses.CourseWork.list(courseId).courseWork)
        .filter((courseWork) => courseWork.topicId === topicId);
    importPointsByCourseWorks(courseId, courseWorks);
}

function importPointsByCourseWorks(courseId, courseWorks) {
    const students = loadStudents_(courseId);
    if (students.length === 0) return;
    const formFiles = getFormsUnderTeacherFolder(courseId);
    courseWorks
        .filter(courseWork => courseWork.materials.length === 1 && courseWork.materials[0].form !== undefined)
        .forEach((courseWork) => {
            const publishedUrl = courseWork.materials[0].form.formUrl;
            const formFile = formFiles.find(file => file.getPublishedUrl() === publishedUrl);
            if (formFile !== undefined) importFormScoreToClassroom(courseId, courseWork.id, formFile, students);
        });
}

function getFormsUnderTeacherFolder(courseId) {
    const formMimeType = 'application/vnd.google-apps.form';
    const teacherFolder = Classroom.Courses.get(courseId).teacherFolder;
    return listUnderFolder(DriveApp.getFolderById(teacherFolder.id), formMimeType);
}

function listUnderFolder(folder, mimeType) {
    let targetFiles = [];
    const files = folder.getFiles();
    while (files.hasNext()) {
        const file = files.next();
        if (file.getMimeType() === mimeType) {
          targetFiles.push(FormApp.openById(file.getId()));
        };
    }
    var folders = folder.getFolders();
    while (folders.hasNext()) {
        targetFiles = targetFiles.concat(listUnderFolder(folders.next(), mimeType));
    }
    return targetFiles;
}

function loadStudents_(courseId) {
    let students = [];
    let token = undefined;
    do {
        const object = Classroom.Courses.Students.list(courseId, { pageToken: token });
        token = object.nextPageToken;
        students = object.students !== undefined ? students.concat(object.students) : students;    
    } while (token !== undefined);
    return students;
}
