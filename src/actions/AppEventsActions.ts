// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import actionCreatorFactory,
       { Action }             from 'typescript-fsa';
import { AppConfig,
         ConfirmDialogProps,
         AppEventsState }     from '../types';



export interface AppEventsActions {
    showAlertDialog: (v: ConfirmDialogProps) =>
        Action<ConfirmDialogProps>;
    closeAlertDialog: () =>
        Action<void>;

    updateAppConfig: (v: AppConfig) =>
        Action<AppConfig>;
    resetApplication: () =>
        Action<void>;

    // from KanbanBoardActions
    changeActiveBoard: (id: string) =>
        Action<{boardId: string}>;
    refreshActiveBoard: () =>
        Action<{}>;
}


const actionCreator = actionCreatorFactory();


const updateAppConfig =
    actionCreator.async<AppConfig, AppEventsState, Error>('ACTIONS_UPDATE_APP_CONFIG');
const resetApplication =
    actionCreator.async<void, AppEventsState, Error>('ACTIONS_RESET_APPLICATION');


export const appEventsActions = {
    showAlertDialog: actionCreator<ConfirmDialogProps>('ACTIONS_SHOW_ALERT_DIALOG'),
    closeAlertDialog: actionCreator<void>('ACTIONS_CLOSE_ALERT_DIALOG'),

    startUpdateAppConfig: updateAppConfig.started,
    doneUpdateAppConfig: updateAppConfig.done,
    failedUpdateAppConfig: updateAppConfig.failed,

    startResetApplication: resetApplication.started,
    doneResetApplication: resetApplication.done,
    failedResetApplication: resetApplication.failed,
};
