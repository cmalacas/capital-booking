import React, {Component, Fragment} from 'react';
import Navigation from '../../components/layouts/navigation';


export default class Register extends Component {

    constructor(props) {

        super(props);

        this.state = {

            firstname: '',
            lastname: '',
            password: '',
            email: '',
            confirmPassword: '',
            errorFirstname: false,
            errorLastname: false,
            errorEmail: false,
            errorPassword: false,
            errorConfirmPassword: false

        }

        this.change = this.change.bind(this);
        this.submit = this.submit.bind(this);

    }

    change(e) {

        this.setState({[e.target.name]: e.target.value, 
                errorFirstname: false,
                errorLastname: false, 
                errorEmail: false,
                errorPassword: false
            })

    }

    submit() {

        let valid = true;
        let errorFirstname = false;
        let errorLastname = false;
        let errorEmail = false;
        let errorPassword = false;

        const {firstname, lastname, email, password, confirmPassword} = this.state;

        if (firstname == '') {

            valid = false;
            errorFirstname = true;

        }

        if (lastname == '') {

            valid = false;
            errorLastname = true;

        }

        if (email == '' || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {

            valid = false;
            errorEmail = true;

        } 

        if (password == '' || confirmPassword == '' || (password != confirmPassword) ) {

            valid = false;
            errorPassword = true;

        }

        if (valid) {

            


        } else {

            this.setState({errorFirstname, errorLastname, errorEmail, errorPassword});

        }

    }

    render() {

        return (

            <Fragment>

                <Navigation />

                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card mt-4">
                            <div className="card-header">Register</div>

                            <div className="card-body">
                                
                                    <div className="form-group row">
                                        <label className="col-md-4 col-form-label text-md-right">First Name</label>

                                        <div className="col-md-6">
                                            <input 
                                                id="name" 
                                                type="text" 
                                                className={`form-control ${this.state.errorFirstname ? 'is-invalid' : ''}`} 
                                                name="firstname" 
                                                value={this.state.firstname} 
                                                required={true} 
                                                autoComplete="name" 
                                                autoFocus={true} 
                                                onChange={this.change} 
                                            />

                                            { this.state.errorFirstname ? 
                                                <span className="invalid-feedback" role="alert">
                                                    <strong>Please enter your first name</strong>
                                                </span>
                                            : '' }
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-md-4 col-form-label text-md-right">Last Name</label>

                                        <div className="col-md-6">
                                            <input 
                                                id="lastname" 
                                                type="text" 
                                                className={`form-control ${this.state.errorLastname ? 'is-invalid' : ''}`} 
                                                name="lastname" 
                                                value={this.state.lastname} 
                                                required={true} 
                                                autoComplete="name" 
                                                onChange={this.change} 
                                            />

                                            { this.state.errorLastname ? 
                                                <span className="invalid-feedback" role="alert">
                                                    <strong>Please enter your last name</strong>
                                                </span>
                                            : '' }
                                        </div>
                                    </div>


                                    <div className="form-group row">
                                        <label className="col-md-4 col-form-label text-md-right">E-mail Address</label>

                                        <div className="col-md-6">
                                            <input 
                                                id="email" 
                                                type="email" 
                                                className={`form-control ${this.state.errorEmail ? 'is-invalid' : '' }`} 
                                                name="email" 
                                                value={this.state.email} 
                                                required={true} 
                                                autoComplete="email" 
                                                onChange={this.change}
                                            />

                                            { this.state.errorEmail ? 
                                                <span className="invalid-feedback" role="alert">
                                                    <strong>Please enter valid email address</strong>
                                                </span>
                                            : '' }
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-md-4 col-form-label text-md-right">Password</label>

                                        <div className="col-md-6">
                                            <input 
                                                id="password" 
                                                type="password" 
                                                className={`form-control ${this.state.errorPassword ? 'is-invalid' : ''}`} 
                                                name="password" 
                                                required={true} 
                                                autoComplete="new-password" 
                                                onChange={this.change}
                                            />

                                            { this.state.errorPassword ?
                                                <span className="invalid-feedback" role="alert">
                                                    <strong>Please enter your password</strong>
                                                </span>
                                            : ''  }
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-md-4 col-form-label text-md-right">Confirm Password</label>

                                        <div className="col-md-6">
                                            <input 
                                                id="password-confirm" 
                                                type="password" 
                                                className="form-control" 
                                                name="confirmPassword" 
                                                required={true} 
                                                autoComplete="new-password" 
                                                onChange={this.change}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group row mb-0">
                                        <div className="col-md-6 offset-md-4">
                                            <button onClick={this.submit} type="button" className="btn btn-primary">
                                                Register
                                            </button>
                                        </div>
                                    </div>
                                
                            </div>
                        </div>
                    </div>
                </div>

            </Fragment>

        )

    }

}