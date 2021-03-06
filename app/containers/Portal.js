import './portal.css';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { login, signup, authenticateUser } from '../api/security';
import {
    Form,
    Button,
    FormControl,
    FormGroup,
    ControlLabel,
    ButtonGroup,
} from 'react-bootstrap';

import { grantAuthority, setUser } from '../redux/actions';

class Portal extends Component {
    state = {
        errors: {},
        username: '',
        password: '',
        redirectToReferrer: false,
    };

    pass = (token, username) => {
        authenticateUser(token);
        this.props.grantAuthority({
            authenticated: true,
            username,
        });
        this.setState({
            redirectToReferrer: true,
        });
    };

    authenticateLoginAttempt = e => {
        e.preventDefault();
        const { username, password, failureAttempts } = this.state;

        login(
            encodeURIComponent(username),
            encodeURIComponent(password),
            ({ data }) => {
                if (!data) {
                    if (failureAttempts >= 3) {
                        // set locked cookie.
                        // redirect to some messed up website.
                    } else {
                        this.setState({
                            error: 'User not found',
                            failureAttempts: failureAttempts + 1,
                        });
                    }
                } else {
                    this.pass(data.token, username);
                }
            },
        );
    };

    authenticateSignupAttempt = e => {
        e.preventDefault();
        const { username, password } = this.state;

        signup(
            encodeURIComponent(username),
            encodeURIComponent(password),
            ({ data }) => {
                if (data) {
                    this.pass(data.token, username);
                } // TODO: add else for failures
            },
        );
    };

    render() {
        const { username, password, redirectToReferrer } = this.state;
        return redirectToReferrer
            ? <Redirect to="/" />
            : <div style={{ height: '100%' }}>
                  <Form className="login-container">
                      <FormGroup>
                          <ControlLabel>Username: </ControlLabel>
                          <FormControl
                              id="username"
                              value={username}
                              onChange={e =>
                                  this.setState({ username: e.target.value })}
                          />
                      </FormGroup>
                      <FormGroup>
                          <ControlLabel>Password: </ControlLabel>
                          <FormControl
                              id="password"
                              value={password}
                              type="password"
                              onChange={e =>
                                  this.setState({ password: e.target.value })}
                          />
                      </FormGroup>

                      <ButtonGroup>
                          <Button
                              onClick={this.authenticateLoginAttempt}
                              bsStyle="primary"
                          >
                              Login
                          </Button>
                          <Button onClick={this.authenticateSignupAttempt}>
                              Signup
                          </Button>
                      </ButtonGroup>
                  </Form>
              </div>;
    }
}

Portal.propTypes = {
    grantAuthority: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
    location: PropTypes.object,
};

const mapStateToProps = ({ authenticated }) => ({
    authenticated,
});

const mapDispatchToProps = dispatch => ({
    grantAuthority: v => dispatch(grantAuthority(v)),
    setUser: v => dispatch(setUser(v)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Portal);
