import fs from 'fs';

const categories = ['General Knowledge', 'Music', 'Movies', 'Geography'];

const topTenList = [];

for (let i = 0; i < categories.length; i++) {
    for (let j = 0; j < 10; j++) {
        topTenList.push({
            question: `Question ${j + 1} for ${categories[i]}?`,
            answerList: [...Array(10)].map((_, index) => `Answer ${index + 1}`),
            category: categories[i],
        });
    }
}

fs.writeFileSync('topTenLists.json', JSON.stringify(topTenList, null, 2));