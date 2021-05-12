const materialsConfigFileId = '1KQWZfKgPPabEGGPhWiPzY-qDyFCIF39sM-RkRO-od_U';
const contentType = {
    driveFileViewMode: '文件',
    driveFileCopyMode: '作业模板',
    link: '链接',
    description: '内容',
}
const materialType = {
    material: '材料',
    assignment: '作业',
}
const configColumns = {
    topic: '章节',
    title: '标题',
    materialType: '发布类型',
    contentType: '内容类型',
    contentInfo: '内容详情'
};

//  { topic | title | materialType | content { Type | Info } }
// 模板文件：https://docs.google.com/spreadsheets/d/1XMplwoPCZjkwKYzrmLWc6acLOWXd41-xCz9NXITd8SA/edit?usp=sharing
function loadMaterials() {
    const sheet = SpreadsheetApp.openById(materialsConfigFileId);
    const [headers, ...rows] = sheet.getDataRange().getValues();
    const rowObjects = convertToObjects_(headers, rows).filter(o => o.contentInfo !== '');
    var materials = [];
    for (var i = 0; i < rowObjects.length; i++) {
        const rowObject = rowObjects[i];
        const content = { type: getKey_(rowObject.contentType, contentType), info: rowObject.contentInfo };
        if (rowObject.title === '') {
            materials[materials.length - 1].content.push(content);
        } else {
            materials.push({
                topic: rowObject.topic === '' ? materials[materials.length - 1].topic : rowObject.topic,
                title: rowObject.title,
                materialType: getKey_(rowObject.materialType, materialType),
                content: [content],
            });
        }
    }
    Logger.log(materials);
}

function convertToObjects_(headers, rows) {
    return rows.reduce((ctx, row) => {
        ctx.objects.push(ctx.headers.reduce((item, header, index) => {
            var key = getKey_(header, configColumns);
            item[key] = row[index];
            return item;
        }, {}));
        return ctx;
    }, { objects: [], headers }).objects;
}

function getKey_(value, map) {
    return Object.entries(map).find(x => x[1] === value)[0];

}