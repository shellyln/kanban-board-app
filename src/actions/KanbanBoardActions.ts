// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import actionCreatorFactory,
       { Action }                  from 'typescript-fsa';
import { KanbanBoardState,
         KanbanBoardRecord,
         KanbanRecord,
         UpdateStickyLanesPayload,
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

    addSticky: () =>
        Action<{}>;
    updateSticky: (v: KanbanRecord) =>
        Action<KanbanRecord>;
    updateStickyLanes: (v: UpdateStickyLanesPayload) =>
        Action<UpdateStickyLanesPayload>;
    archiveSticky: (kanbanId: string) =>
        Action<{kanbanId: string}>;
    unarchiveSticky: (kanbanId: string) =>
        Action<{kanbanId: string}>;
    deleteSticky: (kanbanId: string) =>
        Action<{kanbanId: string}>;

    editBoardAndStickys: (v: KanbanBoardRecord) =>
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

const addSticky =
    actionCreator.async<{}, KanbanBoardState, Error>('ACTIONS_ADD_STICKY');
const updateSticky =
    actionCreator.async<KanbanRecord, KanbanBoardState, Error>('ACTIONS_UPDATE_STICKY');
const updateStickyLanes =
    actionCreator.async<UpdateStickyLanesPayload, KanbanBoardState, Error>('ACTIONS_UPDATE_STICKY_LANES');
const archiveSticky =
    actionCreator.async<{kanbanId: string}, KanbanBoardState, Error>('ACTIONS_ARCHIVE_STICKY');
const unarchiveSticky =
    actionCreator.async<{kanbanId: string}, KanbanBoardState, Error>('ACTIONS_UNARCHIVE_STICKY');
const deleteSticky =
    actionCreator.async<{kanbanId: string}, KanbanBoardState, Error>('ACTIONS_DELETE_STICKY');

const editBoardAndStickys =
    actionCreator.async<KanbanBoardRecord, KanbanBoardState, Error>('ACTIONS_EDIT_BOARD_AND_STICKYS');

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

    startAddSticky: addSticky.started,
    doneAddSticky: addSticky.done,
    failedAddSticky: addSticky.failed,

    startUpdateSticky: updateSticky.started,
    doneUpdateSticky: updateSticky.done,
    failedUpdateSticky: updateSticky.failed,

    startUpdateStickyLanes: updateStickyLanes.started,
    doneUpdateStickyLanes: updateStickyLanes.done,
    failedUpdateStickyLanes: updateStickyLanes.failed,

    startArchiveSticky: archiveSticky.started,
    doneArchiveSticky: archiveSticky.done,
    failedArchiveSticky: archiveSticky.failed,

    startUnarchiveSticky: unarchiveSticky.started,
    doneUnarchiveSticky: unarchiveSticky.done,
    failedUnarchiveSticky: unarchiveSticky.failed,

    startDeleteSticky: deleteSticky.started,
    doneDeleteSticky: deleteSticky.done,
    failedDeleteSticky: deleteSticky.failed,

    startEditBoardAndStickys: editBoardAndStickys.started,
    doneEditBoardAndStickys: editBoardAndStickys.done,
    failedEditBoardAndStickys: editBoardAndStickys.failed,

    startRefreshActiveBoard: refreshActiveBoard.started,
    doneRefreshActiveBoard: refreshActiveBoard.done,
    failedRefreshActiveBoard: refreshActiveBoard.failed,
};
