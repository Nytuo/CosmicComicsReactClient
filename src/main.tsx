import React, {Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './i18n.ts';
import {SuspensePage} from './pages/SuspensePage.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Suspense fallback={<SuspensePage/>}>
            <App/>
        </Suspense>
    </React.StrictMode>,
);
