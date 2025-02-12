/*==================================================
src/App.js

This is the top-level component of the app.
It contains the top-level state.
==================================================*/
import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

// Import other components
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Credits from './components/Credits';
import Debits from './components/Debits';

import axios from "axios"

class App extends Component {
  constructor() {  // Create and initialize state
    super(); 
    this.state = {
      accountBalance: 12345,
      debitList: [],
      creditList: [],
      currentUser: {
        userName: 'Joe Smith',
        memberSince: '11/22/99',
      }
    }
  }

  async componentDidMount(){

    //wait for api
    let credits = await axios.get("https://moj-api.herokuapp.com/credits");
    let debits = await axios.get("https://moj-api.herokuapp.com/debits");

    let creditTotal = 0;
    let debitTotal = 0;

    //sum all credit elements
    for(let i = 0; i < credits.data.length; ++i){
      console.log(credits.data[i].amount)
      creditTotal += credits.data[i].amount;
    }

    //sum all debit elements
    for(let i = 0; i < debits.data.length; ++i){
      console.log(debits.data[i].amount)
      debitTotal += debits.data[i].amount;
    }

    //update state
    this.setState({
      creditList : credits.data,
      debitList : debits.data,
      accountBalance : Number(debitTotal - creditTotal).toFixed(2)
    })
  }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {  
    const newUser = {...this.state.currentUser}
    newUser.userName = logInInfo.userName
    this.setState({currentUser: newUser})
  }

  addCredits = (event) =>{
    console.log("hello");

    event.preventDefault();

    //create variables to store new object
    let date = new Date().toISOString();
    let description = event.target.description.value;
    let amount = event.target.amount.value;
    let id = this.state.creditList.length

    let newEntry = {
      'id' : id,
      'amount' : amount,
      'description' : description,
      'date' : date
    }

    //add new balance and update state
    let newBalance = Number(this.state.accountBalance) - Number(amount);
    let newCredits = this.state.creditList;
    newCredits.push(newEntry);
    this.setState({
      accountBalance : Number(newBalance).toFixed(2),
      creditList : newCredits
    });
  }

  addDebits = (event) =>{
    console.log("hello");

    event.preventDefault();

    //create variables to store new object
    let date = new Date().toISOString();
    let description = event.target.description.value;
    let amount = event.target.amount.value;
    let id = this.state.debitList.length

    let newEntry = {
      'id' : id,
      'amount' : Number(amount).toFixed(2),
      'description' : description,
      'date' : date
    }

    //add new balance and update state
    let newBalance = Number(this.state.accountBalance) + Number(amount);
    let newDebits = this.state.debitList;
    newDebits.push(newEntry);
    this.setState({
      accountBalance : Number(newBalance).toFixed(2),
      debitList : newDebits
    });
  }

  // Create Routes and React elements to be rendered using React components
  render() {  
    // Create React elements and pass input props to components
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance} />);
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince} />
    );
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)
    const DebitsComponent = () => (<Debits debits={this.state.debitList} addDebits={this.addDebits} accountBalance={this.state.accountBalance}/>) 
    const CreditsComponent = () => (<Credits credits={this.state.creditList} addCredits={this.addCredits} accountBalance={this.state.accountBalance}/>) 


    // Important: Include the "basename" in Router, which is needed for deploying the React app to GitHub Pages
    return (
      <Router basename="/bank-of-react-example-code-gh-pages">
        <div>
          <Route exact path="/" render={HomeComponent}/>
          <Route exact path="/userProfile" render={UserProfileComponent}/>
          <Route exact path="/login" render={LogInComponent}/>
          <Route exact path="/credits" render={CreditsComponent}/>
          <Route exact path="/debits" render={DebitsComponent}/>
        </div>
      </Router>
    );
  }
}

export default App;