// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import React                    from 'react';
import ReactDOM                 from 'react-dom';
import { Provider }             from 'react-redux';
import { ConnectedRouter }      from 'connected-react-router'
import { getLocalDb }           from './lib/db'
import                               './index.css';
import App                      from './App';
import * as serviceWorker       from './serviceWorker';
import getAppStore,
       { history }              from './store';



(async () => {
    getLocalDb();

    ReactDOM.render(
        <Provider store={await getAppStore()}>
            <ConnectedRouter history={history}>
                <App />
            </ConnectedRouter>
        </Provider>,
        document.getElementById('root'));

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA

    serviceWorker.unregister();
    // serviceWorker.register();
})();
