import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    balance: '',
    value: '',
    message: '',

    players: []
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async e => {
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.enter().send({
      from: this.state.manager,
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered!' });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has been picked!' });
  };

  render() {
    return (
      <div className="Appp">
        <h2>Lottery Contract</h2>
        <p>
          This contracts manager: {this.state.manager}. There are currently{' '}
          {this.state.players.length} people entered, compiting to win{' '}
          {web3.utils.fromWei(this.state.balance, 'ether')} ether!.
        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether: </label>
            <input
              onChange={e => this.setState({ value: e.target.value })}
              value={this.state.value}
            />
            <button>Enter</button>
          </div>
        </form>
        <hr />

        <h4>Time to pick a winner</h4>
        <button onClick={this.onClick}>Pick winner!</button>

        <hr />
        <h3>{this.state.message}</h3>
      </div>
    );
  }
}

export default App;
