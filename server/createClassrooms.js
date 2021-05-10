function createClassroom(name, section){
    const ownerId = "me";
    const classroomArgs = {
      "name": name,
      "section": section,
      "ownerId": ownerId,
    };
    const response = Classroom.Courses.create(classroomArgs);
    Logger.log('%s (%s) %s', response.name, response.id, response.alternateLink);
    return response;
}