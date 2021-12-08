import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

let minSec = [null, null];
const convert = (time) => {
  if(time>=60) {
    minSec[0] = Math.floor(time/60);
    minSec[1] = time-minSec[0]*60;
  } else {
    minSec[0] = 0;
    minSec[1] = time;
  }
};
let timeOut;
let countdownRepeat;

class Break extends React.Component {
  render() {
    convert(this.props.break);
    return (
      <div id="break-label" className="mx-2">
        <div>Break Length</div>
        <div className="d-flex align-items-center justify-content-center">
          <i id="break-increment" class="fas fa-chevron-circle-up" onClick={this.props.breakIncrement}></i>
          <div id="break-length" className="mx-3">{minSec[0]}</div>
          <i id="break-decrement" class="fas fa-chevron-circle-down" onClick={this.props.breakDecrement}></i>
        </div>
      </div>
    )
  };
}

class Session extends React.Component {
  render() {
    convert(this.props.session);
    return (
      <div id="session-label" className="mx-2">
        <div>Session Length</div>
        <div className="d-flex align-items-center justify-content-center">
          <i id="session-increment" class="fas fa-chevron-circle-up" onClick={this.props.sessionIncrement}></i>
          <div id="session-length" className="mx-3">{minSec[0]}</div>
          <i id="session-decrement" class="fas fa-chevron-circle-down" onClick={this.props.sessionDecrement}></i>
        </div>
      </div>
    )
  };
}

class Timer extends React.Component {
  render() {
    convert(this.props.current);
    let minute = null;
    let second = null;
    const singleDigitRegex = /^\d$/;
    if(singleDigitRegex.test(minSec[0])) {
      minute = "0" + minSec[0].toString();
    } else {
      minute = minSec[0];
    }
    if(singleDigitRegex.test(minSec[1])) {
      second = "0" + minSec[1].toString();
    } else {
      second = minSec[1];
    }
    return (
      <div id="timer-label" className="text-center timer">
        <div className="mt-2">{this.props.period}</div>
        <div id="time-left">{minute}:{second}</div>
      </div>
    )
  };
}

class Buttons extends React.Component {
  render() {
    return (
      <div className="d-flex align-items-center justify-content-center mt-3">
        <button id="start_stop" className="mr-3" onClick={this.props.updateButton}>Start</button>
        <button id="reset" className="ml-3" onClick={this.props.reset}>Reset</button>
      </div>
    )
  };
}

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      break: 300,
      session: 1500,
      current: 1500,
      start: false,
      period: "Session"
    };
    this.periodEnd = this.periodEnd.bind(this);
    this.countingDown = this.countingDown.bind(this);
  }

  breakIncrement() {
    if(this.state.break<3600 && this.state.start===false) {
      this.setState((state) => ({
        break: state.break + 60
      }));
      if(this.state.period==="Break") {
        this.setState((state) => ({
          current: state.break
        }));
      }
    }
  }

  breakDecrement() {
    if(this.state.break>60 && this.state.start===false) {
      this.setState((state) => ({
        break: state.break - 60
      }));
      if(this.state.period==="Break") {
        this.setState((state) => ({
          current: state.break
        }));
      }
    }
  }

  sessionIncrement() {
    if(this.state.session<3600 && this.state.start===false) {
      this.setState((state) => ({
        session: state.session + 60
      }));
      if(this.state.period==="Session") {
        this.setState((state) => ({
          current: state.session
        }));
      }
    }
  }

  sessionDecrement() {
    if(this.state.session>60 && this.state.start===false) {
      this.setState((state) => ({
        session: state.session - 60
      }));
      if(this.state.period==="Session") {
        this.setState((state) => ({
          current: state.session
        }));
      }
    }
  }

  periodEnd() {
    if(this.state.current===1) {
      const audio = document.getElementById("beep");
      audio.currentTime = 0;
      audio.play();
      audio.volume = 1;
    }
    if(this.state.current===0) {
      if(this.state.period==="Session") {
        this.setState((state) => ({
          period: "Break",
          current: state.break + 1
        }));
      } else {
        this.setState((state) => ({
          period: "Session",
          current: state.session + 1
        }));
      }
    }
  }

  countingDown() {
    this.setState((state) => ({
      current: state.current-1
    }));
  }

  countdown() {
    countdownRepeat = setInterval(this.periodEnd, 1000);
    timeOut = setInterval(this.countingDown, 1000);
    this.setState((state) => ({
      start: true,
    }));
  }

  pause() {
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
    this.setState((state) => ({
      start: false,
    }));
    clearTimeout(countdownRepeat);
    clearTimeout(timeOut);
  }

  updateButton() {
    if(document.getElementById("start_stop").innerText==="Start") {
      document.getElementById("start_stop").innerText = "Pause";
      this.countdown();
    } else {
      document.getElementById("start_stop").innerText = "Start";
      this.pause();
    }
  }

  reset() {
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
    clearTimeout(countdownRepeat);
    clearInterval(timeOut);
    document.getElementById("start_stop").innerText = "Start";
    this.setState((state) => ({
      break: 300,
      session: 1500,
      current: 1500,
      start: false,
      period: "Session"
    }));
  }

  render() {
    return (
      <div id="container" className="container-fluid vh-100 d-flex flex-column align-items-center justify-content-center">
        <div id="title">Session Timer</div>
        <div className="row mt-2">
          <Break break={this.state.break} breakIncrement={this.breakIncrement.bind(this)} breakDecrement={this.breakDecrement.bind(this)}/>
          <Session session={this.state.session} sessionIncrement={this.sessionIncrement.bind(this)} sessionDecrement={this.sessionDecrement.bind(this)}/>
        </div>
        <Timer current={this.state.current} period={this.state.period}/>
        <Buttons countdown={this.countdown.bind(this)} pause={this.pause.bind(this)} updateButton={this.updateButton.bind(this)} reset={this.reset.bind(this)}/>
        <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"/>
      </div>
    )
  };
}

ReactDOM.render(
  <React.StrictMode>
    <Clock />
  </React.StrictMode>,
  document.getElementById('root')
);
