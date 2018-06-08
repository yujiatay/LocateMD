import React, { Component } from 'react';

class TestPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      field1: '',
      field2: '',
      message: null
    };
  }

  onSubmit = event => {
    event.preventDefault();
    this.setState({ message: 'mushimush' });
  }

  render() {
    const { field1, field2, message } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={field1}
          onChange={event =>
            this.setState({ field1 : event.target.value})
          }
          type="text"
          placeholder="Field 1"
        />
        <input
          value={field2}
          onChange={event =>
            this.setState({ field2 : event.target.value})
          }
          type="text"
          placeholder="Field 2"
        />
        <button type="submit">
          Submit
        </button>

        {message && <p>{message}</p>}
      </form>
    );
  }
}

export default TestPage;