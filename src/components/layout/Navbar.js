import React, { Component } from "react";
import { escape } from "../../util/escape";
import { searchSummoner } from "../../api/Lolapi";

class Navbar extends Component {
  state = {
    searchInput: "",
    redirect: false
  };

  onChange = e => {
    let input = escape(e.target.value, true, true);
    this.setState({ searchInput: input });
  };

  onSubmit = event => {
    event.preventDefault();
    if (!this.props.value.dispatch) return;
    this.setState({ searchInput: "" });
    searchSummoner(
      this.state.searchInput,
      this.props.value.dispatch,
      this.props.history.push(`/summoner/${this.state.searchInput}`)
    );
  };
  render() {
    return (
      <nav className="navbar navbar-dark bg-dark">
        <span className="navbar-brand mb-0 h1 ">Summoner Portal</span>
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

export default Navbar;
