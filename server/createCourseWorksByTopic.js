function createCourseWorks(courseId, topicName, practiceDueTime, assignmentDueTime) {
    const materials = loadMaterials().filter(material => material.topic === topicName);
    const topicId = getOrCreateTopicId_(courseId, topicName);
    const teacherFolder = getTeacherFolder_(courseId);
    const topicFolder = getOrCreateTopicFolder_(teacherFolder, topicName);
    materials.forEach(material => {
        let dueTime = isPracticeAssignment_(material.title) ? practiceDueTime : assignmentDueTime;
        if (material.materialType === 'material') createMaterial_(material, topicId, courseId);
        if (material.materialType === 'assignment') createAssignment_(material, topicId, courseId, dueTime, topicFolder);
    })
}

function getTeacherFolder_(courseId) {
    const folderId = Classroom.Courses.get(courseId).teacherFolder.id;
    return DriveApp.getFolderById(folderId);
}

function getOrCreateTopicFolder_(teacherFolder, topicName) {
    const subfolders = teacherFolder.getFolders();
    while (subfolders.hasNext()) {
        const folder = subfolders.next();
        if (folder.getName() === topicName) return folder;
    }
    const topicFolder = DriveApp.createFolder(topicName);
    return topicFolder.moveTo(teacherFolder);
}

function getOrCreateTopicId_(courseId, topicName) {
    const topic = listTopics_(courseId).find(t => t.name === topicName);
    if (topic !== undefined) return topic.topicId;
    return Classroom.Courses.Topics.create({ name: topicName }, courseId).topicId;
}

function createMaterial_(material, topicId, courseId) {
    let courseWorkToCreate = {
        title: material.title,
        description: buildDescription_(material.content),
        materials: buildAttachements_(material.content),
        state: 'PUBLISHED',
        topicId: topicId
    };
    Classroom.Courses.CourseWorkMaterials.create(courseWorkToCreate, courseId);
}

function createAssignment_(material, topicId, courseId, dueTime, topicFolder) {
    let courseWorkToCreate = {
        title: material.title,
        description: buildDescription_(material.content),
        materials: buildAttachements_(material.content, topicFolder),
        state: 'PUBLISHED',
        workType: 'ASSIGNMENT',
        dueDate: buildDueDate_(dueTime),
        dueTime: buildDueTime_(dueTime),
        maxPoints: 1,
        topicId: topicId
    }
    Classroom.Courses.CourseWork.create(courseWorkToCreate, courseId);
}

function buildDueDate_(dueTime) {
    // "2021-06-12T19:30"
    return {
        year: parseInt(dueTime.substr(0, 4)),
        month: parseInt(dueTime.substr(5, 2)),
        day: parseInt(dueTime.substr(8, 2)),
    };
}

function buildDueTime_(dueTime) {
    // "2021-06-12T19:30"
    return {
        hours: parseInt(dueTime.substr(11, 2)),
        minutes: parseInt(dueTime.substr(14, 2)),
        seconds: 0,
        nanos: 0
    };
}

function buildDescription_(content) {
    const description = content.find(each => each.type === 'description');
    return description === undefined ? '' : description.info;
}

function buildAttachements_(content, topicFolder) {
    const attachmentContents = content.filter(each => each.type !== 'description');
    var copiedAttachments = [];
    attachmentContents.forEach(attachment => {
        const file = DriveApp.getFileById(getFileIdFromUrl(attachment.info));
        const fileCopied = file.makeCopy(topicFolder);
        copiedAttachments.push(buildAttachment_(fileCopied, attachment.type));
    });
    return copiedAttachments;
}

function buildAttachment_(file, attachmentType) {
    if (attachmentType === 'link') { return buildLinkAttachment_(file.getUrl()) }
    if (attachmentType === 'driveFileViewMode') { return buildDriveFileAttachment_(file.getId(), 'VIEW') }
    if (attachmentType === 'driveFileCopyMode') { buildDriveFileAttachment_(file.getId(), 'STUDENT_COPY') };
}

function buildLinkAttachment_(url) {
    return {
        link: { url: url }
    };
}

function buildDriveFileAttachment_(fileId, shareMode) {
    return {
        driveFile:
        {
            driveFile: { id: fileId },
            shareMode: shareMode
        }
    };
}

function isPracticeAssignment_(title) {
    return title.includes('自测题');
}

function getFileIdFromUrl(url) {
    const regex = /\/([^\/]+)\/([^\/]+)$/g; // .../../{id}/...
    const found = url.match(regex);
    return found === null ? url : found[0].substr(1, found[0].lastIndexOf('/') - 1);
}


function testCreateCourseWorks() {
    const courseId = '225663248186';
    const topicName = '1 业务建模';
    createCourseWorks(courseId, topicName, "2021-06-12T19:30", "2021-06-14T23:59");
}