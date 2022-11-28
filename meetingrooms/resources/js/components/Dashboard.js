import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';

import Navigation from './layouts/navigation';

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

const localizer = momentLocalizer(moment)

export default class Dashboard extends Component {

    render() {

        const eventsList = [];

        return (

            <Fragment>

                <Navigation />

                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-12 pt-4">
                        <Calendar
                            localizer={localizer}
                            events={eventsList}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 500 }}
                        />
                        </div>
                    </div>
                </div>

            </Fragment>

        )

    }

}

if (document.getElementById('app')) {
    ReactDOM.render(<Dashboard />, document.getElementById('app'));
}
