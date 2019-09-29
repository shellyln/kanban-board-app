// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import { reducerWithInitialState,
         ReducerBuilder }         from 'typescript-fsa-reducers';
import { CalendarState }          from '../types';
import { calendarActions }        from '../actions/CalendarActions';



let calendarReducer: ReducerBuilder<CalendarState, CalendarState> = null as any;

export async function getCalendarReducer() {
    if (!calendarReducer) {
        const initialState: CalendarState = {
            activeMonth: new Date(), // TODO: not impl
        };
        calendarReducer = reducerWithInitialState(initialState)
            .case(calendarActions.showToday, (state) => {
                const now = new Date();
                const m = new Date(now.getFullYear(), now.getMonth(), 1);
                return Object.assign({}, state, { activeMonth: m });
            })
            .case(calendarActions.showNextMonth, (state) => {
                const now = state.activeMonth;
                const m = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                return Object.assign({}, state, { activeMonth: m });
            })
            .case(calendarActions.showPreviousMonth, (state) => {
                const now = state.activeMonth;
                const m = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                return Object.assign({}, state, { activeMonth: m });
            })
            .case(calendarActions.showNextYear, (state) => {
                const now = state.activeMonth;
                const m = new Date(now.getFullYear() + 1, now.getMonth(), 1);
                return Object.assign({}, state, { activeMonth: m });
            })
            .case(calendarActions.showPreviousYear, (state) => {
                const now = state.activeMonth;
                const m = new Date(now.getFullYear() - 1, now.getMonth(), 1);
                return Object.assign({}, state, { activeMonth: m });
            })
            ;
    }
    return calendarReducer;
}
