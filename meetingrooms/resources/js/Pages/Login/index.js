import React, {Component, Fragment} from 'react';
import Authservice from '../../components/Authservice';

import Navigation from '../../components/layouts/navigation';
export default class Login extends Component {

    constructor(props) {

        super(props);

        this.state = {

            email: '',
            password: '',
            errorEmail: false,
            errorPassword: false,
            errorLogin: false

        }

        this.change = this.change.bind(this);
        this.login = this.login.bind(this);

    }

    login() {

        let valid = true;
        let errorEmail = false;
        let errorPassword = false;

        const {email, password} = this.state;

        if (email === '') {

            valid = false;
            errorEmail = true;

        }

        if (password === '') {

            valid = false;
            errorPassword = true;

        }

        if (valid) {

            const data = {email, password}

            Authservice.doLogin(data)
            .then(response => {

                if (response.success === 1) {

                    location = response.redirect;

                } else {

                    this.setState({ errorLogin: true });

                }

            })

        } else {

            this.setState({errorEmail, errorPassword})

        }

    }

    change(e) {

        this.setState({
            [e.target.name] : e.target.value, 
            errorEmail: false, 
            errorPassword: false,
            errorLogin: false
        });

    }

    render() {

        const founds = this.state.lookup ? <Found clients={ this.state.founds } select={this.selectClient} /> : '';


        return (

            <Fragment>

                    <Navigation user={false} />
                
                    <div className="row justify-content-center mr-0 ml-0">
                        <div className="col-md-6 pt-4">

                            { this.state.errorLogin ?

                            <div className="pt-4 pb-4 text-center text-danger">
                                Invalid login
                            </div>

                            : '' }

                            <div className="form-group row">
                                <label className="col-md-4 col-form-label text-md-right">
                                    Email Address
                                </label>

                            <div className="col-md-6">
                                <input 
                                    id="email" 
                                    type="email" 
                                    className={`form-control ${this.state.errorEmail ? 'is-invalid' : ''}`} 
                                    name="email" 
                                    value={this.state.email} 
                                    required={true} 
                                    autoComplete="email" 
                                    autoFocus={true} 
                                    onChange={this.change}
                                />

                                { this.state.errorEmail ?
                                    <span className="invalid-feedback" role="alert">
                                        <strong>please enter email address</strong>
                                    </span>
                                : '' }
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-md-4 col-form-label text-md-right">
                                Password
                            </label>

                            <div className="col-md-6">
                                <input 
                                    id="password" 
                                    type="password" 
                                    className={`form-control ${this.state.errorPassword ? 'is-invalid' : ''}`} 
                                    name="password" 
                                    required={true} 
                                    autoComplete="current-password"
                                    onChange={this.change}
                                />

                                { this.state.errorPassword ?
                                    <span className="invalid-feedback" role="alert">
                                        <strong>please enter the password</strong>
                                    </span>
                                : '' }
                            </div>
                        </div>                        

                        <div className="form-group row mb-0">
                            <div className="col-md-8 offset-md-4">
                                <button type="button" onClick={this.login} className="btn btn-primary">
                                    Login
                                </button>

                               
                                <a className="btn btn-link" href="">
                                    Forgot Your Password?
                                </a>
                               
                            </div>
                        </div>
                        
                        </div>
                    </div>
             

            </Fragment>

        )

    }

}