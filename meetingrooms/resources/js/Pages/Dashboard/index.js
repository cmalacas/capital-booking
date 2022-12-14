import React, {Component, Fragment} from 'react';

import Navigation from '../../components/layouts/navigation';

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import Authservice from '../../components/Authservice';

const localizer = momentLocalizer(moment);

import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label, Table } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPlus, faSave, faTrash, faEdit, faCheckCircle, faTruckMedical } from '@fortawesome/free-solid-svg-icons';

import { formatter, format_date } from '../../components/Functions';

import DatePicker from 'react-datepicker';

import "react-datepicker/dist/react-datepicker.css";
export default class Dashboard extends Component {

    constructor(props) {

        super(props);

        this.state = {

            user: {id: 0 },
            bookings: [],
            meetingrooms: []

        }

        this.getUser = this.getUser.bind(this);
        this.getData = this.getData.bind(this);
        this.save = this.save.bind(this);

    }

    save(data) {

        Authservice.post('/dashboard/save', data)
        .then( response => {

            console.log('response', response);

            if (response.url) {

                location = response.url;

            }

        })

    }

    getData() {

        Authservice.post('/bookings/get', false)
        .then( response => {

            if (response.bookings) {

                this.setState({
                    bookings: response.bookings,
                    meetingrooms: response.meetingrooms
                });

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

                            { user.type === 0 ?

                                <Row className="mb-2">
                                    <Col className="text-right">
                                        <Add 
                                            user={user}
                                            save={this.save}
                                            meetingrooms={this.state.meetingrooms}
                                        />
                                    </Col>
                                </Row>

                            : '' }

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

class Add extends Component {

    constructor(props) {

        super(props);

        const user = props.user;

        this.state = {

            open: false,
            client_id: user.id,
            client_name: `${user.firstname} ${user.lastname}`,
            meeting_room_id: 0,
            meeting_room_name: '',
            booking_date: '',
            from_time : '09:00',
            to_time: '11:00',
            duration: 2,
            total_amount: 0,
            vat_amount: 0,
            vat: 20,
            amount: 0,
            description: '',
            errorClientName: false,
            errorMeetingRoom: false,
            errorBookingDate: false,
            errorFromTime: false,
            errorDuration: false,
            payment_type: 0,
            card_first_name: user.firstname,
            card_last_name: user.lastname,
            card_city: '',
            card_postcode: '',
            card_address: '',
            card_country: 'uk',
            offline_notes: '',
            lookup: false,
            founds: [],
            errorCardFirstName: false,
            errorCardLastName: false,
            errorCardCity: false,
            errorCardPostCode: false,
            errorCardAddress: false,
            errorCardCountry: false
            
        }

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.change = this.change.bind(this);
        this.save = this.save.bind(this);
        this.setPaymentType = this.setPaymentType.bind(this);
        this.selectClient = this.selectClient.bind(this);
        this.search = this.search.bind(this);
        this.amount = this.amount.bind(this);
        this.booking = this.booking.bind(this);
        this.getTotalAmount = this.getTotalAmount.bind(this);

        this.selectDate = this.selectDate.bind(this);
        this.selectTime = this.selectTime.bind(this);
    }

    selectTime(date) {

        const hours = date.getHours();
        const mins = date.getMinutes();

        const from_time = `${hours < 10 ? '0' + hours : hours}:${mins < 10 ? '0' + mins : mins}`;

        this.setState({ from_time}, () => this.getTotalAmount());

    }

    selectDate(date) {

        const day = date.getDate();
        const mon = date.getMonth() + 1;
        const year = date.getFullYear();
        
        const booking_date = `${year}-${mon}-${day}`;

        this.setState({booking_date}, () => {
            this.getTotalAmount();
        });

    }

    getTotalAmount() {

        const { meeting_room_id, duration } = this.state;

        const from_time = this.state.from_time.split(':');

        let total_amount = 0;

        let amount = 0;

        let hour = parseInt(from_time[0]);

        let to_time = '';

        let meeting_room_name = '';

        if (meeting_room_id > 0 && duration > 0) {

            const room = this.props.meetingrooms.filter(r => { return r.id === parseInt(meeting_room_id) });

            meeting_room_name = room[0].name;

            if (parseInt(duration) === 1) {
                
                amount = room[0].amount_1;
                hour += 1;

            } else if (parseInt(duration) === 2) {

                amount = room[0].amount_2;
                hour += 2

            } else if (parseInt(duration) === 4) {
                
                amount = room[0].amount_4;
                hour += 4

            } else if (parseInt(duration) === 8) {
                
                amount = room[0].amount_8;
                hour += 8

            }

            if ( hour <= 9)  {

                to_time = `0${hour}:${from_time[1]}`;
            
            } else if (hour > 24) {
    
                to_time = `0${hour - 24}:${from_time[1]}`;
    
            } else {
    
                to_time = `${hour}:${from_time[1]}`;
    
            }

        }

        const vat_amount = this.state.vat * amount / 100;

        total_amount = amount + vat_amount;

        this.setState({ 
            total_amount, 
            vat_amount,
            amount,
            to_time, 
            meeting_room_name 
        })

    }

    booking() {

        const room = this.props.meetingrooms.filter( r => { return r.id === parseInt(this.state.meeting_room_id) } );

        const from_time = this.state.from_time.split(':');

        let to_time = '';

        let amount = 0;

        let hour = parseInt(from_time[0]);

        if (parseInt(this.state.duration) === 1) {

            amount = room.length > 0 ? room[0].amount_1 : 0;

            hour += 1;

        }

        if (parseInt(this.state.duration) === 2) {

            amount = room.length > 0  ? room[0].amount_2 : 0;

            hour += 2;

        }

        if (parseInt(this.state.duration) === 4) {

            amount = room.length > 0  ? room[0].amount_4 : 0;

            hour += 4;

        }

        if (parseInt(this.state.duration) === 8) {

            amount = room.length > 0  ? room[0].amount_8 : 0;

            hour += 8;

        }

        if ( hour <= 9)  {

            to_time = `0${hour}:${from_time[1]}`;
        
        } else if (hour > 24) {

            to_time = `0${hour - 24}:${from_time[1]}`;

        } else {

            to_time = `${hour}:${from_time[1]}`;

        }

        //this.setState( { total_amount: amount, to_time: to_time } )

        return (

            <Row className="bg bg-info p-2 mr-0 ml-0 mb-4">

                <Col md={3} className="border-right border-white text-white">

                    <Label>From Time:</Label>

                    <h4 className="text-white">{ from_time[0] }:{ from_time[1] }</h4>

                </Col>

                <Col md={3} className="border-right border-white text-white">

                    <Label>To Time:</Label>

                    <h4 className="text-white">{ to_time }</h4>

                </Col>

                <Col md={3} className="border-right border-white text-white">

                    <Label>Duration:</Label>

                    <h4 className="text-white">{ this.state.duration } Hr</h4>

                </Col>

                <Col md={3} className="text-white">

                    <Label>Amount:</Label>

                    <h4 className="text-white">{ formatter.format(amount) }</h4>

                </Col>

            </Row>
        )

    }

    amount() {

        const room = this.props.meetingrooms.filter( r => { return r.id === parseInt(this.state.meeting_room_id) } );

        return (

            <Row className="bg bg-info p-2 mr-0 ml-0 mb-4">

                <Col md={3} className="border-right border-white text-white">

                    <Label>1 Hr:</Label>

                    <h4 className="text-white">{ formatter.format(room[0].amount_1) }</h4>

                </Col>

                <Col md={3} className="border-right border-white text-white">

                    <Label>2 Hr:</Label>

                    <h4 className="text-white">{ formatter.format(room[0].amount_2) }</h4>

                </Col>

                <Col md={3} className="border-right border-white text-white">

                    <Label>4 Hr:</Label>

                    <h4 className="text-white">{ formatter.format(room[0].amount_4) }</h4>

                </Col>
  
                <Col md={3} className="text-white">

                    <Label>8 Hr:</Label>

                    <h4 className="text-white">{ formatter.format(room[0].amount_8) }</h4>

                </Col>

            </Row>
        )
    }

    search(e) {

        const value = e.target.value;




        this.setState( { search_client: value, lookup: true } , () => {

            if (value.length > 1) {
                Authservice.post( '/clients/lookup',  { client: value })
                .then( response => {
                    if (response.clients) {
                        this.setState( { founds: response.clients, lookup: true } )
                    }
                });
            }
        });
    }

    selectClient(client) {
        this.setState( {

            lookup: false,
            client_id: client.id,
            client_name: `${client.firstname} ${client.lastname}`,
            card_first_name: client.firstname,
            card_last_name: client.lastname

        } )
    }

    setPaymentType(payment_type) {

        this.setState({payment_type});

    }

    save() {

        let valid = true;      
        let errorClientName = false;
        let errorMeetingRoom = false;
        let errorBookingDate = false;
        let errorFromTime = false;
        let errorDuration = false;
        let errorCardFirstName = false;
        let errorCardLastName = false;
        let errorCardCity = false;
        let errorCardPostCode = false;
        let errorCardAddress = false;
        let errorCardCountry = false;
        
        const {
                    client_id, 
                    client_name, 
                    meeting_room_id,
                    booking_date, 
                    from_time, 
                    duration, 
                    card_first_name, 
                    card_last_name, 
                    card_city, 
                    card_postcode, 
                    card_country,
                    card_address,
                    payment_type,
                    to_time,
                    total_amount,
                    meeting_room_name,
                    offline_notes
                } = this.state;

        if (client_id === 0 || client_name === '') {

            valid = false;
            errorClientName = true;

        }

        if (meeting_room_id === 0) {

            valid = false;
            errorMeetingRoom = true;

        }

        if (booking_date === '') {

            valid = false;
            errorBookingDate = true;

        }

        if (from_time === '') {

            valid = false;
            errorFromTime = true;

        }

        if (parseInt(duration) === 0) {

            valid = false;
            errorDuration = true;

        }

        

        if (card_first_name === '') {

            valid = false;
            errorCardFirstName = true;

        }

        if (card_last_name === '') {

            valid = false;
            errorCardLastName = true;

        }

        if (card_city === '') {

            valid = false;
            errorCardCity = true;

        }

        if (card_postcode === '') {

            valid = false;
            errorCardPostCode = true;

        }

        if (card_address === '') {

            valid = false;
            errorCardAddress = true;

        }
       

        if (valid) {

            const data = {
                            client_id, 
                            client_name, 
                            meeting_room_id,
                            booking_date, 
                            from_time, 
                            duration, 
                            card_first_name, 
                            card_last_name, 
                            card_city, 
                            card_postcode, 
                            card_country,
                            card_address,
                            payment_type,
                            to_time,
                            total_amount,
                            meeting_room_name,
                            offline_notes
                        }

            this.setState({
                open: false
            }, () => {

                this.props.save(data);                

            });

        } else {

            this.setState({
                errorClientName,
                errorMeetingRoom,
                errorBookingDate,
                errorFromTime,
                errorDuration,
                errorCardFirstName,
                errorCardLastName,
                errorCardCity,
                errorCardPostCode,
                errorCardAddress,
                errorCardCountry
            })

        }

    }

    change(e) {

        this.setState({
            [e.target.name] : e.target.value,
            errorClientName: false,
            errorMeetingRoom: false,
            errorBookingDate: false,
            errorFromTime: false,
            errorDuration: false,
            errorCardFirstName: false,
            errorCardLastName: false,
            errorCardCity: false,
            errorCardPostCode: false,
            errorCardAddress: false,
            errorCardCountry: false
        }, 
            () => { this.getTotalAmount() }
        );

    }

    open() {

        this.setState({open:true});

    }

    close() {

        this.setState({open:false});

    }

    render() {

        let booking_date = new Date();

        let times = this.state.from_time.split(':');

        if (this.state.booking_date) {

            const dates = this.state.booking_date.split('-')

            booking_date = new Date(dates[0], parseInt(dates[1]) - 1, dates[2], times[0], times[1]);

        }

        return (

            <Fragment>
                <Button onClick={this.open} color="primary">Book A Meeting</Button>
                <Modal isOpen={this.state.open} toggle={this.close} className="mw-100 w-75">
                    <ModalHeader>
                        Book A Meeting
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md={6}>                               

                                <FormGroup row>
                                    <Col md={6}>
                                        <Label>Meeting Room</Label>
                                        <Input 
                                            type="select" 
                                            name="meeting_room_id"
                                            value={this.state.meeting_room_id}
                                            onChange={this.change}
                                            className={`${this.state.errorMeetingRoom ? 'is-invalid' : ''} form-control`}
                                        >
                                            <option value="0">Select meeting room</option>
                                            {
                                                this.props.meetingrooms.map( m => {

                                                    return <option key={m.id} value={m.id}>{m.name}</option>

                                                })
                                            }
                                        </Input>
                                        { this.state.errorMeetingRoom ?
                                            <span className="d-block invalid-feedback" role="alert">
                                                <strong>this is required</strong>
                                            </span>
                                        : '' }
                                    </Col>

                                    <Col md={6}>
                                        <Label>Booking Date</Label>
                                        {/* <Input 
                                            type="date" 
                                            name="booking_date"
                                            value={this.state.booking_date}
                                            onChange={this.change}
                                            className={this.state.errorBookingDate ? 'is-invalid' : '' }
                                        /> */}
                                        
                                        <DatePicker 
                                            selected={booking_date}
                                            className="form-control"
                                            onSelect={this.selectDate}
                                            minDate={ new Date }
                                        />
                                        { this.state.errorBookingDate ?
                                            <span className="d-block invalid-feedback" role="alert">
                                                <strong>this is required</strong>
                                            </span>
                                        : '' }
                                    </Col>
                                </FormGroup> 

                                { this.state.meeting_room_id > 0  ?

                                    this.amount() 

                                : ''  }


                                <FormGroup row>
                                    <Col md={6}>
                                        <Label>From Time</Label>
                                        {/* <Input 
                                            type="time" 
                                            name="from_time"
                                            value={this.state.from_time}
                                            onChange={this.change}
                                            className={this.state.errorFromTime ? 'is-invalid' : '' }
                                        /> */}
                                        <DatePicker
                                            selected={booking_date}
                                            onChange={this.selectTime}
                                            className="form-control"
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            excludeTimes={[
                                                setHours(setMinutes(new Date(), 0), 0),
                                                setHours(setMinutes(new Date(), 15), 0),
                                            ]}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa" 
                                        />
                                        { this.state.errorFromTime ?
                                            <span className="d-block invalid-feedback" role="alert">
                                                <strong>this is required</strong>
                                            </span>
                                        : '' }
                                    </Col>

                                    <Col md={6}>
                                        <Label>Duration</Label>
                                        <Input 
                                            type="select" 
                                            name="duration"
                                            className={`${this.state.errorDuration ? 'is-invalid' : ''} form-control`}
                                            value={this.state.duration}
                                            onChange={this.change}
                                        >
                                            <option key="0hr" value="0">Select duration</option>
                                            <option key="1hr" value="1">1 Hr</option>
                                            <option key="2hr" value="2">2 Hrs</option>
                                            <option key="4hr" value="4">4 Hrs</option>
                                            <option key="8hr" value="8">8 Hrs</option>
                                        </Input>
                                        { this.state.errorDuration ?
                                            <span className="d-block invalid-feedback" role="alert">
                                                <strong>this is required</strong>
                                            </span>
                                        : '' }
                                    </Col>
                                </FormGroup>

                                { this.state.from_time.length > 0 && this.state.duration > 0 ? this.booking() : '' }


                                <FormGroup row>

                                    <Col>
                                        <Input type="select" className="form-control" onChange={this.change} name="company">
                                            <option value="">Select company</option>
                                            <option value="CO">Capital Office</option>
                                            <option value="YCF">Your Company Formation</option>
                                        </Input>
                                    </Col>

                                    <Col>
                                        <Input type="number" name="attendee" min="2" max="8" onChange={this.change} />
                                    </Col>

                                </FormGroup>

                               
                                <FormGroup>
                                    <Label>
                                        Additional Notes
                                    </Label>
                                    <Input
                                        type="textarea"
                                        name="description"
                                        value={this.state.description}
                                        placeholder="Description" 
                                        onChange={this.change}
                                    />
                                </FormGroup>
                            </Col>

                            <Col md={6}>

                                    <div className="border p-3">

                                        { this.state.meeting_room_id > 0 ?

                                        <Fragment>

                                            <h5>Transaction</h5>

                                            <Table className="mb-4">
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            Meeting Details
                                                        </th>
                                                        <th>
                                                            Amount
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            Room: { this.state.meeting_room_name}<br />
                                                            Date: { format_date(this.state.booking_date) }<br />
                                                            Hrs: { this.state.duration }<br />
                                                            Time: { this.state.from_time } - { this.state.to_time }
                                                        </td>
                                                        <td>
                                                            { formatter.format(this.state.amount) }
                                                        </td>
                                                    </tr>                                                    
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td>
                                                            VAT (20%)
                                                        </td>
                                                        <td>
                                                            { formatter.format(this.state.vat_amount) }
                                                        </td>
                                                    </tr>
                                                    <tr style={{ borderBottom: 'solid #dee2e6 2px' }}>
                                                        <td>Amount: </td>
                                                        <td>
                                                            { formatter.format(this.state.total_amount) }
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </Table>

                                        </Fragment>

                                        : '' }


                                        <FormGroup>

                                            <h5>Payment</h5>

                                        </FormGroup>

                                        <FormGroup row>

                                            <Col md={6}>

                                                <Label>First Name</Label>

                                                <Input 
                                                    value={this.state.card_first_name} 
                                                    onChange={this.change}  
                                                    type="text" 
                                                    name="card_first_name" 
                                                    className={this.state.errorCardFirstName ? 'is-invalid' : '' }
                                                />

                                                { this.state.errorCardFirstName ?
                                                    <span className="d-block invalid-feedback" role="alert">
                                                        <strong>this is required</strong>
                                                    </span>
                                                : '' }

                                            </Col>

                                            <Col md={6}>

                                                <Label>Last Name</Label>

                                                <Input 
                                                    value={this.state.card_last_name} 
                                                    onChange={this.change}  
                                                    type="text" 
                                                    name="card_last_name" 
                                                    className={this.state.errorCardLastName ? 'is-invalid' : '' }
                                                />

                                                { this.state.errorCardLastName ?
                                                    <span className="d-block invalid-feedback" role="alert">
                                                        <strong>this is required</strong>
                                                    </span>
                                                : '' }

                                            </Col>

                                        </FormGroup>

                                        <FormGroup row>

                                            <Col md={6}>

                                                <Label>City</Label>

                                                <Input 
                                                    value={this.state.card_city} 
                                                    onChange={this.change}  
                                                    type="text" 
                                                    name="card_city" 
                                                    className={this.state.errorCardCity ? 'is-invalid' : '' }
                                                />

                                                { this.state.errorCardCity ?
                                                    <span className="d-block invalid-feedback" role="alert">
                                                        <strong>this is required</strong>
                                                    </span>
                                                : '' }

                                            </Col>

                                            <Col md={6}>

                                                <Label>Postcode</Label>

                                                <Input 
                                                    value={this.state.card_postcode} 
                                                    onChange={this.change}  
                                                    type="text" 
                                                    name="card_postcode" 
                                                    className={this.state.errorCardPostCode ? 'is-invalid' : '' }
                                                />

                                                { this.state.errorCardPostCode ?
                                                    <span className="d-block invalid-feedback" role="alert">
                                                        <strong>this is required</strong>
                                                    </span>
                                                : '' }

                                            </Col>

                                        </FormGroup>

                                        <FormGroup row>

                                            <Col md={6}>

                                                <Label>Street and Number</Label>

                                                <Input 
                                                    value={this.state.card_address} 
                                                    onChange={this.change}  
                                                    type="text" 
                                                    name="card_address" 
                                                    className={this.state.errorCardAddress ? 'is-invalid' : '' }
                                                />

                                                { this.state.errorCardAddress ?
                                                    <span className="d-block invalid-feedback" role="alert">
                                                        <strong>this is required</strong>
                                                    </span>
                                                : '' }

                                            </Col>

                                            <Col md={6}>

                                                <Label>Country</Label>

                                                <Input 
                                                    value={this.state.card_country} 
                                                    onChange={this.change}  
                                                    type="select" 
                                                    name="card_country" 
                                                    className="form-control"
                                                >
                                                    <option key="uk" value="uk">United Kingdom</option>
                                                </Input>                                                

                                            </Col>

                                        </FormGroup>



                                    </div>

                                
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.save} color="success"><FontAwesomeIcon icon={faSave} /> Book</Button>
                    </ModalFooter>
                </Modal>
            </Fragment>

        )

    }

}