// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import actionCreatorFactory,
       { Action }             from 'typescript-fsa';
import { KanbanRecord,
         ConfirmDialogProps } from '../types';



export interface CalendarActions {
    showToday: () =>
        Action<void>;
    showNextMonth: () =>
        Action<void>;
    showPreviousMonth: () =>
        Action<void>;
    showNextYear: () =>
        Action<void>;
    showPreviousYear: () =>
        Action<void>;

    // from KanbanBoardActions
    changeActiveBoard: (id: string) =>
        Action<{boardId: string}>;
    updateBoardName: (v: {boardId: string, boardName: string}) =>
        Action<{boardId: string, boardName: string}>;
    updateSticky: (v: KanbanRecord) =>
        Action<KanbanRecord>;
    archiveSticky: (kanbanId: string) =>
        Action<{kanbanId: string}>;
    unarchiveSticky: (kanbanId: string) =>
        Action<{kanbanId: string}>;
    deleteSticky: (kanbanId: string) =>
        Action<{kanbanId: string}>;

    // from AppEventsActions
    showAlertDialog: (v: ConfirmDialogProps) =>
        Action<ConfirmDialogProps>;
    closeAlertDialog: () =>
        Action<void>;
}


const actionCreator = actionCreatorFactory();

export const calendarActions = {
    showToday: actionCreator<void>('ACTIONS_SHOW_TODAY'),
    showNextMonth: actionCreator<void>('ACTIONS_SHOW_NEXT_MONTH'),
    showPreviousMonth: actionCreator<void>('ACTIONS_SHOW_PREVIOUS_MONTH'),
    showNextYear: actionCreator<void>('ACTIONS_SHOW_NEXT_YEAR'),
    showPreviousYear: actionCreator<void>('ACTIONS_SHOW_PREVIOUS_YEAR'),
};
