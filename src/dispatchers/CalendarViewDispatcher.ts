// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import { Action }             from 'typescript-fsa';
import { Dispatch }           from 'redux';
import { KanbanRecord,
         ConfirmDialogProps,
         AppState }           from '../types';
import { AppEventsActions as AppEventsActions_,
         appEventsActions }   from '../actions/AppEventsActions';
import { CalendarActions as CalendarActions_,
         calendarActions }    from '../actions/CalendarActions';
import { KanbanBoardActions as KanbanBoardActions_,
         kanbanBoardActions } from '../actions/KanbanBoardActions';



export type AppEventsActions = AppEventsActions_;
export type CalendarActions = CalendarActions_;
export type KanbanBoardActions = KanbanBoardActions_;


export function mapDispatchToProps(dispatch: Dispatch<Action<any>>) {
    return {
        showToday: () =>
            dispatch(calendarActions.showToday()),
        showNextMonth: () =>
            dispatch(calendarActions.showNextMonth()),
        showPreviousMonth: () =>
            dispatch(calendarActions.showPreviousMonth()),
        showNextYear: () =>
            dispatch(calendarActions.showNextYear()),
        showPreviousYear: () =>
            dispatch(calendarActions.showPreviousYear()),

        // from AppEventsActions
        showAlertDialog: (v: ConfirmDialogProps) =>
            dispatch(appEventsActions.showAlertDialog(v)),
        closeAlertDialog: () =>
            dispatch(appEventsActions.closeAlertDialog()),

        // from KanbanBoardActions
        changeActiveBoard: (boardId: string) =>
            dispatch(kanbanBoardActions.startChangeActiveBoard(Object.assign({}, { boardId }, { dispatch }))),
        updateBoardName: (v: {boardId: string, boardName: string}) =>
            dispatch(kanbanBoardActions.startUpdateBoardName(v)),
        updateStikey: (v: KanbanRecord) =>
            dispatch(kanbanBoardActions.startUpdateStikey(Object.assign({}, v, { dispatch }))),
        archiveStikey: (kanbanId: string) =>
            dispatch(kanbanBoardActions.startArchiveStikey({ kanbanId })),
        deleteStikey: (kanbanId: string) =>
            dispatch(kanbanBoardActions.startDeleteStikey(Object.assign({}, { kanbanId }, { dispatch }))),
    }
}


export function mapStateToProps(appState: AppState) {
    return Object.assign({}, { kanbanBoardState: appState.kanbanBoard }, appState.calendar);
}
