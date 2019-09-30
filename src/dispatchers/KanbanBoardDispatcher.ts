// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import { Action }             from 'typescript-fsa';
import { Dispatch }           from 'redux';
import { KanbanBoardRecord,
         KanbanRecord,
         UpdateStikeyLanesPayload,
         ConfirmDialogProps,
         AppState }           from '../types';
import { AppEventsActions as AppEventsActions_,
         appEventsActions } from '../actions/AppEventsActions';
import { KanbanBoardActions as KanbanBoardActions_,
         kanbanBoardActions } from '../actions/KanbanBoardActions';



export type AppEventsActions = AppEventsActions_;
export type KanbanBoardActions = KanbanBoardActions_;


export function mapDispatchToProps(dispatch: Dispatch<Action<any>>) {
    return {
        addBoard: (boardName: string) =>
            dispatch(kanbanBoardActions.startAddBoard({ boardName })),
        changeActiveBoard: (boardId: string) =>
            dispatch(kanbanBoardActions.startChangeActiveBoard({ boardId })),
        updateBoardName: (v: {boardId: string, boardName: string}) =>
            dispatch(kanbanBoardActions.startUpdateBoardName(v)),
        deleteBoard: (boardId: string) =>
            dispatch(kanbanBoardActions.startDeleteBoard({ boardId })),

        addStikey: () =>
            dispatch(kanbanBoardActions.startAddStikey({})),
        updateStikey: (v: KanbanRecord) =>
            dispatch(kanbanBoardActions.startUpdateStikey(v)),
        updateStikeyLanes: (v: UpdateStikeyLanesPayload) =>
            dispatch(kanbanBoardActions.startUpdateStikeyLanes(v)),
        archiveStikey: (kanbanId: string) =>
            dispatch(kanbanBoardActions.startArchiveStikey({ kanbanId })),
        deleteStikey: (kanbanId: string) =>
            dispatch(kanbanBoardActions.startDeleteStikey({ kanbanId })),

        editBoardAndStikeys: (v: KanbanBoardRecord) =>
            dispatch(kanbanBoardActions.startEditBoardAndStikeys(v)),

        refreshActiveBoard: () =>
            dispatch(kanbanBoardActions.startRefreshActiveBoard({})),

        // from AppEventsActions
        showAlertDialog: (v: ConfirmDialogProps) =>
            dispatch(appEventsActions.showAlertDialog(v)),
        closeAlertDialog: () =>
            dispatch(appEventsActions.closeAlertDialog()),
    };
}


export function mapStateToProps(appState: AppState) {
    return Object.assign({}, appState.kanbanBoard);
}
