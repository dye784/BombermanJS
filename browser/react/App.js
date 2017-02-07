import React, {Component} from 'react'
import ReactCountdownClock from 'react-countdown-clock';
import { connect } from 'react-redux';
import socket from '../socket';
import store from '../store';

import { initCannon, init, animate, controls } from '../game/main';
import { Login } from './Login';
const fontStyle = {
  'fontSize': '40px'
}
import Blocker from './Blocker';

function delay(t) {
  return new Promise(resolve => {
    setTimeout(resolve, t)
  })
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      time: 0
    }
  }

  componentDidMount() {
    delay(300)
    .then(() => {
      initCannon()
      init()
      animate()
    })
  }

  render() {
    let winnerId = this.props.winner

    const players = store.getState().players
    let winnerNickname = '';
    if (socket.id === winnerId && winnerId) {
        winnerNickname = 'You'
        socket.emit('reset_world', {})
    } else if (winnerId) {
      winnerNickname = players[winnerId].nickname;
    }
    return (
      <div>
        <Login />
            { winnerId && <h1  style={{position: "absolute", right: 500}}>{winnerNickname} Won!</h1>}
          <Blocker dead={this.props.dead} />
          { this.props.dead && <div style={{ backgroundColor: '#700303',
            position: 'absolute',
            opacity: '0.7',
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none'}}><h1  style={{position: "absolute", right: 500, top: 50}}> YOU ARE DEAD</h1>
            </div>}
            <div style={{position: "absolute", right: 0}}>
              {this.props.time ? this.props.time + '' : console.log(this.props.time)} Seconds Left
            </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
    dead: state.dead,
    winner: state.winner,
    time: state.timer
})


export default connect(mapStateToProps)(App);
