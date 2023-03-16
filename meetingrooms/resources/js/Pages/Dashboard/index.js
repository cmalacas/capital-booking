import React, {Component, Fragment, useMemo} from 'react';

import Navigation from '../../components/layouts/navigation';

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

import Authservice from '../../components/Authservice';

const localizer = momentLocalizer(moment);

import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label, Table, ButtonGroup } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPlus, faSave, faTrash, faEdit, faCheckCircle, faTruckMedical } from '@fortawesome/free-solid-svg-icons';

import { formatter, format_date } from '../../components/Functions';

import DatePicker from 'react-datepicker';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';

import "react-datepicker/dist/react-datepicker.css";

export default class Dashboard extends Component {

    constructor(props) {

        super(props);

        this.state = {

            user: { id: 0 },
            bookings: [],
            meetingrooms: [],
            view: 'month',
            open: false,

            event: { client_name: '', meeting_room_name: '', _from_time: '', _to_time: '' },

        }

        this.getUser = this.getUser.bind(this);
        this.getData = this.getData.bind(this);
        this.save = this.save.bind(this);

        this.eventStyleGetter = this.eventStyleGetter.bind(this);
        this.CustomToolbar = this.CustomToolbar.bind(this);
        this.event = this.event.bind(this);
        this.eventSelect = this.eventSelect.bind(this);

        this.close = this.close.bind(this);

    }

    close() {

        this.setState({ open: false });

    }

    eventSelect( event ) {

        /* this.setState({
            open: true, 
            event: event.data
        }); */

    }

    event( event )  {

        const desc = event.event.desc;
        return <span>{ desc }</span>

    }

    CustomToolbar(toolbar) {

        const goToWeekView = () => {
            toolbar.onView('week');
            this.setState({ view: 'week' })
        }
            
        const goToMonthView = () => {
            toolbar.onView('month');
            this.setState({ view: 'month' })
        }   
    
        const goToBack = () => {

            if (this.state.view === 'month') {

                toolbar.date.setMonth(toolbar.date.getMonth() - 1);

            } else if (this.state.view === 'week') {

                toolbar.date.setDate(toolbar.date.getDate() - 7);

            }

            toolbar.onNavigate('prev');
        };
      
        const goToNext = () => {

            if (this.state.view === 'month') {

                toolbar.date.setMonth(toolbar.date.getMonth() + 1);

            } else if (this.state.view === 'week') {

                toolbar.date.setDate(toolbar.date.getDate() + 7);

            }


          toolbar.onNavigate('next');
        };
      
        const goToCurrent = () => {
          const now = new Date();
          toolbar.date.setMonth(now.getMonth());
          toolbar.date.setYear(now.getFullYear());
          toolbar.onNavigate('current');
        };
      
        const label = () => {
          const date = moment(toolbar.date);
          return (
            <span><b>{date.format('MMMM')}</b><span> {date.format('YYYY')}</span></span>
          );
        };
      
        return (
          <Row className="rbc-toolbar">
            <Col md={2}>
                <div className="rbc-btn-group btn-view">
                    <button className={`${this.state.view === 'month' ? "rbc-active" : ""}`} onClick={goToMonthView}>
                        <span className="label-filter-off">Month</span>
                    </button>
                    <button className={`${this.state.view === 'week' ? "rbc-active" : ""}`} onClick={goToWeekView}>
                        <span className="label-filter-off">Week</span>
                    </button>
                </div>
            </Col>
            <Col md={8}>
                <Row>
                    <Col className="text-center">
                        <button className="btn btn-today" onClick={goToCurrent}>Today</button>
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex justify-content-center">
                        <button className="btn back" onClick={goToBack}><img src="/images/back.svg" /></button>
                        <label className="label">{label()}</label>
                        <button className="btn next" onClick={goToNext}><img src="/images/next.svg" /></button>    
                    </Col>
                </Row>
            </Col>
            <Col md={2}>
                <Add 
                    user={ this.state.user }
                    meetingrooms={ this.state.meetingrooms }
                    save={ this.save }
                />
            </Col>
                
          </Row>
        );
      };

    eventStyleGetter(event, start, end, isSelected) {

        const data = event.data;

        let backgroundColor = '#a5a5a5';
        let color = '#2faaa9';

        /* if (data.company === 'CO') {

            backgroundColor = '#bce5ff'; 
            color = '#10a1ff';           

        } */

        const style = {
            backgroundColor,            
            color
        }

        return {
            style: style
        }

    }

    save(data) {

        Authservice.post('/dashboard/save', data)
        .then( response => {

            //console.log('response', response);

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

            //const title = <p><span className="client-name">{b.client_name}</span><span className="from-to">{froms[0]}:{froms[1]} - {tos[0]}:{tos[1]}</span></p>

            const title = `${b.client_name} ${froms[0]}:${froms[1]} - ${tos[0]}:${tos[1]}`;

            const desc = <Fragment>
                            <div className="event-normal">
                                <div className="client-name d-block">{b._from_time} - {b._to_time}</div>
                            </div>
                            <div className="event-selected">
                                <div className="client-name d-block">{b.client_name}</div>                            
                                <div className="meeting-room d-block">{b.meeting_room_name}</div>
                                <div className="from-to-time d-block">{b._from_time} - {b._to_time}</div>
                            </div>
                         </Fragment>

            return {

                'title' : title,
                'start' : start,
                'end': end,
                'allDay': false,
                'data': b,
                'desc' : desc

            }


        });

        const height = window.innerHeight - 200;

        /* const formats = useMemo(() => ({
            dateFormat: 'dd',
          
            dayFormat: (date, format, localizer) =>
              localizer.format(date, 'DDD', culture),
          
            dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
              localizer.format(start, { date: 'short' }, culture) + ' — ' +
              localizer.format(end, { date: 'short' }, culture)
          }), []) */

        return (

            <Fragment>

                <Navigation 
                    user={user}
                    meeting_rooms={this.state.meetingrooms}
                />

                <div className="container mw-100">
                    <div className="row justify-content-center mr-0 ml-0">
                        <div className="col-md-12 pt-4">
                           

                            <Calendar
                                localizer={localizer}
                                events={eventsList}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height }}
                                views={{ month: true, week: true }}
                                onSelectEvent={ this.eventSelect }
                                components={
                                    {
                                        toolbar: this.CustomToolbar,
                                        event: this.event
                                    }
                                }
                                eventPropGetter={(this.eventStyleGetter)}
                            />

                        </div>
                    </div>
                </div>

                <Modal isOpen={this.state.open} toggle={ this.close} className="single-event" style={{ width: '327px', borderRadius: '0' }}>

                    <ModalBody>
                        <Row>
                            <Col md={10} className="event-client-name">
                                { this.state.event.client_name }
                            </Col>
                            <Col md={2} className="icons">
                                <Button onClick={ this.close }><img src="/images/x.svg" /></Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="event-meeting-room">
                                { this.state.event.meeting_room_name }
                            </Col>
                        </Row>
                        <Row>
                            <Col className="event-time">
                                { this.state.event._from_time} - { this.state.event._to_time }
                            </Col>
                        </Row>
                    </ModalBody>

                </Modal>

            </Fragment>

        )

    }

}

class Add extends Component {

    constructor(props) {

        super(props);

        const user = props.user;

        const _date = new Date();

        this.state = {

            open: false,
            client_id: user.id,
            client_name: `${user.firstname} ${user.lastname}`,
            meeting_room_id: 0,
            meeting_room_name: '',
            booking_date: `${_date.getFullYear()}-${_date.getMonth() + 1}-${_date.getDate()}`,
            from_time : '08:45',
            to_time: '10:45',
            duration: 2,
            total_amount: 0,
            vat_amount: 0,
            company: '',
            attendee: 2,
            vat: 20,
            amount: 0,
            description: '',
            errorClientName: false,
            errorMeetingRoom: false,
            errorBookingDate: false,
            errorFromTime: false,
            errorDuration: false,
            payment_type: 0,
            your_company_name: '',
            your_account_email: '',
            card_first_name: user.firstname,
            card_last_name: user.lastname,
            card_city: '',
            card_postcode: '',
            card_address: '',
            card_country: 'uk',
            offline_notes: '',
            lookup: false,
            founds: [],
            valid: false,
            validated: false,
            errorCardFirstName: false,
            errorCardLastName: false,
            errorCardCity: false,
            errorCardPostCode: false,
            errorCardAddress: false,
            errorCardCountry: false,
            errorCompany: false,
            errorYourCompanyName: false,
            errorYOurAccountEmail: false,
            
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

    componentDidUpdate() {

        if ( this.props.user.id != this.state.client_id ) {

            const user = this.props.user;

            const client_id = user.id;

            const client_name = `${user.firstname} ${user.lastname}`;

            const card_first_name = user.firstname;

            const card_last_name = user.lastname;

            this.setState( { client_id, client_name, card_first_name, card_last_name });

        }

    }

    selectTime(date) {

        const hours = date.getHours();
        const mins = date.getMinutes();

        const from_time = `${hours < 10 ? '0' + hours : hours}:${mins < 10 ? '0' + mins : mins}`;

        this.setState({ from_time }, () => this.getTotalAmount());

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

        const { meeting_room_id, duration, booking_date, from_time } = this.state;

        const _from_time = from_time.split(':');

        let total_amount = 0;

        let amount = 0;

        let hour = parseInt(_from_time[0]);

        let to_time = '';

        let meeting_room_name = '';

        let valid = true;
        let validated = false;

        if (meeting_room_id > 0 && duration > 0) {

            const room = this.props.meetingrooms.filter(r => { return r.id === parseInt(meeting_room_id) });

            meeting_room_name = room[0].name;

            if (parseInt(duration) === 1) {
                
                amount = room[0].amount_1;
                hour += 1;

            } else if (parseInt(duration) === 2) {

                amount = room[0].amount_2;
                hour += 2

            } else if (parseInt(duration) === 6) {
                
                amount = room[0].amount_6;
                hour += 6

            } else if (parseInt(duration) === 4) {
                
                amount = room[0].amount_4;
                hour += 4

            } else if (parseInt(duration) === 8) {
                
                amount = room[0].amount_8;
                hour += 8

            }

            if ( hour <= 9)  {

                to_time = `0${hour}:${_from_time[1]}`;
            
            } else if (hour > 24) {
    
                to_time = `0${hour - 24}:${_from_time[1]}`;
    
            } else {
    
                to_time = `${hour}:${_from_time[1]}`;
    
            }

        }

        const vat_amount = this.state.vat * amount / 100;

        total_amount = amount + vat_amount;

        if (hour >= 17) {

            valid = false;
            validated = true;

        }

        this.setState({ 
            total_amount, 
            vat_amount,
            amount,
            to_time, 
            meeting_room_name,
            valid,
            validated
        }, () => {

            if (amount > 0) {

                Authservice.post('/dashboard/check-booking', {meeting_room_id, booking_date, from_time, to_time, duration})
                .then(response => {

                    if (response.bookings) {

                        const bookings = response.bookings;

                        this.setState({ valid: bookings.length === 0 ? true : false, validated: true });

                    }

                })

            }

        });

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
        let errorCompany = false;

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
                    offline_notes,
                    company,
                    attendee
                } = this.state;

        const toTime = to_time.split(':');

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

        if (parseInt(toTime[0]) >= 17) {

            valid = false;
            errorDuration = true;

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

        if (company === '') {

            valid = false;
            errorCompany = true;

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
                            offline_notes,
                            company,
                            attendee
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
                errorCardCountry,
                errorCompany
            })

        }

    }

    change(e) {

        const targetName = e.target.name;

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
            errorCardCountry: false,
            errorCompany: false
        }, 
            () => { 

                if (targetName === 'meeting_room_id' ||
                    targetName === 'duration') {
                
                    this.getTotalAmount() 

                }
            }
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
                excludeTimes.push(setHours(setMinutes(new Date, 45), h));

            }

        });

        const isWeekday = (date) => {
            const day = date.getDay();
            return day !== 0 && day !== 6;
        };
        
        return (

            <Fragment>
                <Button className="book-a-meeting-btn" onClick={this.open} color="primary">Book A Meeting</Button>
                <Modal isOpen={this.state.open} toggle={this.close} className="mw-100 w-75">
                    <ModalBody>
                        <Row>
                            <Col md={6}>

                                <h2>Book A Meeting</h2>

                                <Row>
                                    <Col><h4>Details</h4></Col>
                                    <Col className="text-right">
                                        <span className="info">info</span>
                                    </Col>
                                </Row>

                                <FormGroup row>
                                    <Col>
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
                                </FormGroup>

                                <FormGroup row>

                                    <Col md={8}>
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
                                            filterDate={ isWeekday }
                                            onSelect={this.selectDate}
                                            minDate={ new Date }
                                        />
                                        { this.state.errorBookingDate ?
                                            <span className="d-block invalid-feedback" role="alert">
                                                <strong>this is required</strong>
                                            </span>
                                        : '' }
                                    </Col>
                                    <Col md={4}>
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
                                            excludeTimes={excludeTimes}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa" 
                                        />
                                        { this.state.errorFromTime ?
                                            <span className="d-block invalid-feedback" role="alert">
                                                <strong>this is required</strong>
                                            </span>
                                        : '' }
                                    </Col>
                                </FormGroup> 

                                { false && this.state.meeting_room_id > 0  ?

                                    this.amount() 

                                : ''  }


                                <FormGroup row>
                                    

                                    <Col md={8}>
                                        <Label>Duration</Label>
                                        <Input 
                                            type="select" 
                                            name="duration"
                                            className={`${this.state.errorDuration ? 'is-invalid' : ''} form-control`}
                                            value={this.state.duration}
                                            onChange={this.change}
                                        >
                                            <option key="0hr" value="0">Select duration</option>
                                            <option key="2hr" value="2">2 Hrs</option>
                                            <option key="4hr" value="4">4 Hrs</option>
                                            <option key="6hr" value="6">6 Hrs</option>
                                            <option key="8hr" value="8">8 Hrs</option>
                                        </Input>
                                        { this.state.errorDuration ?
                                            <span className="d-block invalid-feedback" role="alert">
                                                <strong>Duration is not valid. Meeting room start at 8:45 AM - 04:45 PM</strong>
                                            </span>
                                        : '' }
                                    </Col>

                                    <Col>
                                        <Label>Attendee</Label>
                                        <Input 
                                            type="number" 
                                            name="attendee" 
                                            min="2" 
                                            max="8" 
                                            onChange={this.change} 
                                            value={this.state.attendee}
                                        />
                                    </Col>

                                </FormGroup>

                                


                                <FormGroup row>

                                    <Col>
                                        <Label>Select provider</Label>
                                        <Input 
                                            type="select" 
                                            onChange={this.change} 
                                            className={`form-control ${this.state.errorCompany ? 'is-invalid' : ''}`} 
                                            name="company"
                                        >
                                            <option value="">Select provider</option>
                                            <option value="CO">Capital Office</option>
                                            <option value="YCF">Your Company Formation</option>
                                        </Input>
                                        { this.state.errorCompany ?
                                            <span className="d-block invalid-feedback" role="alert">
                                                <strong>this is required</strong>
                                            </span>
                                        : '' }
                                    </Col>

                                    

                                </FormGroup>

                                <FormGroup row>

                                    <Col>
                                        <Label>
                                            Your Company Name
                                            <span style={{ fontSize: '10px', letterSpacing: '0.2px' }} className="d-block">Please provide your Company Name on your account with Capital Office or Your Company Formations</span>
                                        </Label>
                                        <Input 
                                            type="text" 
                                            onChange={this.change} 
                                            className={`form-control ${this.state.errorYourCompanyName ? 'is-invalid' : ''}`} 
                                            name="your_company_name"
                                        />
                                        { this.state.errorYourCompanyName ?
                                            <span className="d-block invalid-feedback" role="alert">
                                                <strong>this is required</strong>
                                            </span>
                                        : '' }
                                    </Col>

                                </FormGroup>

                                <FormGroup row>

                                    <Col>
                                        <Label>
                                            Your Account Email
                                            <span style={{ fontSize: '10px', letterSpacing: '0.2px' }} className="d-block">Please provide your displayed on your account with Capital Office or Your Company Formations so we can locate your information on our database</span>
                                        </Label>
                                        <Input 
                                            type="text" 
                                            onChange={this.change} 
                                            className={`form-control ${this.state.errorYourAccountEmail ? 'is-invalid' : ''}`} 
                                            name="your_account_email"
                                        />
                                        { this.state.errorYourAccountEmail ?
                                            <span className="d-block invalid-feedback" role="alert">
                                                <strong>this is required</strong>
                                            </span>
                                        : '' }
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
                                        placeholder="Additional Notes" 
                                        onChange={this.change}
                                    />
                                </FormGroup>

                                {
                                    this.state.meeting_room_id > 0 ?

                                        this.state.validated ?

                                            this.state.valid ?

                                            <Row className="bg bg-success text-white mb-4 ml-0 mr-0">
                                                <Col className="text-center p-2">
                                                The <strong>{this.state.meeting_room_name}</strong> room is available from <strong>{this.state.from_time}</strong> - <strong>{this.state.to_time}</strong> on <strong>{format_date(this.state.booking_date)}.</strong> Click Book a meeting to book this room.
                                                </Col>
                                            </Row>                                            


                                            : 

                                            <Row className="bg bg-danger text-white mb-4 ml-0 mr-0">
                                                <Col className="text-center p-2">
                                                    The <strong>{this.state.meeting_room_name}</strong> room is not available from <strong>{this.state.from_time}</strong> - <strong>{this.state.to_time}</strong> on <strong>{format_date(this.state.booking_date)}.</strong>
                                                </Col>
                                            </Row>    


                                        : 

                                        ''


                                    : ''
                                    
                                }
                            </Col>

                            <Col md={6}>

                                { false && this.state.from_time.length > 0 && this.state.duration > 0 ? this.booking() : '' }

                                

                                    <div>

                                        

                                        <Fragment>

                                            <div className="d-block text-right">
                                                <Button onClick={ this.close } className="close"><img src="/images/Close.svg" /></Button>
                                            </div>

                                            <h4>Meeting Details</h4>

                                            

                                            <Table className="mb-4">
                                                
                                                <tbody>
                                                    <tr>
                                                        <td className="p-0">
                                                            { this.state.meeting_room_id > 0 ? this.state.meeting_room_name : 'Room' }<br />
                                                            { this.state.meeting_room_id > 0 ? format_date(this.state.booking_date) : 'Date' }<br />
                                                            { this.state.meeting_room_id > 0 ? <span className="hours">{this.state.duration} hours</span> : 'hours' }<br />
                                                            { this.state.meeting_room_id > 0 ? `${this.state.from_time} - ${this.state.to_time}` : 'time' }
                                                        </td>
                                                        <td className="p-0">
                                                            { formatter.format(this.state.amount) }
                                                        </td>
                                                    </tr>                                                    
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td className="pl-0 pr-0">
                                                            <span className="vat">VAT (20%)</span>
                                                        </td>
                                                        <td className="pl-0 pr-0">
                                                            { formatter.format(this.state.vat_amount) }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-0">Total Amount: </td>
                                                        <td className="p-0">
                                                            { formatter.format(this.state.total_amount) }
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </Table>

                                        </Fragment>

                                       


                                      

                                        <h4>Payment Details</h4>

                                        <div className="payment-details">

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



                                    </div>

                                    <Row>
                                        <Col className="text-right">
                                        { this.state.valid ?
                                            <Button onClick={this.save} color="primary">Book a meeting</Button>

                                        : <Button color="secondary">Book a meeting</Button>
                                        }
                                        </Col>
                                    </Row>

                                
                            </Col>
                        </Row>
                    </ModalBody>
                    {/* <ModalFooter>
                        
                    </ModalFooter> */}
                </Modal>
            </Fragment>

        )

    }

}