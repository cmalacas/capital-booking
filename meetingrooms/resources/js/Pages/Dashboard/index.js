import React, {Component, Fragment} from 'react';

import Navigation from '../../components/layouts/navigation';

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import Authservice from '../../components/Authservice';
import { times } from 'lodash';

const localizer = momentLocalizer(moment)

export default class Dashboard extends Component {

    constructor(props) {

        super(props);

        this.state = {

            user: {id: 0 },

        }

        this.getUser = this.getUser.bind(this);

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

    }

    render() {

        const user = this.state.user;

        const eventsList = [];

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