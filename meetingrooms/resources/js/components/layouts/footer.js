import React, { Component, Fragment } from 'react';
import { Col, Row } from 'reactstrap';

export default class Footer extends Component {

  constructor(props) {

    super( props );

  }

  render() {

    return (

      <Row className="mt-4 mb-4">
        <Col>
          <p className="text-center mb-1">&copy; Copyright 2023 Capital Office Ltd & Your Company Formations Ltd – All Rights Reserved</p>
          <p className="text-center mb-1">Capital Office Ltd | 06294297 | 124 City Road, London, EC1V 2NX</p>
          <p className="text-center mb-4">Your Company Formations Ltd | 9094616 | 128 City Road, London, EC1V 2NX</p>
        </Col>
      </Row>

    )

  }


}