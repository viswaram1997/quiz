import React, { Component } from 'react'
import { Grid } from 'react-bootstrap';
import Header from '../components/Header';
import QuizContainer from '../components/QuizCointainer';

export default class TakeQuiz extends Component {
  render() {
    return (
      <Grid fluid={true}>
        <Header />
        <QuizContainer />
      </Grid>
    )
  }
}
