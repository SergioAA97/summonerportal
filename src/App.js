import React, { Component } from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

import { Home, SummonerPage } from "./components";
import Navbar from "./components/layout/Navbar";
import { Provider, Consumer } from "./context";

const SummonerPageWrapper = props => {
  return (
    <Consumer>
      {value => {
        return <SummonerPage value={{ ...value }} {...props} />;
      }}
    </Consumer>
  );
};

const NavbarWrapper = props => {
  return (
    <Consumer>
      {value => {
        return <Navbar value={value} {...props} />;
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
            <Route
              render={({ history }) => <NavbarWrapper history={history} />}
            />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route
                exact
                path="/summoner/:summonerName"
                component={SummonerPageWrapper}
              />
            </Switch>
          </React.Fragment>
        </Router>
      </Provider>
    );
  }
}

export default App;
