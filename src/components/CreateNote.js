import React, { Component } from "react";
import axios from "axios";
import Datepicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("es", es);

export default class CreateNote extends Component {
  state = {
    users: [],
    userSelected: "",
    title: "",
    description: "",
    date: new Date(),
    edit: false,
    _id: "",
  };

  async componentDidMount() {
    const res = await axios.get("http://localhost:4000/api/users");
    this.setState({
      users: res.data.map((user) => user.username),
      userSelected: res.data[0].username,
    });
    if (this.props.match.params.id) {
      const res = await axios.get(
        "http://localhost:4000/api/notes/" + this.props.match.params.id
      );
      this.setState({
        title: res.data.title,
        description: res.data.description,
        date: new Date(res.data.date),
        userSelected: res.data.author,
        edit: true,
        _id: this.props.match.params.id,
      });
    }
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const newNote = {
      title: this.state.title,
      description: this.state.description,
      date: this.state.date,
      author: this.state.userSelected,
    };
    if (this.state.edit) {
      await axios.put(
        "http://localhost:4000/api/notes/" + this.state._id,
        newNote
      );
    } else {
      await axios.post("http://localhost:4000/api/notes", newNote);
    }
    window.location.href = "/";
  };

  onInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onChangeDate = (date) => {
    this.setState({ date });
  };

  render() {
    return (
      <div className="col-md-6 offset-md-3">
        <div className="card card-body">
          <h3>Create a Note</h3>
          {/** SELECT USER*/}
          <div className="form-group">
            <h6>Select user</h6>
            <select
              className="form-control"
              name="userSelected"
              placeholder="Select User"
              onChange={this.onInputChange}
              value={this.state.userSelected}
            >
              {this.state.users.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <h6>Title</h6>
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              name="title"
              value={this.state.title}
              onChange={this.onInputChange}
              required
            />
          </div>

          <div className="form-group">
            <h6>Description</h6>
            <textarea
              name="description"
              className="form-control"
              value={this.state.description}
              onChange={this.onInputChange}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <Datepicker
              className="form-control"
              selected={this.state.date}
              onChange={this.onChangeDate}
              locale="es"
            />
          </div>
          <form onSubmit={this.onSubmit}>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </form>
        </div>
      </div>
    );
  }
}
