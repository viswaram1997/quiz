import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap';

export default class Header extends Component {
  render() {
    return (
      <Row id="header">
        <Col md={12}>
          <h1>eQuiz</h1>
          <p>-Know how smart you are!</p>
        </Col>
      </Row>
    )
  }
}
