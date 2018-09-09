import React, { Component } from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import "./App.css";

import { Home, Navbar, SummonerPage } from "./components";
import { Provider, Consumer } from "./context";

const SumPage = props => {
  return (
    <Consumer>
      {value => {
        return <SummonerPage value={{ ...value }} {...props} />;
      }}
    </Consumer>
  );
};

class App extends Component {
  render() {
    return (
      <Provider>
        <Router>
          <React.Fragment>
            <Navbar />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/summoner/:summonerName" component={SumPage} />
            </Switch>
          </React.Fragment>
        </Router>
      </Provider>
    );
  }
}

export default App;
