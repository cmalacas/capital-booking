import React, {Component, Fragment} from 'react';

import Authservice from '../Authservice';

import { formatter } from '../Functions';

import {DropdownToggle, Nav, Dropdown, DropdownMenu, DropdownItem, Row, Col} from 'reactstrap';
export default class Navigation extends Component {

    constructor(props) {

        super(props);

        this.state = {

            room_id: 0,

        }

        this.doLogout = this.doLogout.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);

    }

    close() {

        this.setState({ room_id: 0 });

    }

    open( room_id ) {

        this.setState({ room_id: room_id === this.state.room_id ? 0 : room_id });

    }

    doLogout() {

        Authservice.doLogout();

        location = '/login';

    }

    render() {

        const user = this.props.user;

        return (

            <Fragment>

                <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm">
                    <div className="container">
                        <a className="navbar-brand" href="/">
                            LOGO HERE
                        </a>
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

                                <Nav>
                                    {
                                        this.props.meeting_rooms.map( m => {

                                            return (

                                                <Dropdown isOpen={m.id === this.state.room_id} toggle={ () => this.open(m.id) }>
                                                    <DropdownToggle nav caret >
                                                        {m.name}
                                                    </DropdownToggle>
                                                    <DropdownMenu>
                                                        <DropdownItem>
                                                            <h2 className="text-center">{m.name}</h2>
                                                            <span className="d-block text-center">Price</span>
                                                            <Row className="mt-2 ml-2 m-r2">
                                                                <Col>
                                                                    <Row className="mb-2">
                                                                        <Col className="text-center">
                                                                            {formatter.format(m.amount_2)} for 2 hours
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col className="text-center">
                                                                            {formatter.format(m.amount_4)} for 4 hours
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                                <Col>
                                                                    <Row className="mb-2">
                                                                        <Col className="text-center">
                                                                            {formatter.format(m.amount_6)} for 6 hours
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col className="text-center">
                                                                            {formatter.format(m.amount_8)} for 8 hours
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col className="m-2 text-center">
                                                                    {m.description}
                                                                </Col>
                                                            </Row>
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>

                                            )

                                        })
                                    }
                                </Nav>

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