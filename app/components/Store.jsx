const React = require("react");
const styled = require("styled-components").default;
//const UpdateForm = require("./UpdateForm");
const DeleteBtn = require("./DeleteBtn");
const Button = require("reactstrap");

//FIREBASE SETUP
var firebase = require("firebase");
var config = {
  apiKey: "AIzaSyCDLZW3WaIRXPXNTl5_oHZx0ZoRHO3je2s",
  authDomain: "store-people-tracker-9ae2c.firebaseapp.com",
  databaseURL: "https://store-people-tracker-9ae2c.firebaseio.com",
  projectId: "store-people-tracker-9ae2c",
  storageBucket: "store-people-tracker-9ae2c.appspot.com",
  messagingSenderId: "92695352752",
  appId: "1:92695352752:web:b904608f9dbfdb1845b275",
  measurementId: "G-SGCG2JLY41"
};
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
const db = firebase.firestore();

// STYLED COMPONENTS

const Div = styled.div`
  text-align: center;
`;

const Container = styled.div`
  border: solid;
  
  width: 23%;
  height: 10%;
  border-color: #FFB6C1;
  border-radius: 20pt;
  display: ${(props) => props.display ? "block" : "none"};
  float: left;
  text-align: center;
  margin: 1%;
  box-shadow: 10px 5px 5px #FFB6C1;
  background-color: white;

  @media (max-width: 1000px) {
    width: 40%;
    height: 10%;
    text-align: center;
  }
  @media (max-width: 650px) {
    width: 80%;
    height: 10%;
    text-align: center;
  }
`;

const Header = styled.h1`
  font-size: 150%;
  font-family: Century Gothic, CenturyGothic, AppleGothic, sans-serif; 
  color: black;
  text-align: center;
  font-weight: 300;
  font-style: bold;
`;

const Text = styled.h5`
  font-family: Century Gothic, CenturyGothic, AppleGothic, sans-serif; 
  color: black;
  font-weight: normal;
`;

const Text2 = styled.h5`
  font-family: Century Gothic, CenturyGothic, AppleGothic, sans-serif; 
  color: #FFB6C1;
  font-weight: normal;
`;

const Number = styled.h1`
  font-size: 300%;
  line-height: 50%;
  color: #FFB6C1;
  font-style: bold;
  text-align: center;
`;

const Form = styled.form`
  background-color: #FFB6C1;
  line-height: 120%;
  display: inline-block;
`;

/* individual store component that displays information about this store */
class Store extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: this.props.address,
      lastUpdated: this.props.lastUpdated,
      name: this.props.name,
      numberOfPeople: parseInt(this.props.numberOfPeople),
      phoneNumber: this.props.phoneNumber,
     // hoursOpen: this.props.hoursOpen,
      display: true,
      value: ""
    };
  }

  /** handleChange(event) {
    this.setState({ value: event.target.value });
  }**/

  handleClick(event) {

    //update numberOfPeople on page and in database
    var storeRef = db.collection("Stores").doc(this.state.address);
    if (event.target.id == "checkIn") {
      //alert("checkedIn");
      this.setState((prevState) =>{ return {numberOfPeople: prevState.numberOfPeople+1}}); 
      storeRef.update({
        numberOfPeople: this.state.numberOfPeople + 1 //+1 still needed because of async?
      });
    } else if (event.target.id == "checkOut"){
      //alert("checkedOut");
      if (this.state.numberOfPeople > 0){
        this.setState((prevState) =>{ return {numberOfPeople: prevState.numberOfPeople-1}}); 
        storeRef.update({
          numberOfPeople: this.state.numberOfPeople - 1 //-1 still needed because of async?
        });
      }
    }
    
    

    // resetting the state once it has been submitted
    /**this.setState({
      value: null
    });**/

    //update time lastUpdated on page and in database
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    var d = new Date();
    var date =
      dayNames[d.getDay()] +
      ", " +
      monthNames[d.getMonth()] +
      ", " +
      d.getDate() +
      ", " +
      (d.getYear() + 1900);
    var time =
      (d.getHours() % 12 == 0 ? 12 : d.getHours() % 12) +
      ":" +
      (d.getMinutes() < 10 ? "0" : "") +
      d.getMinutes() +
      " " +
      (d.getHours() > 11 ? "PM" : "AM");
    this.setState({ lastUpdated: date + " " + time });
    db.collection("Stores")
      .doc(this.state.address)
      .update({ lastUpdated: date + " " + time });
    event.preventDefault();
  }
  
  getName(){
    return this.state.name;
  }

  render() {
    return (
      <Div>
        <Container display = {this.state.display}>
          <Header>
            <b>{this.state.name}</b>
          </Header>
          <hr></hr>
          

          <Number>{this.state.numberOfPeople}</Number>
          <Text2>people are currently here.</Text2>
          <Text>Last updated {this.state.lastUpdated}</Text>
          <hr></hr>

          <Text>
            <b>Address: </b>
            {this.state.address}
          </Text>
          <Text>
            <b>Phone Number: </b>
            {this.state.phoneNumber}
          </Text>

          <button style = {{padding: '1%'}} type = "button" id = "checkIn" onClick = {this.handleClick.bind(this)}>Check In</button>
          <button style = {{padding: '1%'}} type = "button" id = "checkOut" onClick = {this.handleClick.bind(this)}>Check Out</button>
          
          <DeleteBtn address={this.state.address}></DeleteBtn>
        </Container>
      </Div>
    );
  }
}

module.exports = Store;