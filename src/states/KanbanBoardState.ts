// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import { reducerWithInitialState,
         ReducerBuilder }         from 'typescript-fsa-reducers';
import { push }                   from 'connected-react-router';
import { KanbanBoardState,
         KanbanBoardInitialData,
         DocumentWithContents,
         KanbanBoardDbRecord,
         KanbanBoardDbRecordUserData,
         KanbanBoardRecord,
         KanbanRecord }           from '../types';
import { appEventsActions }       from '../actions/AppEventsActions';
import { kanbanBoardActions }     from '../actions/KanbanBoardActions';
import { restartSync,
         getLocalDb }             from '../lib/db';
import { formatDate }             from '../lib/datetime';
import { getConstructedAppStore } from '../store';
import { initialData,
         boardNote }              from '../data/initial-data';



let kanbanBoardReducer: ReducerBuilder<KanbanBoardState, KanbanBoardState> = null as any;

export async function getKanbanBoardReducer() {
    if (!kanbanBoardReducer) {
        const db = getLocalDb();

        // TODO: try-catch
        let resp: PouchDB.Core.AllDocsResponse<DocumentWithContents> = null as any;

        resp = await db.allDocs({
            include_docs: true,
        });

        if (resp.rows.length === 0) {
            const data: KanbanBoardInitialData = initialData as any;

            const postRespBoards = await db.bulkDocs([
                ...data.boards.map(x => Object.assign({}, x, { boardNote })),
            ], {});

            const now = new Date();
            for (const rec of data.records) {
                rec.dueDate = formatDate(now);
                rec.boardId = postRespBoards[0].id as string;
            }
            await db.bulkDocs([
                ...data.records,
            ], {});

            resp = await db.allDocs({
                include_docs: true,
            });
        }

        const boards: KanbanBoardRecord[] = resp.rows
            .filter(x => x.doc && x.doc.type === 'kanbanBoard')
            .map(x => x.doc)
            .sort((a: any, b: any) =>
                String(a.name).toLocaleLowerCase() >= String(b.name).toLocaleLowerCase() ?
                (String(a.name) === String(b.name) ? 0 : 1) : -1) as any;
        for (const board of boards) {
            const records: KanbanRecord[] = resp.rows
                .filter(x => x.doc && x.doc.type === 'kanban' &&
                    (x.doc as KanbanRecord).boardId === board._id)
                .map(x => x.doc) as any;
            board.records = records;
        }

        const initialState: KanbanBoardState = {
            activeBoard: boards[0],
            boards: boards,
            activeBoardId: boards[0]._id,
            activeBoardIndex: 0,
        };

        const getKanbanBoardStateFromDb = async (state: KanbanBoardState, boardId: string) => {
            const board = await db.get<KanbanBoardRecord>(boardId, {});
            if (! board) {
                return state;
            }
            const records: KanbanRecord[] = (await db.find({selector: {
                type: 'kanban',
                boardId: board._id,
            }})).docs as any;
        
            board.records = records;
            const index = Math.max(0, state.boards.findIndex(x => x._id === board._id));
            const boards = state.boards.slice(0, index).concat(
                [board],
                state.boards.slice(index + 1),
            );

            return (Object.assign({}, state, {
                boards,
                activeBoardId: board._id,
                activeBoard: board,
                activeBoardIndex: index,
            }));
        }

        kanbanBoardReducer = reducerWithInitialState(initialState)
            //// addBoard async actions ////
            .case(kanbanBoardActions.startAddBoard, (state, payload) => {
                const data: KanbanBoardInitialData = initialData as any;
                const board: KanbanBoardDbRecordUserData = {
                    type: 'kanbanBoard',
                    name: payload.boardName,
                    taskStatuses: data.boards[0].taskStatuses,
                    teamOrStories: data.boards[0].teamOrStories,
                    tags: data.boards[0].tags,
                    displayBarcode: data.boards[0].displayBarcode,
                    displayMemo: data.boards[0].displayMemo,
                    displayFlags: data.boards[0].displayFlags,
                    displayTags: data.boards[0].displayTags,
                    preferArchive: data.boards[0].preferArchive,
                    boardStyle: data.boards[0].boardStyle,
                    calendarStyle: data.boards[0].calendarStyle,
                    boardNote: data.boards[0].boardNote,
                };
                db.post(board, {})
                .then(v => {
                    const saved: KanbanBoardRecord = board as any;
                    saved._id = v.id;
                    saved._rev = v.rev;
                    saved.records = [];
                    state.boards = state.boards.concat([saved]);
                    getConstructedAppStore().dispatch(kanbanBoardActions.doneAddBoard({
                        params: payload,
                        result: Object.assign({}, state, { activeBoardId: v.id, activeBoard: saved }),
                    }));
                    setTimeout(() => {
                        getConstructedAppStore().dispatch(push(`/kanban/${v.id}`));
                    }, 30);
                })
                .catch(err => {
                    getConstructedAppStore().dispatch(kanbanBoardActions.failedAddBoard({
                        params: payload,
                        error: err,
                    }));
                    setTimeout(() => {
                        getConstructedAppStore().dispatch(appEventsActions.showAlertDialog({
                            open: true,
                            title: 'Error',
                            message: 'Failed to add board: ' + err.message,
                            singleButton: true,
                            colorIsSecondary: true,
                            onClose: () => getConstructedAppStore().dispatch(appEventsActions.closeAlertDialog()),
                        }));
                    }, 30);
                });
                return state;
            })
            .case(kanbanBoardActions.doneAddBoard, (state, arg) => {
                setTimeout(() => {
                    restartSync()
                    .then(() => {
                        //
                    }).catch(err => {
                        alert(err.message);
                    })
                }, 1500);
                return arg.result;
            })
            .case(kanbanBoardActions.failedAddBoard, (state, arg) => {
                return state;
            })

            //// changeActiveBoard async actions ////
            .case(kanbanBoardActions.startChangeActiveBoard, (state, payload) => {
                (async () => {
                    try {
                        const newState = await getKanbanBoardStateFromDb(state, payload.boardId);

                        getConstructedAppStore().dispatch(kanbanBoardActions.doneChangeActiveBoard({
                            params: payload,
                            result: newState,
                        }));
                    } catch (e) {
                        getConstructedAppStore().dispatch(kanbanBoardActions.failedChangeActiveBoard({
                            params: payload,
                            error: e,
                        }));
                        setTimeout(() => {
                            getConstructedAppStore().dispatch(appEventsActions.showAlertDialog({
                                open: true,
                                title: 'Error',
                                message: 'Failed to change active board: ' + e.message,
                                singleButton: true,
                                colorIsSecondary: true,
                                onClose: () => {
                                    getConstructedAppStore().dispatch(appEventsActions.closeAlertDialog());
                                    setTimeout(() => {
                                        getConstructedAppStore().dispatch(push(`/kanban/`));
                                    }, 500);
                                },
                            }));
                        }, 30);
                    }
                })();
                return state;
            })
            .case(kanbanBoardActions.doneChangeActiveBoard, (state, arg) => {
                return arg.result;
            })
            .case(kanbanBoardActions.failedChangeActiveBoard, (state, arg) => {
                return state;
            })

            //// updateBoardName async actions ////
            .case(kanbanBoardActions.startUpdateBoardName, (state, payload) => {
                (async () => {
                    try {
                        const dbBoard = await db.get<KanbanBoardRecord>(payload.boardId);
                        if (! dbBoard) {
                            return state;
                        }
                        const records: KanbanRecord[] = (await db.find({selector: {
                            type: 'kanban',
                            boardId: dbBoard._id,
                        }})).docs as any;

                        const change = Object.assign({}, dbBoard, { name: payload.boardName });
                        const saved = await db.put(change, {});

                        change.records = records;
                        change._id = saved.id;
                        change._rev = saved.rev;

                        const index = state.boards.findIndex(x => x._id === payload.boardId);
                        const board = Object.assign({}, state.boards[index] || {}, change);

                        const boards = index >= 0 ?
                            state.boards.slice(0, index).concat(
                                [board],
                                state.boards.slice(index + 1),
                            ) : state.boards;

                            getConstructedAppStore().dispatch(kanbanBoardActions.doneUpdateBoardName({
                            params: payload,
                            result: Object.assign({}, state, {
                                boards,
                                activeBoardId: board._id,
                                activeBoard: board,
                            }),
                        }));
                    } catch (e) {
                        getConstructedAppStore().dispatch(kanbanBoardActions.failedUpdateBoardName({
                            params: payload,
                            error: e,
                        }));
                        setTimeout(() => {
                            getConstructedAppStore().dispatch(appEventsActions.showAlertDialog({
                                open: true,
                                title: 'Error',
                                message: 'Failed to change board name: ' + e.message,
                                singleButton: true,
                                colorIsSecondary: true,
                                onClose: () => getConstructedAppStore().dispatch(appEventsActions.closeAlertDialog()),
                            }));
                        }, 30);
                    }
                })();
                return state;
            })
            .case(kanbanBoardActions.doneUpdateBoardName, (state, arg) => {
                return arg.result;
            })
            .case(kanbanBoardActions.failedUpdateBoardName, (state, arg) => {
                return state;
            })

            //// deleteBoard async actions ////
            .case(kanbanBoardActions.startDeleteBoard, (state, payload) => {
                (async () => {
                    try {
                        if (state.boards.length <= 1) {
                            return state;
                        }
                        const dbBoard = await db.get<KanbanBoardDbRecord>(payload.boardId);
                        if (! dbBoard) {
                            return state;
                        }

                        const records: KanbanRecord[] = (await db.find({selector: {
                            type: 'kanban',
                            boardId: payload.boardId,
                        }})).docs as any;

                        for (const record of records) {
                            await db.remove(record, {});
                        }

                        await db.remove(dbBoard, {});

                        const activeBoardId = state.activeBoardId === payload.boardId ?
                            state.boards[0]._id : state.activeBoardId;
                        const newState = await getKanbanBoardStateFromDb(state, activeBoardId);

                        const index = newState.boards.findIndex(x => x._id === payload.boardId);

                        const boards = index >= 0 ?
                            newState.boards.slice(0, index).concat(
                                newState.boards.slice(index + 1),
                            ) : newState.boards;

                        setTimeout(() => {
                            getConstructedAppStore().dispatch(kanbanBoardActions.doneDeleteBoard({
                                params: payload,
                                result: Object.assign({}, state, {
                                    boards,
                                    activeBoardId,
                                    activeBoard: newState.activeBoard,
                                    activeBoardIndex: newState.boards.findIndex(x => x._id === activeBoardId),
                                }),
                            }));
                            setTimeout(() => {
                                getConstructedAppStore().dispatch(push(`/kanban/${activeBoardId}`));
                                setTimeout(() => {
                                    getConstructedAppStore().dispatch(appEventsActions.showAlertDialog({
                                        open: true,
                                        title: 'Done',
                                        message: 'Board is deleted successfully',
                                        singleButton: true,
                                        onClose: () => getConstructedAppStore().dispatch(appEventsActions.closeAlertDialog()),
                                    }));
                                }, 30);
                            }, 30);
                        }, 30);
                    } catch (e) {
                        getConstructedAppStore().dispatch(kanbanBoardActions.failedDeleteBoard({
                            params: payload,
                            error: e,
                        }));
                        setTimeout(() => {
                            getConstructedAppStore().dispatch(appEventsActions.showAlertDialog({
                                open: true,
                                title: 'Error',
                                message: 'Failed to delete board: ' + e.message,
                                singleButton: true,
                                colorIsSecondary: true,
                                onClose: () => getConstructedAppStore().dispatch(appEventsActions.closeAlertDialog()),
                            }));
                        }, 30);
                    }
                })();
                return state;
            })
            .case(kanbanBoardActions.doneDeleteBoard, (state, arg) => {
                return arg.result;
            })
            .case(kanbanBoardActions.failedDeleteBoard, (state, arg) => {
                return state;
            })

            //// addSticky async actions ////
            .case(kanbanBoardActions.startAddSticky, (state, payload) => {
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                const change: KanbanRecord = {
                    type: 'kanban',
                    dueDate: formatDate(today),
                    description: '# Untitled',
                    barcode: '',
                    memo: '',
                    flags: [],
                    tags: [],
                    boardId: state.activeBoardId,
                    taskStatus: state.activeBoard.taskStatuses[0].value,
                    teamOrStory: state.activeBoard.teamOrStories[0].value,
                } as any;

                const records = state.activeBoard.records.concat([change]);
                const activeBoard = Object.assign({}, state.activeBoard, { records });

                db.post(change, {})
                .then(v => {
                    change._id = v.id;
                    change._rev = v.rev;
                    getConstructedAppStore().dispatch(kanbanBoardActions.doneAddSticky({
                        params: payload,
                        result: Object.assign({}, state, { activeBoard }),
                    }));
                })
                .catch(err => {
                    getConstructedAppStore().dispatch(kanbanBoardActions.failedAddSticky({
                        params: payload,
                        error: err,
                    }));
                    setTimeout(() => {
                        getConstructedAppStore().dispatch(appEventsActions.showAlertDialog({
                            open: true,
                            title: 'Error',
                            message: 'Failed to add sticky: ' + err.message,
                            singleButton: true,
                            colorIsSecondary: true,
                            onClose: () => getConstructedAppStore().dispatch(appEventsActions.closeAlertDialog()),
                        }));
                    }, 30);
                });

                return state;
            })
            .case(kanbanBoardActions.doneAddSticky, (state, arg) => {
                setTimeout(() => {
                    restartSync()
                    .then(() => {
                        //
                    }).catch(err => {
                        alert(err.message);
                    })
                }, 1500);
                return arg.result;
            })
            .case(kanbanBoardActions.failedAddSticky, (state, arg) => {
                return state;
            })

            //// updateSticky async actions ////
            .case(kanbanBoardActions.startUpdateSticky, (state, payload) => {
                const index = state.activeBoard.records.findIndex(x => x._id === payload._id);
                if (index < 0) {
                    return state;
                }

                const change = Object.assign({}, state.activeBoard.records[index], {
                    dueDate: payload.dueDate,
                    description: payload.description,
                    barcode: payload.barcode,
                    memo: payload.memo,
                    tags: payload.tags,
                    flags: payload.flags,
                    taskStatus: payload.taskStatus,
                    teamOrStory: payload.teamOrStory,
                });

                const records = state.activeBoard.records.slice(0, index).concat(
                    [change],
                    state.activeBoard.records.slice(index + 1),
                );
                const activeBoard = Object.assign({}, state.activeBoard, { records });

                db.put(change, {})
                .then(v => {
                    change._id = v.id;
                    change._rev = v.rev;
                    getConstructedAppStore().dispatch(kanbanBoardActions.doneUpdateSticky({
                        params: payload,
                        result: Object.assign({}, state, { activeBoard }),
                    }));
                })
                .catch(err => {
                    getConstructedAppStore().dispatch(kanbanBoardActions.failedUpdateSticky({
                        params: payload,
                        error: err,
                    }));
                    setTimeout(() => {
                        getConstructedAppStore().dispatch(appEventsActions.showAlertDialog({
                            open: true,
                            title: 'Error',
                            message: 'Failed to save the sticky: ' + err.message,
                            singleButton: true,
                            colorIsSecondary: true,
                            onClose: () => getConstructedAppStore().dispatch(appEventsActions.closeAlertDialog()),
                        }));
                    }, 30);
                });

                return state;
            })
            .case(kanbanBoardActions.doneUpdateSticky, (state, arg) => {
                return arg.result;
            })
            .case(kanbanBoardActions.failedUpdateSticky, (state, arg) => {
                return state;
            })

            //// updateStickyLanes async actions ////
            .case(kanbanBoardActions.startUpdateStickyLanes, (state, payload) => {
                const index = state.activeBoard.records.findIndex(x => x._id === payload.kanbanId);
                if (index < 0) {
                    return state;
                }

                const change = Object.assign({}, state.activeBoard.records[index], {
                    taskStatus: payload.taskStatusValue,
                    teamOrStory: payload.teamOrStoryValue,
                });

                const records = state.activeBoard.records.slice(0, index).concat(
                    [change],
                    state.activeBoard.records.slice(index + 1),
                );
                const activeBoard = Object.assign({}, state.activeBoard, { records });

                db.put(change, {})
                .then(v => {
                    change._id = v.id;
                    change._rev = v.rev;
                    getConstructedAppStore().dispatch(kanbanBoardActions.doneUpdateStickyLanes({
                        params: payload,
                        result: Object.assign({}, state, { activeBoard }),
                    }));
                })
                .catch(err => {
                    getConstructedAppStore().dispatch(kanbanBoardActions.failedUpdateStickyLanes({
                        params: payload,
                        error: err,
                    }));
                    setTimeout(() => {
                        getConstructedAppStore().dispatch(appEventsActions.showAlertDialog({
                            open: true,
                            title: 'Error',
                            message: 'Failed to save the sticky: ' + err.message,
                            singleButton: true,
                            colorIsSecondary: true,
                            onClose: () => getConstructedAppStore().dispatch(appEventsActions.closeAlertDialog()),
                        }));
                    }, 30);
                });

                return state;
            })
            .case(kanbanBoardActions.doneUpdateStickyLanes, (state, arg) => {
                return arg.result;
            })
            .case(kanbanBoardActions.failedUpdateStickyLanes, (state, arg) => {
                return state;
            })

            //// archiveSticky async actions ////
            .case(kanbanBoardActions.startArchiveSticky, (state, payload) => {
                const index = state.activeBoard.records.findIndex(x => x._id === payload.kanbanId);
                if (index < 0) {
                    return state;
                }

                const change = Object.assign({}, state.activeBoard.records[index]);
                change.flags = (change.flags || []).filter(x => x !== 'Archived');
                change.flags.push('Archived');

                const records = state.activeBoard.records.slice(0, index).concat(
                    [change],
                    state.activeBoard.records.slice(index + 1),
                );
                const activeBoard = Object.assign({}, state.activeBoard, { records });

                db.put(change, {})
                .then(v => {
                    change._id = v.id;
                    change._rev = v.rev;
                    getConstructedAppStore().dispatch(kanbanBoardActions.doneArchiveSticky({
                        params: payload,
                        result: Object.assign({}, state, { activeBoard }),
                    }));
                })
                .catch(err => {
                    getConstructedAppStore().dispatch(kanbanBoardActions.failedArchiveSticky({
                        params: payload,
                        error: err,
                    }));
                    setTimeout(() => {
                        getConstructedAppStore().dispatch(appEventsActions.showAlertDialog({
                            open: true,
                            title: 'Error',
                            message: 'Failed to archive the sticky: ' + err.message,
                            singleButton: true,
                            colorIsSecondary: true,
                            onClose: () => getConstructedAppStore().dispatch(appEventsActions.closeAlertDialog()),
                        }));
                    }, 30);
                });

                return state;
            })
            .case(kanbanBoardActions.doneArchiveSticky, (state, arg) => {
                return arg.result;
            })
            .case(kanbanBoardActions.failedArchiveSticky, (state, arg) => {
                return state;
            })

            //// unarchiveSticky async actions ////
            .case(kanbanBoardActions.startUnarchiveSticky, (state, payload) => {
                const index = state.activeBoard.records.findIndex(x => x._id === payload.kanbanId);
                if (index < 0) {
                    return state;
                }

                const change = Object.assign({}, state.activeBoard.records[index]);
                change.flags = (change.flags || []).filter(x => x !== 'Archived');

                const records = state.activeBoard.records.slice(0, index).concat(
                    [change],
                    state.activeBoard.records.slice(index + 1),
                );
                const activeBoard = Object.assign({}, state.activeBoard, { records });

                db.put(change, {})
                .then(v => {
                    change._id = v.id;
                    change._rev = v.rev;
                    getConstructedAppStore().dispatch(kanbanBoardActions.doneUnarchiveSticky({
                        params: payload,
                        result: Object.assign({}, state, { activeBoard }),
                    }));
                })
                .catch(err => {
                    getConstructedAppStore().dispatch(kanbanBoardActions.failedUnarchiveSticky({
                        params: payload,
                        error: err,
                    }));
                    setTimeout(() => {
                        getConstructedAppStore().dispatch(appEventsActions.showAlertDialog({
                            open: true,
                            title: 'Error',
                            message: 'Failed to unarchive the sticky: ' + err.message,
                            singleButton: true,
                            colorIsSecondary: true,
                            onClose: () => getConstructedAppStore().dispatch(appEventsActions.closeAlertDialog()),
                        }));
                    }, 30);
                });

                return state;
            })
            .case(kanbanBoardActions.doneUnarchiveSticky, (state, arg) => {
                return arg.result;
            })
            .case(kanbanBoardActions.failedUnarchiveSticky, (state, arg) => {
                return state;
            })

            //// deleteSticky async actions ////
            .case(kanbanBoardActions.startDeleteSticky, (state, payload) => {
                const index = state.activeBoard.records.findIndex(x => x._id === payload.kanbanId);
                if (index < 0) {
                    return state;
                }

                const change = state.activeBoard.records[index];

                const records = state.activeBoard.records.slice(0, index).concat(
                    state.activeBoard.records.slice(index + 1),
                );
                const activeBoard = Object.assign({}, state.activeBoard, { records });

                db.remove(change, {})
                .then(v => {
                    getConstructedAppStore().dispatch(kanbanBoardActions.doneDeleteSticky({
                        params: payload,
                        result: Object.assign({}, state, { activeBoard }),
                    }));
                })
                .catch(err => {
                    getConstructedAppStore().dispatch(kanbanBoardActions.failedDeleteSticky({
                        params: payload,
                        error: err,
                    }));
                    setTimeout(() => {
                        getConstructedAppStore().dispatch(appEventsActions.showAlertDialog({
                            open: true,
                            title: 'Error',
                            message: 'Failed to delete the sticky: ' + err.message,
                            singleButton: true,
                            colorIsSecondary: true,
                            onClose: () => getConstructedAppStore().dispatch(appEventsActions.closeAlertDialog()),
                        }));
                    }, 30);
                });

                return state;
            })
            .case(kanbanBoardActions.doneDeleteSticky, (state, arg) => {
                return arg.result;
            })
            .case(kanbanBoardActions.failedDeleteSticky, (state, arg) => {
                return state;
            })

            //// editBoardAndStickys async actions ////
            .case(kanbanBoardActions.startEditBoardAndStickys, (state, payload) => {
                (async () => {
                    try {
                        const index = state.boards.findIndex(x => x._id === payload._id);
                        if (index < 0) {
                            return state;
                        }

                        const change = Object.assign({}, state.boards[index], {
                            name: payload.name || 'Untitled',
                            taskStatuses: payload.taskStatuses || initialData.boards[0].taskStatuses,
                            teamOrStories: payload.teamOrStories || initialData.boards[0].teamOrStories,
                            tags: payload.tags || [],
                            displayBarcode: !!payload.displayBarcode,
                            displayMemo: !!payload.displayMemo,
                            displayFlags: !!payload.displayFlags,
                            displayTags: !!payload.displayTags,
                            preferArchive: !!payload.preferArchive,
                            boardStyle: payload.boardStyle || '',
                            calendarStyle: payload.calendarStyle || '',
                            boardNote: payload.boardNote || '',
                        });

                        const v = await db.put(change, {});
                        change._id = v.id;
                        change._rev = v.rev;

                        const boards = state.boards.slice(0, index).concat(
                            [change],
                            state.boards.slice(index + 1),
                        );
                        let activeBoard = change._id === state.activeBoard._id ? change : state.activeBoard;

                        // TODO: sticky records
                        const records: KanbanRecord[] = (await db.find({selector: {
                            type: 'kanban',
                            boardId: change._id,
                        }})).docs as any;

                        const recordsNew: KanbanRecord[] = [];
                        for (const rec of payload.records || []) {
                            const recDb = records.find(x => x._id === rec._id);
                            let recNew: KanbanRecord = null as any;
                            if (recDb) {
                                recNew = Object.assign({}, rec, { type: 'kanban', boardId: change._id, _rev: recDb._rev });
                                const resp = await db.put(recNew, {});
                                recNew._id = resp.id;
                                recNew._rev = resp.rev;
                            } else {
                                recNew = Object.assign({}, rec, { type: 'kanban', boardId: change._id });
                                delete (recNew as any)._id;  // (TS>=4.0) TS2790 The operand of a 'delete' operator must be optional.
                                delete (recNew as any)._rev; // (TS>=4.0) TS2790 The operand of a 'delete' operator must be optional.
                                const resp = await db.post(recNew, {});
                                recNew._id = resp.id;
                                recNew._rev = resp.rev;
                            }
                            recordsNew.push(recNew);
                        }
                        for (const recDb of records) {
                            const recNew = recordsNew.find(x => x._id === recDb._id);
                            if (! recNew) {
                                await db.remove(recDb, {});
                            }
                        }
                        change.records = recordsNew;

                        getConstructedAppStore().dispatch(kanbanBoardActions.doneEditBoardAndStickys({
                            params: payload,
                            result: Object.assign({}, state, {
                                boards,
                                activeBoardId: activeBoard._id,
                                activeBoard: activeBoard,
                            }),
                        }));
                        setTimeout(() => {
                            getConstructedAppStore().dispatch(appEventsActions.showAlertDialog({
                                open: true,
                                title: 'Done',
                                message: 'Board is saved successfully',
                                singleButton: true,
                                onClose: () => getConstructedAppStore().dispatch(appEventsActions.closeAlertDialog()),
                            }));
                        }, 30);
                    } catch (e) {
                        getConstructedAppStore().dispatch(kanbanBoardActions.failedEditBoardAndStickys({
                            params: payload,
                            error: e,
                        }));
                        setTimeout(() => {
                            getConstructedAppStore().dispatch(appEventsActions.showAlertDialog({
                                open: true,
                                title: 'Error',
                                message: 'Failed to save the board: ' + e.message,
                                singleButton: true,
                                colorIsSecondary: true,
                                onClose: () => getConstructedAppStore().dispatch(appEventsActions.closeAlertDialog()),
                            }));
                        }, 30);
                    }
                })();

                return state;
            })
            .case(kanbanBoardActions.doneEditBoardAndStickys, (state, arg) => {
                setTimeout(() => {
                    restartSync()
                    .then(() => {
                        //
                    }).catch(err => {
                        alert(err.message);
                    })
                }, 1500);
                return arg.result;
            })
            .case(kanbanBoardActions.failedEditBoardAndStickys, (state, arg) => {
                return state;
            })

            //// refreshActiveBoard async actions ////
            .case(kanbanBoardActions.startRefreshActiveBoard, (state, payload) => {
                (async () => {
                    try {
                        const newState = await getKanbanBoardStateFromDb(state, state.activeBoard._id);

                        getConstructedAppStore().dispatch(kanbanBoardActions.doneRefreshActiveBoard({
                            params: payload,
                            result: newState,
                        }));
                    } catch (e) {
                        getConstructedAppStore().dispatch(kanbanBoardActions.failedRefreshActiveBoard({
                            params: payload,
                            error: e,
                        }));
                    }
                })();
                return state;
            })
            .case(kanbanBoardActions.doneRefreshActiveBoard, (state, arg) => {
                return arg.result;
            })
            .case(kanbanBoardActions.failedRefreshActiveBoard, (state, arg) => {
                return state;
            })
            ;
    }
    return kanbanBoardReducer;
}
