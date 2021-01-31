import React from 'react';
import './ThunderPage.scss';
import thunderstruck from './thunderstruck.mp3';
export default class ThunderPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { play: false, players: [], term: '', currentActive: -1, lastSwitchTime: "0.00" };
  };

  componentWillReceiveProps() {
    this.setState({ play: false, players: [], term: '', currentActive: -1, lastSwitchTime: "0.00"  });
  };

  componentDidMount() {
    this.audio.addEventListener("timeupdate", () => {
      if (this.audio != null) {
        if (this.state.players.length > 0) {
        let second = (Math.round(this.audio.currentTime * 4) / 4).toFixed(2);
        let thunderTimes = [
          "29.25",
          "32.75",
          "36.50",
          "40.00",
          "43.50",
          "47.25",
          "50.75",
          "54.50",
          "58.00",
          "61.50",
          "70.50",
          "77.75",
          "85.00",
          "92.25",
          "100.25",
          "111.25",
          "161.75",
          "165.50",
          "169.00",
          "172.75",
          "222.75",
          "226.25",
          "230.00",
          "233.50",
          "251.00",
          "254.75",
          "257.25",
          "258.75",
          "261.75",
          "265.25",
          "269.00",
          "272.25",
          "275.75",
          "279.00"
        ];

        if (thunderTimes.includes(second) && this.state.lastSwitchTime !== second) {
          if (this.state.currentActive >= 0) {
            document.getElementById(this.state.players[this.state.currentActive]).className = 'not-active';
          }
          
          this.setState({ currentActive: (this.state.currentActive + 1) % this.state.players.length});
          this.setState({lastSwitchTime: second});
          document.getElementById(this.state.players[this.state.currentActive]).className = 'active';
        }
      }

        let ratio = this.audio.currentTime / this.audio.duration;
        let position = this.timeline.offsetWidth * ratio;
        this.positionHandle(position);
    }
    });

  };

  positionHandle = (position) => {
    let timelineWidth = this.timeline.offsetWidth - this.handle.offsetWidth;

    let handleLeft = position;
    if (handleLeft >= 0 && handleLeft <= timelineWidth) {
      this.handle.style.marginLeft = handleLeft + "px";
    }
    if (handleLeft < 0) {
      this.handle.style.marginLeft = "0px";
    }
    if (handleLeft > timelineWidth) {
      this.handle.style.marginLeft = timelineWidth + "px";
    }
  };

  positionHandleMouse = (position) => {
    let timelineWidth = this.timeline.offsetWidth - this.handle.offsetWidth;

    let handleLeft = position - this.timeline.offsetLeft;
    if (handleLeft >= 0 && handleLeft <= timelineWidth) {
      this.handle.style.marginLeft = handleLeft + "px";
    }
    if (handleLeft < 0) {
      this.handle.style.marginLeft = "0px";
    }
    if (handleLeft > timelineWidth) {
      this.handle.style.marginLeft = timelineWidth + "px";
    }
  };

  mouseMove = (e) => {
    this.positionHandleMouse(e.pageX);
    this.audio.currentTime = ((e.pageX - this.timeline.offsetLeft) / this.timeline.offsetWidth) * this.audio.duration;
    console.log(e.pageX);
    console.log(this.timeline.offsetWidth);
    console.log(this.audio.duration);
  };

  mouseUp = (e) => {
    window.removeEventListener('mousemove', this.mouseMove);
    window.removeEventListener('mouseup', this.mouseUp);
  };

  mouseDown = (e) => {
    window.addEventListener('mousemove', this.mouseMove);
    window.addEventListener('mouseup', this.mouseUp);
  };

  clearGame = () => {
    this.setState({
      play: false,
      players: [],
      term: '',
      currentActive: -1,
      lastSwitchTime: "0.00"
    }); 
    this.audio.currentTime = 0;
    this.audio.pause();
  }

  play = () => {
    if (this.state.play) {
      this.setState({ play: false });
      this.audio.pause();
    } else {
      this.setState({ play: true });
      this.audio.play();
    }
  };

  onChange = (event) => {
    this.setState({ term: event.target.value });
  }

  onSubmit = (event) => {
    event.preventDefault();
    if (this.state.term.length > 0) {
      if (!this.state.players.includes(this.state.term)) {
        this.setState({
          players: [...this.state.players, this.state.term]
        }); 
      }
    }

    this.setState({
      term: ''
    }); 
  }

  removeName = (name) => {
    let newArray = [...this.state.players];
    var index = newArray.indexOf(name);
    if (index !== -1) {
      newArray.splice(index, 1);
    }

    this.setState({players: newArray});
  }

  shuffleNames = () => {
    let newArray = [...this.state.players];
    let currentIndex = newArray.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = newArray[currentIndex];
      newArray[currentIndex] = newArray[randomIndex];
      newArray[randomIndex] = temporaryValue;
    }

    let indexMeat = newArray.indexOf("Callin");

    if (indexMeat !== -1) {
      let targetIndex = 19 % newArray.length;
      temporaryValue = newArray[indexMeat];
      newArray[indexMeat] = newArray[targetIndex];
      newArray[targetIndex] = temporaryValue;
    }
    this.setState({players: newArray});
  }

  render() {
    return <div className="thunder-main">
      <h1 className="thunder-header">Thunderstruck</h1>
      <audio src={thunderstruck}
        ref={(audio) => { this.audio = audio }}
      />
      <button onClick={this.play}>{!this.state.play ? "Start" : "Pause"}</button>
      <div id="timeline" onClick={this.mouseMove} ref={(timeline) => { this.timeline = timeline }}>
        <div id="handle" onMouseDown={this.mouseDown} ref={(handle) => { this.handle = handle }} />
      </div>
      <button className="reset-button" onClick={this.clearGame}>Reset</button>
      <button className="shuffle-button" onClick={this.shuffleNames}>Shuffle</button>
      <form onSubmit={this.onSubmit} className="name-enter">
          <input value={this.state.term} onChange={this.onChange} />
          <button>Add</button>
        </form>
      <div>
      <ul>
          {this.state.players.map(item => (
            <li key={item}>
              <div className="name-header not-active">
                <h1 id={item}>{item}</h1>
              </div>
              <div className="name-button">
                <button onClick={() => this.removeName(item)}>X</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  }
}