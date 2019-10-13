// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import { RouterState } from 'connected-react-router';



//// Documents ////

export interface DocumentWithNoContents {
    _id: string;
}

export interface DocumentWithContents extends DocumentWithNoContents {
    _rev: string;
    type: string;
}

export interface LaneDef {
    value: string;
    caption: string;
    className: string;
};

export interface StatusLaneDef extends LaneDef {
    completed?: boolean;
};

export interface TagDef {
    value: string;
    className: string;
};


export type KanbanRecordDbRecordUserData = {
    type: 'kanban',
    dueDate: string;
    description: string;
    barcode: string;
    memo: string;
    flags: string[];
    tags: string[];
    boardId: string;
    taskStatus: string;
    teamOrStory: string;
};

export type KanbanRecord = KanbanRecordDbRecordUserData & DocumentWithContents;


export interface KanbanBoardDbRecordUserData {
    type: 'kanbanBoard',
    name: string;
    taskStatuses: StatusLaneDef[];
    teamOrStories: LaneDef[];
    tags: TagDef[];
    displayBarcode: boolean,
    displayMemo: boolean,
    displayFlags: boolean,
    displayTags: boolean,
    preferArchive: boolean,
    boardStyle: string;
    calendarStyle: string;
    boardNote: string;
};

export type KanbanBoardDbRecord = DocumentWithContents & KanbanBoardDbRecordUserData;

export interface KanbanBoardRecord extends KanbanBoardDbRecord {
    records: KanbanRecord[];
};

export interface KanbanBoardInitialData {
    boards: KanbanBoardDbRecord[];
    records: KanbanRecord[];
}


//// Config

export interface AppConfigRemoteSettings {
    endpointUrl: string;
    user: string;
    password: string;
}

export interface AppConfigDisplaySettings {
    autoUpdate: boolean;
    autoUpdateInterval: number;
    goAround: boolean;
}

export interface AppConfigUserData {
    type: 'appConfig',
    remote: AppConfigRemoteSettings;
    display: AppConfigDisplaySettings;
}

export type AppConfigDbRecord = DocumentWithContents & AppConfigUserData;
export type AppConfig = AppConfigDbRecord;


//// Components props

export type ConfirmDialogProps = {
    open: boolean,
    title: string,
    message: string,
    singleButton?: boolean;
    colorIsSecondary?: boolean,
    applyButtonCaption?: string,
    cancelButtonCaption?: string,
    fab?: any,
    confirmingTextLabel?: string,
    confirmingTextValue?: string,
    onClose: (apply: boolean) => void,
};

export type TextInputDialogProps = {
    open: boolean,
    title: string,
    message: string,
    fieldLabel: string,
    value: string,
    colorIsSecondary?: boolean,
    applyButtonCaption?: string,
    cancelButtonCaption?: string,
    validator?: (value: string) => boolean,
    onClose: (apply: boolean, value?: string) => void,
};

export type KanbanDialogProps = {
    open: boolean,
    record: KanbanRecord,
    taskStatuses: StatusLaneDef[]; // TODO: redundant
    teamOrStories: LaneDef[];      // TODO: redundant
    board: KanbanBoardRecord,
    onApply: (rec: KanbanRecord) => void,
    onArchive: (recId: string) => void,
    onUnarchive: (recId: string) => void,
    onDelete: (recId: string) => void,
    onCancel: () => void,
};


//// Action payloads ////

export interface UpdateStickyLanesPayload {
    kanbanId: string;
    taskStatusValue: string;
    teamOrStoryValue: string;
};


//// States ////

export interface KanbanBoardState {
    activeBoard: KanbanBoardRecord;
    boards: KanbanBoardRecord[];
    activeBoardId: string;
    activeBoardIndex: number;
}

export interface CalendarState {
    activeMonth: Date;
}

export interface AppEventsState {
    alertDialog: ConfirmDialogProps;
    appConfig: AppConfig;
}

export type AppState = {
    router: RouterState,
    appEvents: AppEventsState,
    kanbanBoard: KanbanBoardState,
    calendar: CalendarState,
};
