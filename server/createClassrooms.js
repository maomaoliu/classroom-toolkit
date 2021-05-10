function createClassroom(name, section){
    const ownerId = "me";
    var classroomArgs = {
      "name": name,
      "section": section,
      "ownerId": ownerId,
    };
    var response = Classroom.Courses.create(classroomArgs);
    Logger.log('%s (%s) %s', response.name, response.id, response.alternateLink);
    return response;
}