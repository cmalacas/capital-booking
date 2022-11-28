import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Dashboard from '../Pages/Dashboard';
import Register from '../Pages/Login/Register';
import Login from '../Pages/Login';

export default class App extends Component {

    constructor(props) {

        super(props);

    }


    render() {

        return (

            <Router>
                <Routes>
                        <Route path="/" exact element={<Dashboard />} />
                        <Route path="/register" exact element={<Register />} />
                        <Route path="/login" exact element={<Login />} />
                </Routes>
            </Router>
        )

    }

}