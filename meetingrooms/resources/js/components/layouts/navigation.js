import React, {Component, Fragment} from 'react';

import Authservice from '../Authservice';
export default class Navigation extends Component {

    constructor(props) {

        super(props);

        this.doLogout = this.doLogout.bind(this);

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
                            Meeting Rooms
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

                            <ul className="navbar-nav ml-auto">
                                <a id="navbarDropdown" className="nav-link dropdown-toggle" href="#" 
                                role="button" 
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    { user.firstname } { user.lastname }
                                </a>

                                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                    <a className="dropdown-item" 
                                       onClick={this.doLogout}>
                                        Logout
                                    </a>
                                </div>
                                
                            </ul>

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