import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as journalActions from '../../../actions/journalActions';

import TextInput from '../../elements/TextInput';

class Journal extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.props.actions.loadJournalEntries();
  }

  render() {
    return (
      <div className="journal">

        <h1>Journal Entries</h1>

        {this.props.journal.map((entry, index) => {
          return (
            <div key={index}>
              {entry.content}
            </div>
          );
        })}

      </div>
    );
  }
}

Journal.propTypes = {
  actions: PropTypes.object.isRequired,
  journal: PropTypes.array.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    journal: state.journal
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions : bindActionCreators(journalActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Journal);
