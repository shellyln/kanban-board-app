// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import { KanbanBoardRecord,
         KanbanRecord,
         AppConfig }       from '../types';



export function pickEditableStikeyProps(stikey: KanbanRecord) {
    return (Object.assign(stikey._id ? { _id: stikey._id } : {}, {
        dueDate: stikey.dueDate || '',
        taskStatus: stikey.taskStatus || '',
        teamOrStory: stikey.teamOrStory || '',
        flags: stikey.flags || [],
        tags: stikey.tags || [],
        description: stikey.description || '',
        barcode: stikey.barcode || '',
        memo: stikey.memo || '',
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
        records: (board.records && board.records.map(x => pickEditableStikeyProps(x))) || [],
    });
}


export function validateStikeyProps(stikey: KanbanRecord) {
    if (typeof stikey.dueDate !== 'string') {
        throw new Error('string property "dueDate" is required.');
    }
    if (typeof stikey.taskStatus !== 'string') {
        throw new Error('string property "taskStatus" is required.');
    }
    if (typeof stikey.teamOrStory !== 'string') {
        throw new Error('string property "teamOrStory" is required.');
    }
    if (stikey.flags && Array.isArray(stikey.flags)) {
        stikey.flags.forEach(x => {
            if (typeof x !== 'string') {
                throw new Error('property "flags[x]" should be string.');
            }
        });
    } else {
        throw new Error('array property "flags" is required.');
    }
    if (stikey.tags && Array.isArray(stikey.tags)) {
        stikey.tags.forEach(x => {
            if (typeof x !== 'string') {
                throw new Error('property "tags[x]" should be string.');
            }
        });
    } else {
        throw new Error('array property "tags" is required.');
    }
    if (typeof stikey.description !== 'string') {
        throw new Error('string property "description" is required.');
    }
    if (typeof stikey.barcode !== 'string') {
        throw new Error('string property "barcode" is required.');
    }
    if (typeof stikey.memo !== 'string') {
        throw new Error('string property "memo" is required.');
    }
    return stikey;
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
    if (typeof board.calendarStyle !== 'string') {
        throw new Error('string property "calendarStyle" is required.');
    }

    if (board.records && Array.isArray(board.records)) {
        board.records.forEach(x => validateStikeyProps(x));
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
        }
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
    return conf;
}
