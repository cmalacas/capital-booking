import { faBan, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component, Fragment } from 'react';
import { Button, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Label, Input } from 'reactstrap';
import Authservice from '../../components/Authservice';

export default class AddClient extends Component {

  constructor( props ) {

    super( props );

    this.state = {

      open: false,

      firstname: '',
      lastname: '',
      errorFirstname: false,
      errorLastname: false

    }

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.save = this.save.bind(this);
    this.change = this.change.bind(this);

  }

  open() {

    this.setState({ open: true });

  }

  close() {

    this.setState({ open: false });

  }

  save() {

    let error = false;
    let errorFirstname = false;
    let errorLastname = false;

    const { firstname, lastname } = this.state;

    if (firstname == '') {

      error = true;
      errorFirstname = true;

    }

    if (lastname == '') {

      error = true;
      errorLastname = true;

    }

    if (error) {

      this.setState({ error, errorFirstname, errorLastname });

    } else {

      this.setState({ open: false });

      const data = { firstname, lastname };

      this.props.save( data );

    }

  }

  change(e) {

    this.setState({ [e.target.name] : e.target.value, errorFirstname: false, errorLastname: false });

  }

  render() {

    return (

      <Fragment>
        <Button onClick={ this.open } className="add-client-btn" color="success">Add Client</Button>
        <Modal isOpen={ this.state.open } toggle={ this.close }>
          <ModalHeader>
            Add Client
          </ModalHeader>
          <ModalBody className="p-4">
            <FormGroup>
              <Label>First Name</Label>
              <Input 
                type="text" 
                name="firstname" 
                value={ this.state.firstname } 
                placeholder="Enter client first name" 
                onChange={ this.change }
              />
              { this.state.errorFirstname ? <div className="position-absolute alert alert-danger">First name is required</div> : ""}
            </FormGroup>

            <FormGroup>
              <Label>Last Name</Label>
              <Input 
                type="text" 
                name="lastname" 
                value={ this.state.lastname } 
                placeholder="Enter client last name" 
                onChange={ this.change }
              />
              { this.state.errorLastname ? <div className="position-absolute alert alert-danger">Last name is required</div> : ""}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button onClick={ this.save } color="success"><FontAwesomeIcon icon={faSave} /> Save</Button>

            <Button onClick={ this.close } color="light"><FontAwesomeIcon icon={faBan} /> Save</Button>
          </ModalFooter>
        </Modal>
      </Fragment>

    )

  }

}