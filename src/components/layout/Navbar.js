import React, { Component } from "react";
import Axios from 'axios'
import {withRouter , Link} from 'react-router-dom'
import { escape } from "../../util/escape";
import { searchSummoner } from "../../api/Lolapi";
import { isEmpty } from "../../validation/is-empty";

const CancelToken = Axios.CancelToken;
const source = CancelToken.source();

class Navbar extends Component {
  state = {
    searchInput: ""
  };

  onChange = e => {
    let input = escape(e.target.value, true, true);
    this.setState({ searchInput: input });
  };

  onSubmit = event => {
    event.preventDefault();
    if (!this.props.value.dispatch || isEmpty(this.state.searchInput)) return;
    
    
    searchSummoner(
      this.state.searchInput,
      this.props.value.dispatch,
      source
    );

    this.props.history.push(`/summoner/${this.state.searchInput}`);
    this.setState({ searchInput: "" });
  };


  render() {
    return (
      <nav className="navbar navbar-dark bg-dark">
        <Link to={'/'}  className="navbar-brand mb-0 h1 " >Summoner Portal</Link>
        <form className="form-inline my-2 my-lg-0" onSubmit={this.onSubmit}>
          <div className="input-group-append">
            <input
              className="form-control mr-sm-2"
              type="search"
              onChange={this.onChange}
              placeholder="Search Summoner"
              aria-label="Search"
              value={this.state.searchInput}
            />
            <button className="btn btn-outline my-2 my-sm-0" type="submit">
              <i className="fas fa-search" />
            </button>
          </div>
        </form>
      </nav>
    );
  }
}

export default withRouter(Navbar);
