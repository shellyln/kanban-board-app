// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import actionCreatorFactory,
       { Action }                  from 'typescript-fsa';
import { KanbanBoardState,
         KanbanBoardRecord,
         KanbanRecord,
         UpdateStikeyLanesPayload,
         ConfirmDialogProps }      from '../types';



export interface KanbanBoardActions {
    addBoard: (boardName: string) =>
        Action<{boardName: string}>;
    changeActiveBoard: (id: string) =>
        Action<{boardId: string}>;
    updateBoardName: (v: {boardId: string, boardName: string}) =>
        Action<{boardId: string, boardName: string}>;
    deleteBoard: (id: string) =>
        Action<{boardId: string}>;

    addStikey: () =>
        Action<{}>;
    updateStikey: (v: KanbanRecord) =>
        Action<KanbanRecord>;
    updateStikeyLanes: (v: UpdateStikeyLanesPayload) =>
        Action<UpdateStikeyLanesPayload>;
    archiveStikey: (kanbanId: string) =>
        Action<{kanbanId: string}>;
    deleteStikey: (kanbanId: string) =>
        Action<{kanbanId: string}>;

    editBoardAndStikeys: (v: KanbanBoardRecord) =>
        Action<KanbanBoardRecord>;

    refreshActiveBoard: () =>
        Action<{}>;

    // from AppEventsActions
    showAlertDialog: (v: ConfirmDialogProps) =>
        Action<ConfirmDialogProps>;
    closeAlertDialog: () =>
        Action<void>;
}


const actionCreator = actionCreatorFactory();


const addBoard =
    actionCreator.async<{boardName: string}, KanbanBoardState, Error>('ACTIONS_ADD_BOARD');
const changeActiveBoard =
    actionCreator.async<{boardId: string}, KanbanBoardState, Error>('ACTIONS_CHANGE_ACTIVE_BOARD');
const updateBoardName =
    actionCreator.async<{boardId: string, boardName: string}, KanbanBoardState, Error>('ACTIONS_UPDATE_BOARD_NAME');
const deleteBoard =
    actionCreator.async<{boardId: string}, KanbanBoardState, Error>('ACTIONS_DELETE_BOARD');

const addStikey =
    actionCreator.async<{}, KanbanBoardState, Error>('ACTIONS_ADD_STIKEY');
const updateStikey =
    actionCreator.async<KanbanRecord, KanbanBoardState, Error>('ACTIONS_UPDATE_STIKEY');
const updateStikeyLanes =
    actionCreator.async<UpdateStikeyLanesPayload, KanbanBoardState, Error>('ACTIONS_UPDATE_STIKEY_LANES');
const archiveStikey =
    actionCreator.async<{kanbanId: string}, KanbanBoardState, Error>('ACTIONS_ARCHIVE_STIKEY');
const deleteStikey =
    actionCreator.async<{kanbanId: string}, KanbanBoardState, Error>('ACTIONS_DELETE_STIKEY');

const editBoardAndStikeys =
    actionCreator.async<KanbanBoardRecord, KanbanBoardState, Error>('ACTIONS_EDIT_BOARD_AND_STIKEYS');

const refreshActiveBoard =
    actionCreator.async<{}, KanbanBoardState, Error>('ACTIONS_REFRESH_ACTIVE_BOARD');


export const kanbanBoardActions = {
    startAddBoard: addBoard.started,
    doneAddBoard: addBoard.done,
    failedAddBoard: addBoard.failed,

    startChangeActiveBoard: changeActiveBoard.started,
    doneChangeActiveBoard: changeActiveBoard.done,
    failedChangeActiveBoard: changeActiveBoard.failed,

    startUpdateBoardName: updateBoardName.started,
    doneUpdateBoardName: updateBoardName.done,
    failedUpdateBoardName: updateBoardName.failed,

    startDeleteBoard: deleteBoard.started,
    doneDeleteBoard: deleteBoard.done,
    failedDeleteBoard: deleteBoard.failed,

    startAddStikey: addStikey.started,
    doneAddStikey: addStikey.done,
    failedAddStikey: addStikey.failed,

    startUpdateStikey: updateStikey.started,
    doneUpdateStikey: updateStikey.done,
    failedUpdateStikey: updateStikey.failed,

    startUpdateStikeyLanes: updateStikeyLanes.started,
    doneUpdateStikeyLanes: updateStikeyLanes.done,
    failedUpdateStikeyLanes: updateStikeyLanes.failed,

    startArchiveStikey: archiveStikey.started,
    doneArchiveStikey: archiveStikey.done,
    failedArchiveStikey: archiveStikey.failed,

    startDeleteStikey: deleteStikey.started,
    doneDeleteStikey: deleteStikey.done,
    failedDeleteStikey: deleteStikey.failed,

    startEditBoardAndStikeys: editBoardAndStikeys.started,
    doneEditBoardAndStikeys: editBoardAndStikeys.done,
    failedEditBoardAndStikeys: editBoardAndStikeys.failed,

    startRefreshActiveBoard: refreshActiveBoard.started,
    doneRefreshActiveBoard: refreshActiveBoard.done,
    failedRefreshActiveBoard: refreshActiveBoard.failed,
};
