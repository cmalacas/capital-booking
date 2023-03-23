import React, {Component, Fragment} from 'react';

import Authservice from '../Authservice';

import { formatter } from '../Functions';

import {DropdownToggle, Nav, Dropdown, DropdownMenu, DropdownItem, Row, Col} from 'reactstrap';
export default class Navigation2 extends Component {

    constructor(props) {

        super(props);

        this.state = {

            room_id: 0,
            open: false,

        }

        this.doLogout = this.doLogout.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);

    }

    close() {

        this.setState({ room_id: 0 });

    }

    open() {

        this.setState({ open: !this.state.open });

    }

    doLogout() {

        Authservice.doLogout();

        location = '/login';

    }

    render() {

        const user = this.props.user;

        return (

            <Fragment>

                <nav className="header navbar navbar-expand-md navbar-light bg-white shadow-sm">
                    <div className="container">
                        <button className="navbar-toggler"  
                            type="button" 
                            data-toggle="collapse"
                            data-target="#navbarSupportedContent" 
                            aria-controls="navbarSupportedContent" 
                            aria-expanded="false" aria-label="">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div 
                            className="collapse navbar-collapse" 
                            id="navbarSupportedContent"
                        >
                            

                            { user && user.id > 0 ?

                            <Fragment>

                                

                                <ul className="navbar-nav ml-auto">
                                    <a id="navbarDropdown" className="nav-link dropdown-toggle" href="#" 
                                    role="button" 
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        { user.firstname } { user.lastname }
                                    </a>

                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                        {
                                            user.type === 1 ?

                                                <Fragment>
                                                    <a 
                                                        className="nav-link" 
                                                        href="/"
                                                    >
                                                        Dashboard
                                                    </a>
                                                    <a 
                                                        className="nav-link" 
                                                        href="/meetingrooms"
                                                    >
                                                        Meeting Rooms
                                                    </a>

                                                    <a 
                                                        className="nav-link" 
                                                        href="/bookings"
                                                    >
                                                        Bookings
                                                    </a>
                                                </Fragment>

                                            : '' 
                                        }
                                        <a 
                                            className="nav-link" style={{ cursor: 'pointer' }}
                                            onClick={this.doLogout}
                                        >
                                            Logout
                                        </a>
                                    </div>
                                    
                                </ul>

                            </Fragment>

                            : 
                                
                            <ul className="navbar-nav ml-auto">

                                <li className="nav-item">
                                    <a className="nav-link" href="/login">Login</a>
                                </li>
                            
                                <li className="nav-item">
                                    <a className="nav-link" href="/register">Register</a>
                                </li>
                                
                            </ul>
                                
                            }
                        </div>
                    </div>
                </nav>

            </Fragment>

        )

    }

}