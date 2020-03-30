const React = require("react");
const styled = require("styled-components").default;
const Store = require("./Store");

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

const Button = styled.button`
  margin-left: 45%;
  margin-right: 45%;
  margin-top: 3%;
  padding: 1%;
`;
//Photo by Samvidh Ramanathan on Unsplash
const Div = styled.div`
  background: linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url(https://cdn.glitch.com/48b7a244-8d1d-4242-8f89-c81121ed3445%2Fsamvidh-ramanathan-9PaGKXIPUHQ-unsplash.jpg?v=1585514185850);
  background-size: 100% 100%;
  vertical-align: middle;
  height: 700px;
  @media (max-width: 650px) {
    background-size: 100% 50%;
  }
  @media (max-width: 450px) {
    background-size: 100% 50%;
    height: 850px;
  }
`;

const Input = styled.input`
  width: 60%;
  text-align: center;
  margin-left: 20%;
  margin-right: 20%;
  @media (max-width: 400px) {
    width: 80%;
    margin-left: 10%;
    margin-right: 10%;
  }
`;

const H1 = styled.h1`
  font-size: 80px;
  font-family: Century Gothic, CenturyGothic, AppleGothic, sans-serif; 
  color: white;
  text-align: center;
  margin-left: 25%;
  margin-right: 25%;
  padding-top: 6%;
  @media (max-width: 1200px) {
    margin-left: 20%;
    margin-right: 20%;
    font-size: 40px;
  }
`;

const H3 = styled.h3` 
  font-family: Century Gothic, CenturyGothic, AppleGothic, sans-serif; 
  color: #bb9cd9;
  text-align: center;
  margin-left: 35%;
  margin-right: 35%;
  @media (max-width: 650px) {
    margin-left: 23%;
    margin-right: 23%;
  }
`;

const Text = styled.h2`
  text-align: justify;
  margin-left: 20%;
  margin-right: 20%;
  margin-bottom: 5%;
  font-weight: normal;
  color: white;
  @media (max-width: 650px) {
    margin-left: 2%;
    margin-right: 2%;
  }
`;

const Form = styled.form`
  background-color: #FFB6C1;
  margin-left: 38%;
  margin-right: 38%;
  @media (max-width: 650px) {
    margin-left: 1%;
    margin-right: 0%;
  }
  margin-top: 2%;
`;

/* the main page for the index route of this app */
class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      rendered: false,
      storeList: [], // displayed list
      //masterStoreList : [], // list of all stores from database
      storeNames: [], // list of all store names from database
      storeAddresses: [], // list of all store addresses from database
      name: "",
      address: "",
      phoneNumber: "",
      //hoursOpen: "",
      numberOfPeople: 0,
      displayForm: false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleSubmit(evt) {
    event.preventDefault();

    //get current date and time
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
      (d.getHours() % 12) +
      ":" +
      (d.getMinutes() < 10 ? "0" : "") +
      d.getMinutes() +
      " " +
      (d.getHours() > 11 ? "PM" : "AM");

    db.settings({
      timestampsInSnapshots: true
    });

    const storeRef = db
      .collection("Stores")
      .doc(this.state.address)
      .set({
        name: this.state.name,
        address: this.state.address,
        phoneNumber: this.state.phoneNumber,
        //hoursOpen: this.state.hoursOpen,
        numberOfPeople: this.state.numberOfPeople,
        lastUpdated: date + " " + time
      });

    this.setState({
      name: "",
      address: "",
      phoneNumber: "",
      //hoursOpen: "",
      numberOfPeople: 0
    });

    window.location.reload();
  }
  
  handleSearch(evt){
    event.preventDefault();
    var UniqueStoreNames = [];
    var searchStr = event.target.value;
      //alert(searchStr);
    
    this.setState({storeList : []});
    var array = [];
      for (let i = 0; i < this.state.storeNames.length; i++){
        array = [];
       // alert(this.state.storeNames[i])
        if (this.state.storeNames[i].toLocaleLowerCase().includes(searchStr.toLocaleLowerCase())){
          //var item = this.state.masterStoreList[i];
          //alert(i + " " + this.state.masterStoreList[i] + " " + searchStr);
          
           db.collection("Stores")
          .where ("name", "==", this.state.storeNames[i])
          .get()
          .then(querysnapshot => {
            const docSnap = querysnapshot.docs;
            querysnapshot.docs.forEach(doc => {

                var address = doc.get("address");
                var lastUpdated = doc.get("lastUpdated");
                var name = doc.get("name");
                var numberOfPeople = doc.get("numberOfPeople");
                var phoneNumber = doc.get("phoneNumber");
               // var hoursOpen = doc.get("hoursOpen");

                array.push(
                  <Store
                    address={address}
                    lastUpdated={lastUpdated}
                    name={name}
                    numberOfPeople={numberOfPeople}
                    phoneNumber={phoneNumber}
                   // hoursOpen={hoursOpen}
                  ></Store>
                );
            });
            this.setState(prevState => ({
                storeList: prevState.storeList.concat(array)
            }));
            array = [];
          });
          //tempStores.push(item);
        }
        
      }

  }
  
  

  componentDidMount() {
    var array = [];
    var arrayNames = [];
    db.collection("Stores")
      .get()
      .then(querysnapshot => {
        const docSnap = querysnapshot.docs;
        querysnapshot.docs.forEach(doc => {
          var address = doc.get("address");
          var lastUpdated = doc.get("lastUpdated");
          var name = doc.get("name");
          var numberOfPeople = doc.get("numberOfPeople");
          var phoneNumber = doc.get("phoneNumber");
          var hoursOpen = doc.get("hoursOpen");

          array.push(
            <Store
              address={address}
              lastUpdated={lastUpdated}
              name={name}
              numberOfPeople={numberOfPeople}
              phoneNumber={phoneNumber}
              hoursOpen={hoursOpen}
            ></Store>
          );

          // array stores only unique names for easier filtering later one
          if (!arrayNames.includes(name)){
            arrayNames.push(name);
          }

          //storeList.push(<Store address = {address} lastUpdated = {lastUpdated} name = {name}
          //numberOfPeople = {numberOfPeople} phoneNumber = {phoneNumber} hoursOpen = {hoursOpen}></Store>);
        });
        this.setState(prevState => ({
          storeList: array,
          //masterStoreList: array,
          storeNames: arrayNames
        }));
      });
  }
  
  displayForm(){
    if (this.state.displayForm == false){
      this.setState({
            displayForm: true
      });
    }
    else{
      this.setState({
            displayForm: false
      });
    }
  }

  render() {
    return (
      <div>
        <Div>
          <H1>Covid-19 Store Tracker</H1>

          <Text>
            Next time you're shopping for groceries or picking up supplies at a store, take a moment to let people know that you're there by clicking "Check In". 
            When you leave, click "Check Out". The more people that update this app, the better we will be able to help the elderly and vulnerable avoid crowded stores!
          </Text>
          
          <Input
            type="text"
            onChange = {this.handleSearch.bind(this)}/>
          <Input type = "submit" value = "🔎 Search Stores by Name" placeholder = "search stores"/>
          
          <Button onClick = {this.displayForm.bind(this)}>Add New Store</Button>
        </Div>
        
        <div>
          {this.state.displayForm? 
            <Form onSubmit={this.handleSubmit.bind(this)}>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
                required="required"
              />

              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={this.state.address}
                onChange={this.handleChange}
                required="required"
              />

              <label>Phone Number:</label>
              <input
                type="text"
                name="phoneNumber"
                value={this.state.phoneNumber}
                onChange={this.handleChange}
                required="required"
              />

              <label>Number of People:</label>
              <input
                type="number"
                name="numberOfPeople"
                value={this.state.numberOfPeople}
                onChange={this.handleChange}
                required="required"
              />
              <input type = "submit" value = "Add"/>
            </Form>
            : null
          }
        </div>
  
        {this.state.storeList.length == 0 ? <Text style = {{color: 'black'}}>No stores with this name exist. Clear your search and re-type the store slowly. If the store still does not come up, feel free to add it!</Text> 
          : this.state.storeList}
       
      </div>
    );
  }
}

module.exports = MainPage;

