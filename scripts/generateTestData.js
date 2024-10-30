import fs from 'fs';
import * as constants from '../src/constants';

const topTenList = [];

for (let i = 0; i < constants.CATEGORIES.length; i++) {
    for (let j = 0; j < constants.LIST_LENGTH; j++) {
        topTenList.push({
            question: `Question ${j + 1} for ${constants.CATEGORIES[i]}?`,
            answerList: [...Array(10)].map((_, index) => `Answer ${index + 1}`),
            category: constants.CATEGORIES[i],
        });
    }
}

fs.writeFileSync('topTenLists.ts', 'export default ' + JSON.stringify(topTenList, null, 2));