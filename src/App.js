import React, { Component } from "react";
import { Switch, Link, Route, BrowserRouter as Router } from "react-router-dom";
import "./App.css";

import { Home, Navbar, SummonerPage } from "./components";
import { Provider } from "./context";

class App extends Component {
  render() {
    return (
      <Provider>
        <Router>
          <React.Fragment>
            <Navbar />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route
                exact
                path="/summoner/:summonerName"
                component={SummonerPage}
              />
            </Switch>
          </React.Fragment>
        </Router>
      </Provider>
    );
  }
}

export default App;
