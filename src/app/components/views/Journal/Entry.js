import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as journalActions from '../../../actions/journalActions';

import EntryForm from './components/EntryForm';

class Entry extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      entry: Object.assign({}, props.entry),
      errors: {}
    };

    this.updateState = this.updateState.bind(this);
  }

  updateState(e) {
    const field = e.target.id;
    let entry = this.state.entry;
    entry[field] = e.target.value;
    return this.setState({ entry });
  }

  render() {
    const { entry, errors } = this.state;
    return (
      <div className="entry">
        <h1>Manage Course</h1>
        <EntryForm
          entry={this.state.entry}
          errors={this.state.errors}
          onChange={this.updateState}
          />
      </div>
    );
  }
}

Entry.propTypes = {
  entry: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  let entry = {
    content: '',
    type: 'journal'
  };

  return {
    entry
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(journalActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Entry);
