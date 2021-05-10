import React, { Component } from "react";
import axios from "axios";
export default class CreateUser extends Component {
  state = {
    users: [],
    username: "",
  };

  OnChangeUserName = (e) => {
    this.setState({
      username: e.target.value,
    });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({ username: "" });
    await axios.post("http://localhost:4000/api/users", {
      username: this.state.username,
    });
    this.getUser();
  };

  async componentDidMount() {
    this.getUser();
  }

  getUser = async () => {
    const res = await axios.get("http://localhost:4000/users");
    this.setState({ users: res.data });
  };

  deleteUser = async (id) => {
    await axios.delete(`http://localhost:4000/api/users/${id}`);
    this.getUser();
  };

  render() {
    return (
      <div className="row">
        <div className="col-md-4">
          <div className="card card-body">
            <h3>Create new User</h3>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Hola"
                  value={this.state.username}
                  onChange={this.OnChangeUserName}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-8">
          <ul className="list-group">
            {this.state.users.map((user) => (
              <li
                className="list-group-item list-group-item-action"
                key={user._id}
                onDoubleClick={() => this.deleteUser(user._id)}
              >
                {user.username}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
