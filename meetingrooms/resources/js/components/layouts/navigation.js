import React, {Component, Fragment} from 'react';

export default class Navigation extends Component {

    constructor(props) {

        super(props);

    }

    render() {

        return (

            <Fragment>

                <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm">
                    <div className="container">
                        <a className="navbar-brand" href="/">
                            Capital Office Meeting Rooms
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
                            <ul className="navbar-nav mr-auto">
                                
                            </ul>

                            <ul className="navbar-nav ml-auto">
                                
                            </ul>
                        </div>
                    </div>
                </nav>

            </Fragment>

        )

    }

}