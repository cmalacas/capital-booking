import React, {Component, Fragment} from 'react';

import Navigation from '../../components/layouts/navigation';

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import Authservice from '../../components/Authservice';

const localizer = momentLocalizer(moment)

export default class Dashboard extends Component {

    constructor(props) {

        super(props);

        this.state = {

            user: {id: 0 },
            bookings: [],

        }

        this.getUser = this.getUser.bind(this);
        this.getData = this.getData.bind(this);

    }

    getData() {

        Authservice.post('/bookings/get', false)
        .then( response => {

            if (response.bookings) {

                this.setState({bookings: response.bookings});

            }

        })

    }

    getUser() {

        Authservice.getUserData()
        .then( response => {

            if (response.user) {

                this.setState({ user: response.user });

            }

        })

    }

    componentDidMount() {

        this.getUser();
        this.getData();

    }

    render() {

        const user = this.state.user;

        const eventsList = this.state.bookings.map( b => {

            const dates = b.date.split('-');

            const froms = b.from_time.split(':');

            const tos = b.to_time.split(':');

            const start = new Date(dates[0], parseInt(dates[1]) - 1, dates[2], froms[0], froms[1]);

            const end = new Date(dates[0], parseInt(dates[1]) - 1, dates[2], tos[0], tos[1]);

            const desc = <Fragment>
                            <div>{b.client_name}</div>
                            <div>{b.meeting_room_name}</div>
                            <div>{b.date} {b.from_time} {b.to_time}</div>
                         </Fragment>

            return {

                'title' : '',
                'start' : start,
                'end': end,
                'allDay': false,
                'data': b,
                'desc' : desc

            }


        });

        return (

            <Fragment>

                <Navigation 
                    user={user}
                />

                <div className="container">
                    <div className="row justify-content-center mr-0 ml-0">
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