import React, { Component } from 'react'
//import data from "../jsondata/data.json";
import { Col, Row, ToggleButtonGroup, ToggleButton, ButtonGroup, Button, Panel, ButtonToolbar } from "react-bootstrap"
import dataFetch from '../services/services';

export default class Quiz extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            index: 0,
            userValue: [],
            disabled: false,
            resultDisplay: false,
            validationStatus: null,
            key: '',
            color: [],
            score: 0,
            isChoosed: true,
            startQuiz: false,
            timer: '',
            loading: true,
            FinalTime: 0,
            StartTime: "",
            topbutton: [],
            allfinish: true,
            allclick:false
        }
        this.Nextquestion = this.Nextquestion.bind(this);
        this.handleChoose = this.handleChoose.bind(this);
        this.validate = this.validate.bind(this);
        this.handleResultValidate = this.handleResultValidate.bind(this);
        this.arrayShufle = this.arrayShufle.bind(this);
        this.TopButtonClick = this.TopButtonClick.bind(this);
        this.TopButtonValidate = this.TopButtonValidate.bind(this);
        this.testfinish=this.testfinish.bind(this);
    }

    arrayShufle(data) {
        //var k=1;
        for (var i = data.length - 1; i > -1; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [data[i], data[j]] = [data[j], data[i]];

        }
        return data;
    }

    componentWillMount() {
        var data = dataFetch().then((data) => {
            this.setState({ data });
            // console.log(data);
            this.setState({ loading: false })
        }).catch((e) => {
            console.log(e);
        })
           
        this.state.data.map(option => {
            return this.arrayShufle(option.options);
        })

        this.setState({
            data: this.arrayShufle(this.state.data)
        });


    }

    handleChoose(e, index) {
        let answer = this.state.data[this.state.index].answer;
        let user = this.state.userValue;
        let top = this.state.topbutton;
        top.push(index);
        user.push(e);
        // console.log(e.target.value.toString())
        this.setState({
            userValue: user,
            disabled: true,
            isChoosed: false,
            topbutton: top
        });
        var tops=this.state.topbutton.length;
        var data = this.state.data.lenght;
        if(top===data){
           this.setState({
            allclick:true
           });
        }
        const score = this.state.score + 1;
        if (answer === e) {
            this.setState({
                validationStatus: "success",
                key: e,
                score
            })

        } else {
            
            this.setState({
                validationStatus: "danger",
                key: e,
                score: score-0.5})
        }
    }


    Nextquestion() {
        const index = this.state.index;
        const length = this.state.data.length;
        if (index < length) {
            this.setState({
                index: index + 1,
                disabled: false,
                validationStatus: null
            });
            if (index === length - 2) {
                this.setState({
                    allfinish: false
                })


            }


        }
    }
    testfinish(){
                    
      console.log("hello");

             this.setState({
                 resultDisplay: true,
             });
             if(!this.state.allclick){
            alert("not click");
             }
    }

 
validate(e) {

    if (e == this.state.userValue[this.state.index]) {

        if (e === this.state.data[this.state.index].answer) {

            return "success"
        } else {
            return "danger"
        }
    }
}


handleResultValidate(count, option, answer) {
    if (this.state.userValue[count - 1] === option.key) {
        if (this.state.userValue[count - 1] === answer) {
            return <ToggleButton bsSize="large" bsStyle="success" value={option.key} disabled>{option.choice}</ToggleButton>
        } else {
            return <ToggleButton bsSize="large" bsStyle="danger" value={option.key} disabled>{option.choice}</ToggleButton>
        }
    } else {
        if (option.key === answer) {
            return <ToggleButton bsSize="large" bsStyle="success" value={option.key} disabled>{option.choice}</ToggleButton>
        } else {
            return <ToggleButton bsSize="large" value={option.key} disabled>{option.choice}</ToggleButton>
        }
    }
}

TopButtonClick(e){
    var QuestionNo = e.target.value;
    this.setState({
        index: parseInt(QuestionNo)
    });
}
TopButtonValidate(i){

    var id = i;


    function findclick(data) {

        if (data === id) {
            return true
        }

    }
    var da = this.state.topbutton.find(findclick);
    console.log(da)
    var dd = parseInt(da);

    if (dd >= 0) {

        return "primary"
    }
}


render() {
    // console.log( this.TopButtonValidate(2) ,"dd");
    // console.log(this.state.disabled);

    if (this.state.startQuiz) {

    }

    var count = 0;
    if (this.state.index < this.state.data.length) {
        var option = this.state.data[this.state.index].options.map((data) => {
            return (
                <ToggleButton
                    bsSize="large"
                    bsStyle={this.validate(data.key)}

                    onClick={() => { this.handleChoose(data.key, this.state.index) }}
                    disabled={this.state.disabled}
                    value={this.state.data[this.state.index].question}
                >{data.choice}</ToggleButton>
            )
        });
    }

    var result = this.state.data.map((data, i) => {
        count++;
        var options = data.options.map(option => (
            this.handleResultValidate(count, option, data.answer)
        ));



        return (
            <Panel header={`${i + 1}. ${data.question}`}>
                <ButtonGroup>
                    <ToggleButtonGroup type="radio" name="options" defaultValue={this.state.userValue[count - 1]} vertical>
                        {options}
                    </ToggleButtonGroup>
                </ButtonGroup>

            </Panel>
        )
    });
    var ss = 0;
    var button = this.state.data.map((data, i) => {
        ++ss
        return (<Button value={i} bsStyle={this.TopButtonValidate(i)}  >
            {i + 1}
        </Button>)
    });
    var index = this.state.index + 1;
    // console.log(index);
    var test = () => (

        <Row>
            <Col md={12}>
                <h2 id="takeq">Take Quiz</h2>
                <p id="timer">Countdown: {!this.state.startQuiz ? <p></p> : this.state.timer}</p>
                <ButtonToolbar >
                    <ButtonGroup onClick={this.TopButtonClick}>
                        {button}
                    </ButtonGroup>
                </ButtonToolbar>


                <div id="listquestions">
                    <h3>{index}. {this.state.data[this.state.index].question}</h3>
                    <ButtonGroup>
                        <ToggleButtonGroup type="radio" name="options" vertical>
                            {option}
                        </ToggleButtonGroup>
                    </ButtonGroup>
                    <p Style="margin-top: 25px;">{this.state.allfinish ? <Button  onClick={this.Nextquestion}>Next Question</Button> : <Button onClick={this.testfinish}>submit</Button>}</p>
                </div>
            </Col>
        </Row>
    )

    var final = 300000 - this.state.FinalMin;
    var average = final / 5;
    var mins = Math.floor((final % (1000 * 60 * 60)) / (1000 * 60));
    var secs = Math.floor((final % (1000 * 60)) / 1000);
    var avermin = Math.floor((average % (1000 * 60 * 60)) / (1000 * 60));
    var aversec = Math.floor((average % (1000 * 60)) / 1000);;
    var displayResult = () => (
        <Row>
            <h2 id="takeq">Result</h2>
            <p Style="text-align: center; font-color: red; font-size: 25px; font-weight: bold;">Score: {this.state.score} Time :{mins}:{secs} Average of each question :{avermin}:{aversec}</p>
            <Col md={12}>
                {result}
            </Col>
        </Row>
    )

    return (
        <div>
            {!this.state.startQuiz ?
                <p Style="text-align: center; margin-top: 100px;">
                    <Button
                        bsSize="large"
                        bsStyle="primary"
                        onClick={() => {
                            this.setState({ startQuiz: true })
                            var avaliabeTime = new Date().getTime() + 300000;
                            // console.log(avaliabeTime);
                            // this.setState({
                            //     StartTime: avaliabeTime
                            // });
                            var timer = setInterval(() => {
                                var now = new Date().getTime();
                                var countdown = avaliabeTime - now;

                                var min = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
                                var sec = Math.floor((countdown % (1000 * 60)) / 1000);
                                !this.state.resultDisplay ? this.setState({
                                    FinalMin: countdown

                                }) : ""

                                if (min === 0 && sec === 0) {
                                    this.setState({
                                        resultDisplay: true
                                    });

                                    clearInterval(timer);

                                } else {
                                    this.setState({ timer: `${min} Mins : ${sec} Secs` });
                                }
                            }, 1000)
                        }
                        }
                        disabled={this.state.loading}
                    >Start Quiz</Button></p> :
                !this.state.resultDisplay ? test() : displayResult()
            }
        </div>
    )
}}

