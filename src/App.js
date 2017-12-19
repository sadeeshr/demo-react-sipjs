import React, { Component } from 'react';
import './App.css';
import SIP from 'sip.js';

class App extends Component {

  constructor(props) {
    super(props)
    this.config = {
      userAgentString: 'Apayaa Endpoint V 1.0',
      traceSip: true,
      register: true,
      uri: "sadeesh@45.76.189.19:7777",
      password: "sadeesh",
      rel100: SIP.C.supported.SUPPORTED,
      wsServers: "wss://dev.thecryptoconnect.com:7443"
    };
    this.options = {
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: true,
          video: false
        }
      }
    };
  }

  componentDidMount() {
    this.doConnect();
    
  }


  doConnect = () => {
    let ua = new SIP.UA(this.config);
    this.userAgent = ua;

    ua.start();
    ua.on('connecting', () => console.log('CONNECTING'));
    ua.on('connected', () => console.log('CONNECTED'));
    ua.on('disconnected', () => console.log('DISCONNECTED'));
    ua.on('registered', () => console.log('REGISTERED'));
    ua.on('unregistered', (res, cause) => console.log(cause));
    ua.on('registrationFailed', (res, cause) => console.log(cause));
    ua.on('invite', sess => { this.session.accept() });
    ua.on('message', mesg => console.log(mesg));
  }

  doCall = () => {
    let uri = "sip:18884242424"
    console.log('TRYING');

    let render = {
      local: document.getElementById('localMedia'),
      remote: document.getElementById('remoteMedia')
    };
    var session = this.userAgent.invite(uri, this.options);
    console.log("Session: ", session);
    this.session = session;

    session.on('userMediaRequest', function (constraints) { console.log("usermedia request: ", constraints); })
    session.on('userMedia', function (stream) { console.log("stream: ", stream); })
    session.on('userMediaFailed', function (error) { console.log("user media failed", error); })

    session.on('iceConnectionFailed', function (error) {
      console.log("ice connection failed", error);
    })


    session.on('accepted', res => {
      console.log('TALKING');
      console.log("Session Object: ", session);
      session.mediaHandler.render(render);
    });

    session.on('progress', res => console.log('RINGING'));
    session.on('rejected', (res, cause) => console.log(cause));
    session.on('failed', (res, cause) => console.log(cause));
    session.on('terminated', (res, cause) => console.log(cause));
    session.on('cancel', _ => console.log('Cancelled'));
    session.on('refer', req => console.log(req));
    session.on('replaced', sess => console.log(sess));
    session.on('dtmf', (req, dtmf) => console.log(dtmf));
    session.on('muted', _ => console.log('Muted'));
    session.on('unmuted', _ => console.log('UnMuted'));
    session.on('bye', req => console.log(req));

  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Demo Sip js 0.9.1</h1>
          <button onClick={this.doCall.bind(this)}> Dial </button>
        </header>
      </div>
    );
  }
}

export default App;
