import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import jwt_decode from "jwt-decode"; - Remove jwt decode
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";

import { secretOrKey } from "./config/keys"; // import secretOrKey
import jsonwebtoken from "jsonwebtoken"; // install and import jwt



import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";

import "./App.css";

if (localStorage.jwtToken) {
	const token = localStorage.jwtToken; 
	jsonwebtoken.verify(token.slice(7), secretOrKey, function (err, decoded) { // check if it is a valid jwt that server has sent
		if (err) {
			localStorage.removeItem("jwtToken"); // remove if not 
		} else {
			setAuthToken(token); 
			store.dispatch(setCurrentUser(decoded)); // set the auth state with a confirmed jwt 

			const currentTime = Date.now() / 1000;
			if (decoded.exp < currentTime) {
				store.dispatch(logoutUser());

				window.location.href = "./login";
			}
		}
	});
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}
export default App;
