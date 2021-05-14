function createClassroom(name, section){
    const ownerId = "me";
    const classroomArgs = {
      "name": name,
      "section": section,
      "ownerId": ownerId,
    };
    const response = Classroom.Courses.create(classroomArgs);
    return response;
}