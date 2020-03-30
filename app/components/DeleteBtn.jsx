const React = require("react");
const ReactDOM = require("react-dom");
const styled = require("styled-components").default;

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
  margin: 3%;
  padding: 1%;
`;

class DeleteBtn extends React.Component {
  constructor() {
    super();
  }

  handleClick(event) {
    event.preventDefault();
    var result = confirm("Are you sure you want to delete this store?\nPlease do not delete unless you're a store owner or trusted employee.");
    //alert(result);
    if (result){
      db.collection("Stores").doc(this.props.address).delete().then(function() {
      //alert("Document successfully deleted!");
      }).catch(function(error) {
      //alert("Error removing document: ", error);
      });
      window.location.reload();
    }
  }

  render() {
    return (
      <div>
        <Button onClick = {this.handleClick.bind(this)}>Delete</Button>
      </div>
    );
  }
}

module.exports = DeleteBtn;