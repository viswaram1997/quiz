import React, { Component } from 'react'
//import data from "../jsondata/data.json";
import { Col, Row, ToggleButtonGroup, ToggleButton, ButtonGroup, Button, Panel, ListGroup, ListGroupItem, Modal, ButtonToolbar, ProgressBar } from "react-bootstrap"
import dataFetch from '../services/services';
import brainicon from './assets/brain.svg';
import timmer from "./assets/if_ic_timer_48px_352173.svg";

export default class Quiz extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            index: 0,
            userValue: [],
            disabled: false,
            resultDisplay: false,
            key: '',
            score: 0,
            isChoosed: true,
            startQuiz: false,
            timer: '',
            loading: true,
            showModal: false,
            averageTime: 5,
            negativemarks: 0.5,
            duration: 0,
            negmark: 0,
            topbutton: [],
            allfinish: false,
            allclick: false,
            confirmmodal:false,
            prev:false,
            
            skip: []
        }
        this.Nextquestion = this.Nextquestion.bind(this);
        this.prevQuestion = this.prevQuestion.bind(this);
        this.handleChoose = this.handleChoose.bind(this);
        this.validate = this.validate.bind(this);
        this.handleResultValidate = this.handleResultValidate.bind(this);
        this.arrayShufle = this.arrayShufle.bind(this);
        this.close = this.close.bind(this);
        this.TopButtonClick = this.TopButtonClick.bind(this);
        this.TopButtonValidate = this.TopButtonValidate.bind(this);
        this.testfinish = this.testfinish.bind(this);
        this.disabled = this.disabled.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.skip = this.skip.bind(this);
    }

    arrayShufle(data) {
        //var k=1;
        //console.log(data, 1)
        for (var i = data.length - 1; i > -1; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [data[i], data[j]] = [data[j], data[i]];

        }
        return data;
    }

    componentWillMount() {
        dataFetch().then((data) => {
            //console.log(data);
            data.questions.map(option => {
                return this.arrayShufle(option.options);
            })

            this.setState({
                data: this.arrayShufle(data.questions),
                loading: false,
                negativemarks: data.negativemarks,
                duration: data.duration * 60 * 1000
            });
        }).catch((e) => {
            console.log(e);
        })


    }

    handleChoose(e, index) {
        let answer = this.state.data[this.state.index].answer;
        let user = this.state.userValue;
        let top = this.state.topbutton;
        top.push(index);
        
        user[this.state.index]=e;
        var removeSkipValue= this.state.skip;
        var inde = removeSkipValue.indexOf(index);
        if(inde!==-1){
            removeSkipValue.splice(inde,1);
        }
       // console.log(user);
        this.setState({
            userValue: user,
            disabled: true,
            isChoosed: false,
            topbutton: top,
            skip: removeSkipValue,
            skipdisable: true
           
        });
        var tops = this.state.topbutton.length;
        var data = this.state.data.lenght;
        if (tops === data) {
            this.setState({
                allclick: true
            });
        }
        if (answer === e) {
            this.setState({
                key: e,
                score: this.state.score + 1
            })
        } else {
            this.setState({
                key: e,
                score: this.state.score - this.state.negativemarks,
                negmark: this.state.negmark + this.state.negativemarks
            })
        }
    }

    prevQuestion() {
        if(this.state.index !== 0){
         
            if(!this.state.prev){
                
        }else{
            this.setState({
                index: this.state.index - 1,
                allfinish: false
               
            })
        }
        }
    }

    Nextquestion() {
        const index = this.state.index;
        const length = this.state.data.length;
        if (index < length) {
            this.setState({
                index: index + 1,
                disabled: false,
                prev: true
                
            });
            if (index === length - 2) {
                this.setState({
                    allfinish: true
                })
            }
        }
    }

    skip(e){
       
        let Skip=this.state.skip;
        var val = Skip.indexOf(e);

        if(val === -1){
            // console.log(val);
            Skip.push(e);
            this.setState({
                skip:Skip,
                prev:true
                
            });
        }
        
        const index = this.state.index;
        const length = this.state.data.length;
        if (index < length-1) {
            this.setState({
                index: index + 1,
                disabled: false,
                prev:true
            });
        }else{
            this.setState({
                allfinish:true
            });
        }
    }


    testfinish() {
        if(this.state.userValue.length===this.state.data.length){
            this.setState({
                showModal:true
            });
        }
        this.setState({
            resultDisplay: true
      
        });
        if (!this.state.allclick) {
            if(this.state.userValue.length === this.state.data.length){
                this.setState({
                    resultDisplay: true,
                    confirmmodal: false
                })
            }else{
                this.setState({
                    resultDisplay: false,
                    confirmmodal: true
                })
            }
        }
    }

    TopButtonClick(e) {
        var QuestionNo = e.target.value-1;
        this.setState({
            index: parseInt(QuestionNo),
            prev: true
        });
    }

    disabled(i) {
        var id = i;
        function findclick(data) {
            if (data === id) {
                return true
            }
        }
        var da = this.state.topbutton.find(findclick);
        // console.log(da)
        var dd = parseInt(da);
        if (dd >= 0) {
            return "true"
        }
    }

    TopButtonValidate(i) {
        var id = i;
        function findclick(data) {
            if (data === id) {
                return true
            }
        }
        var da = this.state.topbutton.find(findclick);
        //console.log(da)
        var dd = parseInt(da);
        if (dd >= 0) {
            return "primary"
        }
    }

    validate(e) {
  console.log( this.state.userValue,"njkn",e);
        if (e === this.state.userValue[this.state.index]) {
            if (e === this.state.data[this.state.index].answer) {
                console.log("fdfddfddfdd");
                return "success"
            } else {
                return "danger"
            }
        }
    }


    handleResultValidate(count, option, answer) {
        if (this.state.userValue[count - 1] === option.key) {
            if (this.state.userValue[count - 1] === answer) {
                return <ListGroupItem bsSize="large" bsStyle="success">{option.choice}</ListGroupItem>
            } else {
                return <ListGroupItem bsSize="large" bsStyle="danger">{option.choice}</ListGroupItem>
            }
        } else {
            if (option.key === answer) {
                return <ListGroupItem bsSize="large" bsStyle="success">{option.choice}</ListGroupItem>
            } else {
                return <ListGroupItem bsSize="large">{option.choice}</ListGroupItem>
            }
        }
    }

    close() {
        this.setState({ 
            showModal: false,
            confirmmodal: false
         })
    }

    handleProceed(){
        this.setState({
            resultDisplay: true,
            confirmmodal: false
        })
    }

    render() {

        var button = this.state.skip.map((data, i) => {
            return (
                <Button value={data+1} bsStyle="warning" >
                    {data + 1}
                </Button>
            )
        });

        var count = 0;
        if (this.state.index < this.state.data.length) {
            var option = this.state.data[this.state.index].options.map((data, i) => {
                return (
                    <ToggleButton
                        key={i.toString()}
                        bsSize="large"
                        onChange={() => {
                            this.handleChoose(data.key, this.state.index);
                        }}
                        bsStyle={this.validate(data.key)}
                        value={this.state.data[this.state.index].question}
                        disabled={this.disabled(this.state.index)}
                    >{data.choice}</ToggleButton>
                )
            });
        }

        var result = this.state.data.map((data) => {
            count++;
            var options = data.options.map(option => (
                this.handleResultValidate(count, option, data.answer)
            ));



            return (
                <Panel header={`${count}. ${data.question}`}>
                    <ListGroup Style="max-width:150px;" vertical>
                        {options}
                    </ListGroup>
                </Panel>
            )
        });

        var test = () => (
            <Row>
                <Col md={12}>
                    
                    <p id="timer"><img  Style="max-height:25px " src={timmer}/> {!this.state.startQuiz ? <p></p> : this.state.timer}</p>
                    <p><ProgressBar active bsStyle="success" now={(this.state.userValue.length/this.state.data.length)*100} /></p>
                    <p>
                        <p Style="font-size:18px">Skipped Question 
                        <ButtonToolbar>
                            <ButtonGroup onClick={this.TopButtonClick}>
                               {button}
                            </ButtonGroup>
                        </ButtonToolbar></p>
                    </p>
                    <div id="listquestions">
                        <h3>{this.state.index + 1}. {this.state.data[this.state.index].question}</h3>
                        <ButtonGroup>
                            <ToggleButtonGroup type="radio" name="options" vertical>
                                {option}
                            </ToggleButtonGroup>
                        </ButtonGroup>
                        
                        <p Style="margin-top: 25px;">
                            
                               
                                    <div>
                                        <Button Style={"margib :5px"}
                                            onClick={this.prevQuestion}
                                            disabled={this.state.index === 0 ? true : false}  
                                        >&lt;&lt; Previous Question</Button>
                                        <Button Style={"margin :5px "}
                                            disabled={this.disabled(this.state.index)}
                                            onClick={()=>{
                                                if(this.state.skip.length < this.state.data.length-1){
                                                    // console.log(this.state.skip.length)
                                                    this.skip(this.state.index)
                                                }
                                            }}
                                        >Skip Question</Button>
                                        <Button Style={"margin :5px "}
                                            disabled={this.state.index === this.state.data.length-1 ? true : false}                                           
                                            onClick={this.Nextquestion}
                                        >Next Question &gt;&gt;</Button>
                                    </div>
                                     
                                    <Button 
                                        bsStyle="danger" 
                                        onClick={this.testfinish}
                                    >Submit</Button>
                            
                        </p>
                    </div>
                </Col>
            </Row>
        )

        var displayResult = () => (
            <Row>
                <h2 id="takeq">Final Answers</h2>
                <p Style="text-align: center;">
                    <Button
                        bsSize="large"
                        bsStyle="success"
                        onClick={() => { this.setState({ showModal: true }) }}
                    >Display Result</Button>
                </p>
                <Col md={6} mdOffset={3}>
                    {result}
                </Col>
            </Row>
        )

        //console.log(this.state.timer);

        var timetaken = this.state.duration - this.state.finaltime;
        var average = timetaken / this.state.data.length;
        //console.log(average)
        var mins = Math.floor((timetaken % (1000 * 60 * 60)) / (1000 * 60));
        var secs = Math.floor((timetaken % (1000 * 60)) / 1000);
        var avermin = Math.floor((average % (1000 * 60 * 60)) / (1000 * 60));
        var aversec = Math.floor((average % (1000 * 60)) / 1000);;

        var modal = () => (
            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>RESULT</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div id="modal">
                        <p id="photo"><img src={brainicon} /></p>
                        <h3><b>Score:</b> {this.state.score}</h3>
                        <h3><b>Negative Marks:</b> {this.state.negmark}</h3>
                        <h3><b>Total Time Taken to Complete the Quiz:</b> {mins} mins : {secs} secs </h3>
                        <h3><b>Average Time Taken for Each Question: </b> {avermin} mins : {aversec} secs</h3>
                    </div>
                </Modal.Body>
            </Modal>
        );
        //console.log(this.state.finaltime);

        var confirmmodal = () => (
            <Modal show={this.state.confirmmodal} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm to Submit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3>There are some questions not answered.. Do you want to proceed to submit the quiz?</h3>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleProceed}>Ok. Proceed!</Button>
                    <Button onClick={this.close}>Close</Button>
                </Modal.Footer>
            </Modal>
        );

        return (
            <div>
                {!this.state.startQuiz ?

                    <p Style="text-align: center; margin-top: 100px;">
                    <h3>Quiz containing <b>{this.state.data.length}</b> questions</h3>
                        <h3>Each question carries 1 mark</h3>
                        <h3>Negative marks {this.state.negativemarks} per question</h3>
                        <Button
                            bsSize="large"
                            bsStyle="primary"
                            onClick={() => {
                                this.setState({ startQuiz: true })
                                var avaliabeTime = new Date().getTime() + this.state.duration;
                                var timer = setInterval(() => {
                                    var now = new Date().getTime();
                                    var countdown = avaliabeTime - now;
                                    var min = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
                                    var sec = Math.floor((countdown % (1000 * 60)) / 1000);
                                    if (this.state.resultDisplay) {
                                        clearInterval(timer);
                                        this.setState({ finaltime: countdown })
                                    }
                                    if (min === 0 && sec === 0) {
                                        this.setState({
                                            resultDisplay: true
                                        });
                                        clearInterval(timer);
                                    } else {
                                        this.setState({ timer: `${min} Mins : ${sec} Secs` });
                                    }
                                }, 1000)
                            }}
                            disabled={this.state.loading}
                        >{this.state.loading?'loading':'startQuiz'}</Button></p> :
                    !this.state.resultDisplay ? test() : displayResult()
                }
                {modal()}
                {confirmmodal()}
            </div>
        )
    }
}
