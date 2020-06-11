import React, {Component, useLayoutEffect} from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {

  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: '...'
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This lottery is managed by {this.state.manager}.<br /> There are currently{' '}
          {this.state.players.length} players, competing to win{' '}
          {web3.fromWei(this.state.balance, 'ether')} ether!
        </p>
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
        <h4>Ready to pick a Winner?</h4>
        <button onClick={this.onClick}>Pick a Winner!</button>
        <h1>{this.state.message}</h1>
      </div>
    );
  }

  componentDidMount(){

    lottery.manager.call((error, result) => {
      if(!error){
        this.setState({ manager: result });
      } else{
          console.log(error);
      }
    });
  
    web3.eth.getBalance(lottery.address, (error, result) => {
      if(!error){
        this.setState({ balance: result.toNumber()});
      } else {
          console.log(error);
        }
    });
  
    lottery.getPlayers.call((error, result) => {
      if(!error){
        this.setState({ players: result });
      } else {
          console.log(error);
        }
    });
  
  };
  
  onSubmit = event => {
    event.preventDefault();
    const account = web3.eth.accounts[0];

    this.setState({ message: 'Waiting on transaction success...'});
    lottery.enter({
      from: account,
      value: web3.toWei(this.state.value, 'ether')
    }, (error, result) => { 
      if(!error) {
        this.setState({ message: 'You have been entered!' });
      } else {
          this.setState({ message: String(error) });
      }    
    })

  };

  onClick = () => {
    const account = web3.eth.accounts[0];

    this.setState({ message: 'Waiting for transaction success...'});
    lottery.selectWinner({
      from: account
    }, (error, result) => {
      if(!error) {
        this.setState({ message: 'A winner has been picked!' });
      } else {
          this.setState({ message: String(error)});
        }
    })

  };

}

export default App;

