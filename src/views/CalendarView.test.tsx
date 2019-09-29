// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import React        from 'react';
import ReactDOM     from 'react-dom';
// import CalendarView from './CalendarView';



it('renders without crashing', () => {
    const div = document.createElement('div');
    // ReactDOM.render(<CalendarView />, div);
    ReactDOM.render(<span />, div);
    ReactDOM.unmountComponentAtNode(div);
});
