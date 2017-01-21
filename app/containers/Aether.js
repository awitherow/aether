import './Aether.css'
import Portal from './Portal'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import * as entryService from '../api/entries'

import { toTitleCase } from '../lib/helpers'
import { categories } from '../lib/schema'

import Overlay from '../components/elements/Overlay'
import Header from '../components/elements/Header'
import AddEntry from '../components/elements/AddEntry'

import Editor from '../components/views/Editor'
import Notes from '../components/views/Notes'
import Journal from '../components/views/Journal'
import Search from '../components/views/Search'
import Habit from '../components/views/Habit'
import Exercise from '../components/views/Exercise'
import Financials from '../components/views/Financials'

import { Panel, Glyphicon, Button, DropdownButton, MenuItem } from 'react-bootstrap'

import {
  toggleLoading,
  grantAuthority,
  setUser,
  setType,
  openEditor,
  closeEditor,
  toggleSearch,
} from '../redux/actions'

import { isUserAuthenticated, deauthenticateUser } from '../api/security'

class Aether extends Component {
  static childContextTypes = {
    getEntries: PropTypes.func,
  }

  static propTypes = {
    // redux dispatchers
    grantAuthority: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
    toggleLoading: PropTypes.func.isRequired,
    toggleSearch: PropTypes.func.isRequired,
    closeEditor: PropTypes.func.isRequired,
    setType: PropTypes.func.isRequired,
    openEditor: PropTypes.func.isRequired,
    // redux state
    currentType: PropTypes.string.isRequired,
    authenticated: PropTypes.bool.isRequired,
    user: PropTypes.string.isRequired,
    editor: PropTypes.shape({
      hidden: PropTypes.bool.isRequired,
      note: PropTypes.object.isRequired,
    }).isRequired,
    loading: PropTypes.bool.isRequired,
    searching: PropTypes.bool.isRequired,
  }

  state = {
    entries: [],
  }

  componentDidMount = () => {
    const { authenticated, user } = this.props
    this.getEntries(authenticated, user)

  }

  componentWillRecieveProps(nextProps) {
    const { authenticated, user } = nextProps
    this.getEntries(authenticated, user)
  }

  getEntries = (authenticated, user) => {
    if (authenticated && user) {
      !this.props.loading && this.props.toggleLoading(true)
      entryService.get(this.props.user, ({ data }) => {
        this.setState({ entries: data })
        this.props.loading && this.props.toggleLoading(false)
      })
    }
  }

  removeItem = (id) =>
    entryService.remove(id, this.props.user, () => this.getEntries())

  editItem = (id) => {
    const { entries } = this.state
    let note = entries.filter(note => note.id === id)[0]
    if (!note) return
    this.props.openEditor(note)
  }

  submitEdit = (edits, orig = this.props.editor.note) =>
    entryService.update(Object.assign(orig, edits), this.props.user, () =>
      this.getEntries()
    )

  route = () => {
    const { entries } = this.state
    const { currentType, user } = this.props
    const sharedProps = {
      type: currentType,
      user,
      entries: entries.filter(entry => entry.type === currentType),
      editItem: this.editItem,
      getEntries: this.getEntries,
    }

    switch(currentType) {
      case 'note': return <Notes {...sharedProps} />
      case 'journal': return <Journal {...sharedProps} />
      case 'finance': return <Financials {...sharedProps} />
      case 'habit': return (
        <Habit {...sharedProps} submitEdit={this.submitEdit} />
      )
      case 'exercise': return (
        <Exercise {...sharedProps} submitEdit={this.submitEdit} />
      )
    }
  }

  render() {
    const { user, authenticated, loading, editor, currentType, searching } = this.props

    return !(isUserAuthenticated && user && authenticated) ? <Portal /> : (
      <div className="aether">

        { loading ? <Overlay type="loading" /> : null }

        { searching ? (
          <Search
            entries={this.state.entries}
            editItem={this.editItem}
            toggleSearch={this.props.toggleSearch}
            submitEdit={this.submitEdit}
          />
        ) : null }

        <Header
          currentType={currentType}
          setType={this.props.setType}
          toggleSearch={this.props.toggleSearch}
          logout={() => {
            deauthenticateUser()
            this.props.setUser(null)
            this.props.grantAuthority(false)
          }}
          />

        <div className="inner">

          <div id="quick-input">
            <AddEntry
              type={currentType}
              toggleLoading={this.props.toggleLoading}
              getEntries={this.getEntries}
              user={this.props.user}
              />
          </div>

          <Editor
            hidden={editor.hidden}
            note={editor.note}
            onSubmit={this.submitEdit}
            onClose={this.props.closeEditor}
            onRemove={this.removeItem}
            toggleLoading={this.props.toggleLoading}
            />

          <Panel style={{display: !editor.hidden && 'none'}} header={
            <div>
              <div className="spread-icon-right">
                <DropdownButton
                  title={toTitleCase(currentType)}
                  id="change-view"
                >
                  {Object.keys(categories).map((type, i) =>
                    <MenuItem
                      key={i}
                      active={currentType === type}
                      onSelect={() => {
                        this.props.setType(type)
                      }}
                    >
                      {toTitleCase(type)}
                    </MenuItem>
                  )}
                </DropdownButton>
                <Button
                  className="float-btn"
                  bsSize="xsmall"
                  onClick={this.getEntries}
                >
                  <Glyphicon glyph="refresh" />
                </Button>
              </div>
            </div>
            }>
            {this.route()}
          </Panel>

        </div>

      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  toggleLoading: (v) => dispatch(toggleLoading(v)),
  toggleSearch: (v) => dispatch(toggleSearch(v)),
  grantAuthority: (v) => dispatch(grantAuthority(v)),
  setUser: (v) => dispatch(setUser(v)),
  setType: (v) => dispatch(setType(v)),
  openEditor: (v) => dispatch(openEditor(v)),
  closeEditor: (v) => dispatch(closeEditor(v)),
})

const mapStateToProps = ({
  currentType, authenticated, user, editor, loading, searching,
}) => ({
  currentType,
  authenticated,
  user,
  editor,
  loading,
  searching,
})

const ConnectedAether = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Aether)

export default ConnectedAether
