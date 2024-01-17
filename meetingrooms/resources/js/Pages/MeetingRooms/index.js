import React, {Component, Fragment} from 'react';

import Navigation2 from '../../components/layouts/navigation2';

import Authservice from '../../components/Authservice';

import {Card, CardHeader, CardBody, ModalHeader, ModalBody, ModalFooter, Modal, Button, Label, Input, FormGroup, Row, Col} from 'reactstrap';

import BootstrapTable from 'react-bootstrap-table-next';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPlus, faSave, faTrash, faEdit, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import Footer from '../../components/layouts/footer';

export default class MeetingRooms extends Component {

    constructor(props) {

        super(props);

        this.state = {

            user: {id: 0 },
            meetingrooms: []

        }

        this.getUser = this.getUser.bind(this);
        this.save = this.save.bind(this);
        this.getData = this.getData.bind(this);
        this.update = this.update.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.delete = this.delete.bind(this);
    }

    delete(id) {

        Authservice.post('/meetingrooms/delete', {id})
        .then(response => {

            if (response.meetingrooms) {

                this.setState({meetingrooms: response.meetingrooms});

            }

        })

    }

    updateStatus(data) {

        Authservice.post('/meetingrooms/update-status', {id: data.id})
        .then(response => {

            if (response.meetingrooms) {

                this.setState({meetingrooms: response.meetingrooms});

            }

        })        


    }

    update(data) {

        Authservice.post('/meetingrooms/update', data)
        .then(response => {

            if (response.meetingrooms) {

                this.setState({meetingrooms: response.meetingrooms});

            }

        })


    }

    save(data) {

        Authservice.post('/meetingrooms/save', data)
        .then(response => {

            if (response.meetingrooms) {

                this.setState({meetingrooms: response.meetingrooms});

            }

        })

    }

    getData() {

        Authservice.post('/meetingrooms/get', false)
        .then(response => {

            if (response.meetingrooms) {

                this.setState({meetingrooms: response.meetingrooms});

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

        const columns = [
                    {
                        dataField: 'name',
                        text: 'Name'
                    },
                    {
                        dataField: 'amount_2',
                        text: '2 Hrs'
                    },
                    {
                        dataField: 'amount_4',
                        text: '4 Hrs'
                    },

                    {
                        dataField: 'amount_6',
                        text: '6 Hrs'
                    },

                    {
                        dataField: 'amount_8',
                        text: '8 Hrs'
                    },
                    {
                        dataField: '_status',
                        text: 'Status'
                    },
                    {
                        dataField: 'actions',
                        text: 'Actions'
                    }
                ];

        const data = this.state.meetingrooms.map( m => {

            m._status = m.status === 1  ? <span className="text-success">Active <FontAwesomeIcon style={ { cursor: 'pointer' } } onClick={ () => this.updateStatus( m ) } icon={faCheckCircle} data-tip="Deactivate this meeting room" /></span> : <span className="text-danger">Inactive <FontAwesomeIcon data-tip="Activate this meeting room" style={ { cursor: 'pointer'} } onClick={ () => this.updateStatus(m) } icon={faCheckCircle} /></span>

            m.actions = <Fragment>
                            <Edit
                                room={m}
                                save={this.update} 
                            />
                            <Button 
                                color="danger"
                                onClick={() => this.delete(m.id)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </Button>
                        </Fragment>

            return m;

        })

        return (

            <Fragment>

                <Navigation2 
                    user={user}
                    meeting_rooms={ this.state.meetingrooms }
                />

                <div className="container">
                    <div className="row justify-content-center mr-0 ml-0">
                        <div className="col-md-12 pt-4">

                            <Add
                                save={this.save} 
                            />

                            <Card>
                                <CardHeader>
                                    Meeting Rooms
                                </CardHeader>
                                <CardBody>
                                    <BootstrapTable 
                                        keyField='id' 
                                        data={ data } 
                                        columns={ columns } 
                                    />
                                </CardBody>
                            </Card>

                            <Footer />
                        
                        </div>
                    </div>
                </div>

            </Fragment>

        )

    }

}

class Add extends Component {

    constructor(props) {

        super(props);

        this.state = {

            open: false,
            name: '',
            amount_1: 0,
            amount_2: 0,
            amount_4: 0,
            amount_8: 0,
            amount_6: 0,
            description: '',
            status: 1,
            errorName: false,
            errorAmount1: false,
            errorAmount2: false,
            errorAmount4: false,
            errorAmount6: false,
            errorAmount8: false
            
        }

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.change = this.change.bind(this);
        this.save = this.save.bind(this);

    }

    save() {

        let valid = true;
        let errorName = false;
        let errorAmount1 = false;
        let errorAmount2 = false;
        let errorAmount4 = false;
        let errorAmount6 = false;
        let errorAmount8 = false;

        const {name, amount_1, amount_2, amount_4, amount_8, amount_6, status, description} = this.state;

        if (name === '') {

            valid = false;
            errorName = true;

        }

        if (amount_1 === 0) {

            valid = false;
            errorAmount1 = true;

        }

        if (amount_2 === 0) {

            valid = false;
            errorAmount2 = true;

        }

        if (amount_4 === 0) {

            valid = false;
            errorAmount4 = true;

        }

        if (amount_8 === 0) {

            valid = false;
            errorAmount8 = true;

        }

        if (amount_6 === 0) {

            valid = false;
            errorAmount6 = true;

        }

        if (valid) {

            const data = {name, amount_1, amount_2, amount_4, amount_6, amount_8, status, description}

            this.setState({
                name: '',
                amount_1: 0,
                amount_2: 0,
                amount_4: 0,
                amount_6: 0,
                amount_8: 0,
                status: 1,
                open: false
            }, () => {

                this.props.save(data);

            });

        } else {

            this.setState({
                errorName,
                errorAmount1,
                errorAmount2,
                errorAmount4,
                errorAmount6,
                errorAmount8
            })

        }

    }

    change(e) {

        this.setState({
            [e.target.name] : e.target.value,
            errorName: false,
            errorAmount1: false,
            errorAmount2: false,
            errorAmount4: false,
            errorAmount6: false,
            errorAmount8: false
        });

    }

    open() {

        this.setState({open:true});

    }

    close() {

        this.setState({open:false});

    }

    render() {

        return (

            <Fragment>
                <Row className="mb-2">
                    <Col className="text-right">
                        <Button onClick={this.open} color="primary"><FontAwesomeIcon icon={faPlus} /> Add</Button>
                
                    </Col>    
                </Row>
                
                <Modal isOpen={this.state.open} toggle={this.close}>
                    <ModalHeader>
                        Add Meeting Room
                    </ModalHeader>
                    <ModalBody className="p-3">
                        <FormGroup>
                            <Label>Name</Label>
                            <Input 
                                type="text" 
                                name="name"
                                className={`${this.state.errorName ? 'is-invalid' : ''}`}
                                value={this.state.name}
                                onChange={this.change}
                            />
                            { this.state.errorName ? 
                                <span className="d-block invalid-feedback" role="alert">
                                    <strong>this is required</strong>
                                </span>
                            : '' }
                        </FormGroup>

                        <FormGroup row>
                            

                            <Col md={6} className="p-3">
                                <Label>Amount For 2 Hrs</Label>
                                <Input 
                                    type="number" 
                                    name="amount_2"
                                    value={this.state.amount_2}
                                    onChange={this.change}
                                    className={`${this.state.errorAmount2 ? 'is-invalid' : ''}`}
                                />
                                { this.state.errorAmount2 ? 
                                <span className="d-block invalid-feedback" role="alert">
                                    <strong>this is required</strong>
                                </span>
                            : '' }
                            </Col>

                            <Col md={6} className="p-3 bg-white">
                                <Label>Amount For 4 Hrs</Label>
                                <Input 
                                    type="number" 
                                    name="amount_4"
                                    className={`${this.state.errorAmount4 ? 'is-invalid' : ''}`}
                                    value={this.state.amount_4}
                                    onChange={this.change}
                                />
                                { this.state.errorAmount4 ? 
                                <span className="d-block invalid-feedback" role="alert">
                                    <strong>this is required</strong>
                                </span>
                            : '' }
                            </Col>

                        </FormGroup>

                        <FormGroup row>
                            

                            <Col md={6} className="p-3 bg-white">
                                <Label>Amount For 6 Hrs</Label>
                                <Input 
                                    type="number" 
                                    name="amount_6"
                                    className={`${this.state.errorAmount6 ? 'is-invalid' : ''}`}
                                    value={this.state.amount_6}
                                    onChange={this.change}
                                />
                                { this.state.errorAmount6 ? 
                                <span className="d-block invalid-feedback" role="alert">
                                    <strong>this is required</strong>
                                </span>
                            : '' }
                            </Col>

                            <Col md={6} className="p-3 bg-white">
                                <Label>Amount For 8 Hrs</Label>
                                <Input 
                                    type="number" 
                                    name="amount_8"
                                    value={this.state.amount_8}
                                    onChange={this.change}
                                    className={`${this.state.errorAmount8 ? 'is-invalid' : ''}`}
                                />
                                { this.state.errorAmount8 ? 
                                <span className="d-block invalid-feedback" role="alert">
                                    <strong>this is required</strong>
                                </span>
                            : '' }
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Label>Description</Label>
                            <Input type="textarea" name="description" value={ this.state.description } onChange={ this.change } />
                        </FormGroup>

                        <FormGroup>
                            <Label>
                                <Input 
                                    type="checkbox"
                                    className="ml-0 mr-0 position-relative"
                                    checked={this.state.status === 1}
                                    onChange={ () => this.setState({
                                        status: this.state.status === 1 ? 0 : 1
                                    }) }
                                /> Status
                            </Label>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.save} color="success"><FontAwesomeIcon icon={faSave} /> Save</Button>
                    </ModalFooter>
                </Modal>
            </Fragment>

        )

    }

}

class Edit extends Component {

    constructor(props) {

        super(props);

        const room = props.room;

        const name = room.name;
        const amount_1 = room.amount_1;
        const amount_2 = room.amount_2;
        const amount_4 = room.amount_4;
        const amount_8 = room.amount_8;
        const amount_6 = room.amount_6;
        const description = room.description;
        const status = room.status;
        const id = room.id;

        this.state = {
            open: false,
            name: name,
            id,
            amount_1: amount_1,
            amount_2: amount_2,
            amount_4: amount_4,
            amount_8: amount_8,
            amount_6: amount_6,
            status: status,
            description: description,
            errorName: false,
            errorAmount1: false,
            errorAmount2: false,
            errorAmount4: false,
            errorAmount6: false,
            errorAmount8: false
        }

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.change = this.change.bind(this);
        this.save = this.save.bind(this);

    }

    save() {

        let valid = true;
        let errorName = false;
        let errorAmount1 = false;
        let errorAmount2 = false;
        let errorAmount4 = false;
        let errorAmount6 = false;
        let errorAmount8 = false;

        const {name, amount_1, amount_2, amount_4, amount_6, amount_8, status, id, description} = this.state;

        if (name === '') {

            valid = false;
            errorName = true;

        }

        if (amount_1 === 0) {

            valid = false;
            errorAmount1 = true;

        }

        if (amount_2 === 0) {

            valid = false;
            errorAmount2 = true;

        }

        if (amount_4 === 0) {

            valid = false;
            errorAmount4 = true;

        }

        if (amount_8 === 0) {

            valid = false;
            errorAmount8 = true;

        }

        if (amount_6 === 0) {

            valid = false;
            errorAmount6 = true;

        }

        if (valid) {

            const data = {name, amount_1, amount_2, amount_4, amount_8, amount_6, status, id, description}

            this.setState({
                open: false
            }, () => {

                this.props.save(data);

            });

        } else {

            this.setState({
                errorName,
                errorAmount1,
                errorAmount2,
                errorAmount4,
                errorAmount6,
                errorAmount8
            })

        }

    }

    change(e) {

        this.setState({
            [e.target.name] : e.target.value,
            errorName: false,
            errorAmount1: false,
            errorAmount2: false,
            errorAmount4: false,
            errorAmount6: false,
            errorAmount8: false
        });

    }

    open() {

        this.setState({open:true});

    }

    close() {

        this.setState({open:false});

    }

    render() {

        return (

            <Fragment>
                <Button onClick={this.open} className="mr-1" color="primary"><FontAwesomeIcon icon={faEdit} /></Button>
                <Modal isOpen={this.state.open} toggle={this.close}>
                    <ModalHeader>
                        Edit Meeting Room
                    </ModalHeader>
                    <ModalBody className="p-3">
                        <FormGroup>
                            <Label>Name</Label>
                            <Input 
                                type="text" 
                                name="name"
                                className={`${this.state.errorName ? 'is-invalid' : ''}`}
                                value={this.state.name}
                                onChange={this.change}
                            />
                            { this.state.errorName ? 
                                <span className="d-block invalid-feedback" role="alert">
                                    <strong>this is required</strong>
                                </span>
                            : '' }
                        </FormGroup>

                        <FormGroup row>
                            

                            <Col md={6} className="p-3 bg-white">
                                <Label>Amount For 2 Hrs</Label>
                                <Input 
                                    type="number" 
                                    name="amount_2"
                                    value={this.state.amount_2}
                                    onChange={this.change}
                                    className={`${this.state.errorAmount2 ? 'is-invalid' : ''}`}
                                />
                                { this.state.errorAmount2 ? 
                                <span className="d-block invalid-feedback" role="alert">
                                    <strong>this is required</strong>
                                </span>
                            : '' }
                            </Col>

                            <Col md={6} className="p-3 bg-white">
                                <Label>Amount For 4 Hrs</Label>
                                <Input 
                                    type="number" 
                                    name="amount_4"
                                    className={`${this.state.errorAmount4 ? 'is-invalid' : ''}`}
                                    value={this.state.amount_4}
                                    onChange={this.change}
                                />
                                { this.state.errorAmount4 ? 
                                <span className="d-block invalid-feedback" role="alert">
                                    <strong>this is required</strong>
                                </span>
                            : '' }
                            </Col>
                        </FormGroup>

                        <FormGroup row>

                            <Col md={6} className="p-3 bg-white">
                                <Label>Amount For 6 Hr</Label>
                                <Input 
                                    type="number" 
                                    name="amount_6"
                                    className={`${this.state.errorAmount6 ? 'is-invalid' : ''}`}
                                    value={this.state.amount_6}
                                    onChange={this.change}
                                />
                                { this.state.errorAmount6 ? 
                                <span className="d-block invalid-feedback" role="alert">
                                    <strong>this is required</strong>
                                </span>
                            : '' }
                            </Col>
                            

                            <Col md={6} className="p-3 bg-white">
                                <Label>Amount For 8 Hrs</Label>
                                <Input 
                                    type="number" 
                                    name="amount_8"
                                    value={this.state.amount_8}
                                    onChange={this.change}
                                    className={`${this.state.errorAmount8 ? 'is-invalid' : ''}`}
                                />
                                { this.state.errorAmount8 ? 
                                <span className="d-block invalid-feedback" role="alert">
                                    <strong>this is required</strong>
                                </span>
                            : '' }
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Label>Description</Label>
                            <Input type="textarea" name="description" value={ this.state.description } onChange={ this.change } />
                        </FormGroup>

                        <FormGroup>
                            <Label>
                                <Input 
                                    type="checkbox"
                                    className="ml-0 mr-0 position-relative"
                                    checked={this.state.status === 1}
                                    onChange={ () => this.setState({
                                        status: this.state.status === 1 ? 0 : 1
                                    }) }
                                /> Status
                            </Label>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.save} color="success"><FontAwesomeIcon icon={faSave} /> Save</Button>
                    </ModalFooter>
                </Modal>

            </Fragment>

        )

    }

}