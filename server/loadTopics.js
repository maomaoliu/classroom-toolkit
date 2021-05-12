function listTopicsNotReleased(courseId) {
    let topics = [];
    loadMaterials().forEach((material) => {
        let topic = topics.find(topic => topic.name === material.topic)
        if (topic !== undefined) {
            topic.materialCount = topic.materialCount + 1;
        }
        else {
            topics.push({ name: material.topic, materialCount: 1 });
        }
    })

    const topicsReleased = listTopics_(courseId);
    let topicsToRelease = topics.filter(topic => !topicsReleased.find(topicReleased => topic.name === topicReleased.name));
    topicsToRelease.sort((a, b) => judgeDiff_(a.name, b.name));
    return topicsToRelease;
}