// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import { KanbanBoardRecord,
         KanbanRecord,
         AppConfig }       from '../types';



export function pickEditableStickyProps(sticky: KanbanRecord) {
    return (Object.assign(sticky._id ? { _id: sticky._id } : {}, {
        dueDate: sticky.dueDate || '',
        taskStatus: sticky.taskStatus || '',
        teamOrStory: sticky.teamOrStory || '',
        flags: sticky.flags || [],
        tags: sticky.tags || [],
        description: sticky.description || '',
        barcode: sticky.barcode || '',
        memo: sticky.memo || '',
    }));
}


export function pickEditableBoardProps(board: KanbanBoardRecord) {
    return ({
        name: board.name || '',
        taskStatuses: board.taskStatuses || [],
        teamOrStories: board.teamOrStories || [],
        tags: board.tags || [],
        displayBarcode: !!board.displayBarcode,
        displayMemo: !!board.displayMemo,
        displayFlags: !!board.displayFlags,
        displayTags: !!board.displayTags,
        preferArchive: !!board.preferArchive,
        boardStyle: board.boardStyle || '',
        calendarStyle: board.calendarStyle || '',
        boardNote: board.boardNote || '',
        records: (board.records && board.records.map(x => pickEditableStickyProps(x))) || [],
    });
}


export function validateStickyProps(sticky: KanbanRecord) {
    if (typeof sticky.dueDate !== 'string') {
        throw new Error('string property "dueDate" is required.');
    }
    if (typeof sticky.taskStatus !== 'string') {
        throw new Error('string property "taskStatus" is required.');
    }
    if (typeof sticky.teamOrStory !== 'string') {
        throw new Error('string property "teamOrStory" is required.');
    }
    if (sticky.flags && Array.isArray(sticky.flags)) {
        sticky.flags.forEach(x => {
            if (typeof x !== 'string') {
                throw new Error('property "flags[x]" should be string.');
            }
        });
    } else {
        throw new Error('array property "flags" is required.');
    }
    if (sticky.tags && Array.isArray(sticky.tags)) {
        sticky.tags.forEach(x => {
            if (typeof x !== 'string') {
                throw new Error('property "tags[x]" should be string.');
            }
        });
    } else {
        throw new Error('array property "tags" is required.');
    }
    if (typeof sticky.description !== 'string') {
        throw new Error('string property "description" is required.');
    }
    if (typeof sticky.barcode !== 'string') {
        throw new Error('string property "barcode" is required.');
    }
    if (typeof sticky.memo !== 'string') {
        throw new Error('string property "memo" is required.');
    }
    return sticky;
}


function checkStyleXSS(text: string) {
    if (text.match(/<\/style\s*>/i) || text.match(/<script\b/i)) {
        throw new Error('bad style text is set.');
    }
}


export function validateBoardProps(board: KanbanBoardRecord) {
    if (typeof board.name !== 'string') {
        throw new Error('string property "name" is required.');
    }
    if (board.taskStatuses && Array.isArray(board.taskStatuses)) {
        board.taskStatuses.forEach(x => {
            if (x.caption !== null && x.caption !== void 0 && typeof x.caption !== 'string') {
                throw new Error('property "taskStatuses[x].caption" should be string.');
            }
            if (x.className !== null && x.className !== void 0 && typeof x.className !== 'string') {
                throw new Error('property "taskStatuses[x].className" should be string.');
            }
            if (x.completed !== null && x.completed !== void 0 && typeof x.completed !== 'boolean') {
                throw new Error('property "taskStatuses[x].completed" should be boolean.');
            }
            if (typeof x.value !== 'string') {
                throw new Error('string property "taskStatuses[x].value" is required.');
            }
        });
    } else {
        throw new Error('array property "taskStatuses" is required.');
    }
    if (board.teamOrStories && Array.isArray(board.teamOrStories)) {
        board.teamOrStories.forEach(x => {
            if (x.caption !== null && x.caption !== void 0 && typeof x.caption !== 'string') {
                throw new Error('property "teamOrStories[x].caption" should be string.');
            }
            if (x.className !== null && x.className !== void 0 && typeof x.className !== 'string') {
                throw new Error('property "teamOrStories[x].className" should be string.');
            }
            if (typeof x.value !== 'string') {
                throw new Error('string property "teamOrStories[x].value" is required.');
            }
        });
    } else {
        throw new Error('array property "teamOrStories" is required.');
    }
    if (board.tags && Array.isArray(board.tags)) {
        board.tags.forEach(x => {
            if (x.className !== null && x.className !== void 0 && typeof x.className !== 'string') {
                throw new Error('property "tags[x].className" should be string.');
            }
            if (typeof x.value !== 'string') {
                throw new Error('string property "tags[x].value" is required.');
            }
        });
    } else {
        throw new Error('array property "tags" is required.');
    }
    if (typeof board.displayBarcode !== 'boolean') {
        throw new Error('boolean property "displayBarcode" is required.');
    }
    if (typeof board.displayMemo !== 'boolean') {
        throw new Error('boolean property "displayMemo" is required.');
    }
    if (typeof board.displayFlags !== 'boolean') {
        throw new Error('boolean property "displayFlags" is required.');
    }
    if (typeof board.displayTags !== 'boolean') {
        throw new Error('boolean property "displayTags" is required.');
    }
    if (typeof board.preferArchive !== 'boolean') {
        throw new Error('boolean property "preferArchive" is required.');
    }
    if (typeof board.boardStyle !== 'string') {
        throw new Error('string property "boardStyle" is required.');
    }
    checkStyleXSS(board.boardStyle);
    if (typeof board.calendarStyle !== 'string') {
        throw new Error('string property "calendarStyle" is required.');
    }
    checkStyleXSS(board.calendarStyle);
    if (typeof board.boardNote !== 'string') {
        throw new Error('string property "boardNote" is required.');
    }

    if (board.records && Array.isArray(board.records)) {
        board.records.forEach(x => validateStickyProps(x));
    } else {
        throw new Error('array property "records" is required.');
    }

    return board;
}


export function pickEditableConfigProps(conf: AppConfig) {
    return ({
        remote: {
            endpointUrl: conf.remote && conf.remote.endpointUrl ?
                conf.remote.endpointUrl : '',
            user: conf.remote && conf.remote.user ?
                conf.remote.user : '',
            password: conf.remote && conf.remote.password ?
                conf.remote.password : '',
        },
        display: {
            autoUpdate: !!(conf.display && conf.display.autoUpdate),
            autoUpdateInterval: conf.display && conf.display.autoUpdateInterval ?
                conf.display.autoUpdateInterval : 2419200,
            goAround: !!(conf.display && conf.display.goAround),
        },
    });
}


export function validateConfigProps(conf: AppConfig) {
    if (! conf.remote) {
        throw new Error('object property "remote" is required.');
    }
    if (typeof conf.remote.endpointUrl !== 'string') {
        throw new Error('string property "remote.endpointUrl" is required.');
    }
    if (typeof conf.remote.user !== 'string') {
        throw new Error('string property "remote.user" is required.');
    }
    if (typeof conf.remote.password !== 'string') {
        throw new Error('string property "remote.password" is required.');
    }

    if (! conf.display) {
        throw new Error('object property "display" is required.');
    }
    if (typeof conf.display.autoUpdate !== 'boolean') {
        throw new Error('boolean property "display.autoUpdate" is required.');
    }
    if (typeof conf.display.autoUpdateInterval !== 'number') {
        throw new Error('number property "display.autoUpdateInterval" is required.');
    }
    if (conf.display.autoUpdateInterval < 10) {
        throw new Error('number property "display.autoUpdateInterval" should 10 <= autoUpdateInterval (unit: sec).');
    }
    if (typeof conf.display.goAround !== 'boolean') {
        throw new Error('boolean property "display.goAround" is required.');
    }
    return conf;
}
