import React, { Component } from 'react'
import io from 'socket.io-client';

var crypto = require('crypto');
var algorithm = 'aes-256-ctr';

class Demo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            socketState: false,
            module: "domains"
        }

    }

    componentDidMount() {
        // this.socket = io.connect("http://localhost:3456")
        // this.bindSocket(this.socket);
    }

    encrypt(key, tag, data) {
        console.log("Raw Request: ", data);
        var cipher = crypto.createCipher(algorithm, key)
        var crypted = cipher.update(JSON.stringify(data), 'utf8', 'hex')
        crypted += cipher.final('hex');
        console.log("Encrypted Request: ", crypted);
        this.socket.emit(tag, crypted);
        // return crypted;
    }

    decrypt(key, data) {
        console.log("Encrypted Response: ", data);
        var decipher = crypto.createDecipher(algorithm, key)
        var dec = decipher.update(data, 'hex', 'utf8')
        dec += decipher.final('utf8');
        var response = JSON.parse(dec);
        console.log("Decrypted Response: ", response);
        return response;
    }

    bindSocket = (socket) => {
        this.socket.on('test', (data) => { this.setState({ socketState: true }); console.log(data) })
        this.socket.on('disconnect', (data) => { this.setState({ socketState: false }); console.log("You are Offline now"); })
        this.socket.on('response', data => {
            this.decrypt(this.socket.id, data);
        })
    }
    connectSocket = () => { this.socket = io.connect("http://localhost:3456"); this.bindSocket(this.socket) }
    disconnectSocket = () => this.socket.disconnect()

    superadminLogin = () => {
        var data = {
            module: "login",
            userid: "superadmin",
            password: "superadm1n",
            role: "superadmin",
            data: "*"
        };

        this.encrypt(this.socket.id, "admin", data);

    }

    adminLogin = () => {
        var data = {
            module: "login",
            userid: "sadeesh2",
            password: "sadeesh",
            role: "admin",
            data: "192.168.0.27"
        };
        this.encrypt(this.socket.id, "admin", data);

    }

    selectModule = (e) => {
        console.log(e);
        this.setState({ module: e.target.value });
    }

    listHandler = () => {
        this.encrypt(this.socket.id, 'admin', {
            module: this.state.module,
            action: "list"
        })
    }
    addHandler = () => {
        this.encrypt(this.socket.id, 'admin', {
            module: this.state.module,
            action: "new",
            data: { id: "11232132132143" }
        })
    }
    getHandler = () => {
        this.encrypt(this.socket.id, 'admin', {
            module: this.state.module,
            action: "get",
            query: {
                "_id": "59f1a2dfa04e0e79dc806dd9"
            }
        })
    }
    editHandler = () => {
        this.encrypt(this.socket.id, 'admin', {
            module: this.state.module,
            action: "edit",
            query: {
                "_id": "59f1a2dfa04e0e79dc806dd9"
            },
            data: {
                name: "something to edit"
            }
        })
    }
    deleteHandler = () => {
        this.encrypt(this.socket.id, 'admin', {
            module: this.state.module,
            action: "delete",
            query: {
                "_id": "59f1a2dfa04e0e79dc806dd9"
            }
        })
    }

    render() {
        return (
            <div>
                SOCKET: <span>{this.state.socketState ? "Connected" : "Not Connected"}</span> <br /> <br />
                <div>
                    <button type="submit" disabled={this.state.socketState} onClick={this.connectSocket.bind(this)}>Connect</button> <br /> <br />
                    <button type="submit" disabled={!this.state.socketState} onClick={this.disconnectSocket.bind(this)}>Disconnect</button> <br /> <br />
                </div>
                <hr />
                <div>
                    <button type="submit" disabled={!this.state.socketState} onClick={this.superadminLogin.bind(this)}>Login as Super Admin</button><br /> <br />
                    <button type="submit" disabled={!this.state.socketState} onClick={this.adminLogin.bind(this)}>Login as Admin</button><br /> <br />
                </div>
                <hr />
                <select disabled={!this.state.socketState} defaultValue="domains" onChange={this.selectModule.bind(this)}>
                    <option value="blacklist"> Blacklists </option>
                    <option value="callcenter_agents"> Callcenter Agents </option>
                    <option value="callcenter_queues"> Callcenter Queues </option>
                    <option value="callcenter_tiers"> Callcenter Tiers </option>
                    <option value="cdr"> CDR </option>
                    <option value="conferences"> Conferences </option>
                    <option value="dids"> DIDs </option>
                    <option value="domains"> Domains </option>
                    <option value="gateways"> Gateways </option>
                    <option value="groups"> Ringgroups </option>
                    <option value="ivrs"> IVRs </option>
                    <option value="mohs"> MOHs </option>
                    <option value="playgo"> Play & Go </option>
                    <option value="roles"> User Roles </option>
                    <option value="routes"> Dial Routes </option>
                    <option value="settings"> Settings </option>
                    <option value="sounds"> Sounds </option>
                    <option value="timeconditions"> Timeconditions </option>
                    <option value="users"> Users </option>
                </select>
                <button type="submit" disabled={!this.state.socketState} onClick={this.listHandler.bind(this)}>List {this.state.module}</button><br /> <br />
                <button type="submit" disabled={!this.state.socketState} onClick={this.addHandler.bind(this)}>Add New {this.state.module}</button><br /> <br />
                <button type="submit" disabled={!this.state.socketState} onClick={this.getHandler.bind(this)}>Get {this.state.module}</button><br /> <br />
                <button type="submit" disabled={!this.state.socketState} onClick={this.editHandler.bind(this)}>Edit {this.state.module}</button><br /> <br />
                <button type="submit" disabled={!this.state.socketState} onClick={this.deleteHandler.bind(this)}>Delete {this.state.module}</button><br /> <br />
            </div>
        )
    }
}

export default Demo