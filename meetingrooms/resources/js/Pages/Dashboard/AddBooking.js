import React, { Component, Fragment } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, Row, Col, Label, Input, FormGroup, Button } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPlus, faSave, faTrash, faEdit, faCheckCircle, faTruckMedical } from '@fortawesome/free-solid-svg-icons';

import { formatter, format_datetime, format_date } from '../../components/Functions';

import DatePicker from 'react-datepicker';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';

import "react-datepicker/dist/react-datepicker.css";

import Select from 'react-select';


export default class AddBooking extends Component {

  constructor(props) {

    super(props);

    this.state = {

      meeting_room_id: 0,
      booking_date: '',
      from_time: '08:45',

      client_id: 0,
      client_name: '',
      
      meeting_room_name: '',
      
      to_time: '',
      duration: 0,
      total_amount: 0,
      description: '',
      errorClientName: false,
      errorMeetingRoom: false,
      errorBookingDate: false,
      errorFromTime: false,
      errorDuration: false,
      payment_type: 0,
      card_first_name: '',
      card_last_name: '',
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

    this.change = this.change.bind(this);
    this.save = this.save.bind(this);
    this.setPaymentType = this.setPaymentType.bind(this);
    this.selectClient = this.selectClient.bind(this);
    
    this.amount = this.amount.bind(this);
    this.booking = this.booking.bind(this);
    this.getTotalAmount = this.getTotalAmount.bind(this);

    this.selectTime = this.selectTime.bind(this);

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

                <Label className="text-white">From Time:</Label>

                <h4 className="text-white">{ from_time[0] }:{ from_time[1] }</h4>

            </Col>

            <Col md={3} className="border-right border-white text-white">

                <Label className="text-white">To Time:</Label>

                <h4 className="text-white">{ to_time }</h4>

            </Col>

            <Col md={3} className="border-right border-white text-white">

                <Label className="text-white">Duration:</Label>

                <h4 className="text-white">{ this.state.duration } Hr</h4>

            </Col>

            <Col md={3} className="text-white">

                <Label className="text-white">Amount:</Label>

                <h4 className="text-white">{ formatter.format(amount) }</h4>

            </Col>

        </Row>
    )

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

    if (payment_type === 1) {

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

  amount() {

    const room = this.props.meetingrooms.filter( r => { return r.id === parseInt(this.state.meeting_room_id) } );

    return (

        <Row className="bg bg-info p-2 mr-0 ml-0 mb-4">

            <Col md={3} className="border-right border-white text-white">

                <Label className="text-white">1 Hr:</Label>

                <h4 className="text-white">{ formatter.format(room[0].amount_1) }</h4>

            </Col>

            <Col md={3} className="border-right border-white text-white">

                <Label className="text-white">2 Hr:</Label>

                <h4 className="text-white">{ formatter.format(room[0].amount_2) }</h4>

            </Col>

            <Col md={3} className="border-right border-white text-white">

                <Label className="text-white">4 Hr:</Label>

                <h4 className="text-white">{ formatter.format(room[0].amount_4) }</h4>

            </Col>

            <Col md={3} className="text-white">

                <Label className="text-white">8 Hr:</Label>

                <h4 className="text-white">{ formatter.format(room[0].amount_8) }</h4>

            </Col>

        </Row>
    )
  }

  selectClient(client) {
        
    this.setState( {

        lookup: false,
        client_id: client.value,
        client_name: client.label,
        card_first_name: client.firstname,
        card_last_name: client.lastname

    } ) 
  }

  setPaymentType(payment_type) {

      this.setState({payment_type});

  }

  selectTime(date) {

    const hours = date.getHours();
    const mins = date.getMinutes();

    const from_time = `${hours < 10 ? '0' + hours : hours}:${mins < 10 ? '0' + mins : mins}`;

    this.setState({ from_time }, () => this.getTotalAmount());

  }

  getTotalAmount() {

    const { meeting_room_id, duration } = this.state;

    const from_time = this.state.from_time.split(':');

    let total_amount = 0;

    let hour = parseInt(from_time[0]);

    let to_time = '';

    let meeting_room_name = '';

    if (meeting_room_id > 0 && duration > 0) {

        const room = this.props.meetingrooms.filter(r => { return r.id === parseInt(meeting_room_id) });

        meeting_room_name = room[0].name;

        if (parseInt(duration) === 1) {
            
            total_amount = room[0].amount_1;
            hour += 1;

        } else if (parseInt(duration) === 2) {

            total_amount = room[0].amount_2;
            hour += 2

        } else if (parseInt(duration) === 4) {
            
            total_amount = room[0].amount_4;
            hour += 4

        } else if (parseInt(duration) === 8) {
            
            total_amount = room[0].amount_8;
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

    this.setState({ 
        total_amount, 
        to_time, 
        meeting_room_name 
    }) 

  }

  render() {

    const clients = this.props.clients.map( c => {

      return { 
              value: c.id, 
              label: `${c.firstname} ${c.lastname}`,
              firstname: c.firstname,
              lastname: c.lastname
             }

    })

    const date = `${this.props.year}-${this.props.month > 9 ? this.props.month : `0${this.props.month}`}-${this.props.day > 9 ? this.props.day : `0${this.props.day}`}`;

    let booking_date = new Date();

    let times = this.state.from_time.split(':');

    if (date) {

        const dates = date.split('-')

        booking_date = new Date(dates[0], parseInt(dates[1]) - 1, dates[2], times[0], times[1]);

    }

    const excludeTimes = [];

    const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 17, 18, 19, 20, 21, 22, 23];

    hours.map( h => {

        if ( h === 8) {

            excludeTimes.push(setHours(setMinutes(new Date, 0), h));
            excludeTimes.push(setHours(setMinutes(new Date, 15), h));
            excludeTimes.push(setHours(setMinutes(new Date, 30), h));

        } else {

            excludeTimes.push(setHours(setMinutes(new Date, 0), h));
            excludeTimes.push(setHours(setMinutes(new Date, 15), h));
            excludeTimes.push(setHours(setMinutes(new Date, 30), h));
            

        }

    });

    const includeTimes = [ 
            setHours(setMinutes(new Date(), 45), 8),
            setHours(setMinutes(new Date(), 45), 10),
            setHours(setMinutes(new Date(), 45), 12),
            setHours(setMinutes(new Date(), 45), 14),                
        ];

    return (

      <Modal isOpen={this.props.open} toggle={this.props.close} className="mw-100 w-75">
        <ModalHeader>
            Add Booking
        </ModalHeader>
        <ModalBody>
            <Row>
                <Col md={6}>
                    <FormGroup row>
                        

                            <Col>

                                <Label>Client Name</Label>
                                <Select 
                                    isClearable={ true }
                                    isSearchable={ true }
                                    onChange={ this.selectClient }
                                    placeholder=" - select client -"
                                    options={ clients }
                                />
                            </Col>
                    </FormGroup>

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
                            <Input 
                                type="date" 
                                name="booking_date"
                                value={ date }
                                onChange={this.change}
                                className={this.state.errorBookingDate ? 'is-invalid' : '' }
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
                            <DatePicker
                                selected={ booking_date }
                                onChange={this.selectTime}
                                className="form-control"
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                excludeTimes={excludeTimes}
                                includeTimes={includeTimes}
                                timeCaption="Time"
                                dateFormat="h:mm aa" 
                            />
                            {/* <Input 
                                type="time" 
                                name="from_time"
                                value={this.state.from_time}
                                onChange={this.change}
                                className={this.state.errorFromTime ? 'is-invalid' : '' }
                    />*/}
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

                    <FormGroup>
                        <Label>
                            Description
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

                    <FormGroup>
                        <Label>Payment Type</Label>
                    </FormGroup>

                    <FormGroup check inline>
                        <Label className="mr-4">
                            <Input checked={this.state.payment_type === 1} onClick={() => this.setPaymentType(1) } type="radio" /> Online
                        </Label>

                        <Label className="mr-2">
                            <Input checked={this.state.payment_type === 0} onClick={() => this.setPaymentType(0) } type="radio" /> Offline
                        </Label>

                        <Label>
                            <Input checked={this.state.payment_type === 2} onClick={() => this.setPaymentType(2) } type="radio" /> Free of Charge
                        </Label>
                    </FormGroup>

                    {
                        this.state.payment_type === 1 ?

                        <Fragment>

                            <div>(When you select "Online" it will direct you to Sage Pay to make your payment)</div>

                            <FormGroup>

                                <Label>Card Details:</Label>

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



                        </Fragment>

                        : '' 
                    }

                    { this.state.payment_type === 0 ?

                        <Fragment>

                            <FormGroup>

                                <Label>Offline Notes</Label>

                                <Input 
                                    value={this.state.offline_notes} 
                                    onChange={this.change} 
                                    type="textarea" 
                                    name="offline_notes" 
                                    placeholder="Offline Notes" 
                                />                                         

                            </FormGroup>

                        </Fragment>

                    : '' }
                </Col>
            </Row>
        </ModalBody>
        <ModalFooter>
            <Button onClick={this.save} color="success"><FontAwesomeIcon icon={faSave} /> Save</Button>
        </ModalFooter>
    </Modal>

    )

  }



}