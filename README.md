Classroom toolkit
---

该项目用来构建可视化界面，以方便运营人员创建或管理Google classroom班级。   
代码使用 Google Apps Script。

## 功能

1. 选择或创建班级
2. 列出班级已添加的学习材料
3. 按照 Topic 快速添加其下所有材料
4. 按照 Topic 快速导入所有 Form 的分数

## 开发Setup

使用 [clasp](https://github.com/google/clasp) 实现 Google Apps Script 的本地开发

0. 在 [Apps Script](https://script.google.com/home) 中创建项目，并在 `Project Settings` 里找到 `scriptID`
1. clasp login
2. clasp clone “[scriptId]”
3. clasp pull
4. clasp push 

## 内容配置

- 班级内容配置文件模板：[模板](https://docs.google.com/spreadsheets/d/1XMplwoPCZjkwKYzrmLWc6acLOWXd41-xCz9NXITd8SA/edit?usp=sharing)
- 创建内容配置文件，并用 URI 中的文件 ID 替换 `server/loadMaterialConfig.js` 中 `materialsConfigFileId` 的值。