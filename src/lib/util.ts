// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import { History } from 'history';



export function getCurrentView(history: History<any>) {
    let currentView = '';
    if (history.location.pathname) {
        if (history.location.pathname.startsWith('/kanban/')) {
            currentView = 'kanban';
        } else if (history.location.pathname.startsWith('/calendar/')) {
            currentView = 'calendar';
        } else if (history.location.pathname.startsWith('/edit/')) {
            currentView = 'edit';
        } else if (history.location.pathname.startsWith('/config/')) {
            currentView = 'config';
        }
    }
    return currentView;
}
