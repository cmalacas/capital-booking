import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import React, {Suspense, lazy, Fragment} from 'react';

import {
    ToastContainer,
} from 'react-toastify';

const Charts = lazy(() => import('../../Pages/Charts'));

const AppMain = () => {

    return (
        <Fragment>

            {/* Components */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-5">
                            Please wait while we load all the Components examples
                            <small>Because this is a demonstration we load at once all the Components examples. This wouldn't happen in a real live app!</small>
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/" component={Charts}/>
            </Suspense>
                
            <ToastContainer/>
        </Fragment>
    )
};

export default AppMain;