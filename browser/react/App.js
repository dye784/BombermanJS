import React, {Component} from 'react'
import { initCannon, init, animate, controls, light } from '../game/main';
import ReactCountdownClock from 'react-countdown-clock';
import store from '../store'
import { connect } from 'react-redux';

const THREE = require('three')
const CANNON = require('cannon')

const fontStyle = {
  'fontSize': '40px'
}

function delay(t) {
  return new Promise(resolve => {
    setTimeout(resolve, t)
  })
}

class App extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    delay(300)
    .then(() => {
      pointerChecker()
      initCannon()
      init()
      animate()
    })
    // .then(() => {
    //   setInterval(() => {
    //     let dead = store.getState().dead.dead
    //     if (dead) this.setState({ dead: true})
    //   }, 100)
    // })
  }

  render() {
    // console.log('DEAD STATUS', store.getState().dead.dead)
    console.log('APP DEAD', this.props)
    return (
      <div>
        <div id="blocker">
          <div id="instructions">
            <span style={fontStyle}>Click to play</span>
            <br />
            (W,A,S,D = Move, SPACE = Jump, MOUSE = Look, CLICK = Shoot)
          </div>
        </div>
            {this.props.dead.dead && <h1  style={{position: "absolute", right: 300}}> YOU ARE FUCKING DEAD</h1>}
            <div style={{position: "absolute", right: 0}}>
            <ReactCountdownClock
            seconds={180}
            color="#ddd"
            alpha={0.5}
            size={100}
            timeFormat="hms"
            // onComplete={}
            />
            </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => state

export default connect(mapStateToProps)(App);


function pointerChecker() {
  const blocker = document.getElementById( 'blocker' );
  const instructions = document.getElementById( 'instructions' );
  const havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

  if ( havePointerLock ) {
      const element = document.body;
      const pointerlockchange = function ( event ) {
          if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
              controls.enabled = true;
              blocker.style.display = 'none';
          } else {
              controls.enabled = false;
              blocker.style.display = '-webkit-box';
              blocker.style.display = '-moz-box';
              blocker.style.display = 'box';
              instructions.style.display = '';
          }
      }
      const pointerlockerror = function ( event ) {
          instructions.style.display = '';
      }
      // Hook pointer lock state change events
      document.addEventListener( 'pointerlockchange', pointerlockchange, false );
      instructions.addEventListener( 'click', function ( event ) {
          instructions.style.display = 'none';
          // Ask the browser to lock the pointer
          element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

              element.requestPointerLock();
      }, false );
  }
}
