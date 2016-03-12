/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import shouldPureComponentUpdate from 'react-pure-render/function';

import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";
import { createSelector } from 'reselect';
import usernameSelector from 'usernameSelector';
import reposSelector from 'reposSelector';
import loadingSelector from 'loadingSelector';
import errorSelector from 'errorSelector';

import {
  changeUsername,
} from './actions';

import {
  loadRepos,
} from '../App/actions';

import { Navbar, Input, ButtonToolbar, Button } from 'react-bootstrap';

import Logo from './beehive_logo.png';

export class HomePage extends React.Component {

  constructor(props){
    super(props)

    this.state =  {
        markers: [],
        position: {lat: 46.5, lon:6.5},
        range: 50
    }
  };

  componentWillMount() {
      var _this = this;
      navigator.geolocation.getCurrentPosition(function(position){

        _this.setState({
            markers: [],
            position: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
        });
      });

      // ADD EVENT MARKERS FETCHED HERE
  };

  showLoginModal() {
      this.refs.loginModal.show();
  };

  hideLoginModal() {
      this.refs.loginModal.hide();
  };

  showModal(){
        this.refs.modal.show();
  };
  hideModal(){
        this.refs.modal.hide();
  };

  /**
   * Changes the route
   *
   * @param  {string} route The route we want to go to
   */
  openRoute(route){
    this.props.changeRoute(route);
  };

  /**
   * Changed route to '/features'
   */
  openFeaturesPage(){
    this.openRoute('/features');
  };

  validationState() {
    if (this.state.value <= 0) return 'error';
    if (this.state.value > 200) return 'warning';
    return 'success';
  };

  handleChange() {
    this.setState({
      value: this.refs.input.getValue()
    });
  };

  render() {
    let mainContent = null;
    // Show a loading indicator when we're loading
    if (this.props.loading) {
      mainContent = (<List component={LoadingIndicator} />);
    // Show an error if there is one
    } else if (this.props.error !== false) {
      const ErrorComponent = () => (
        <ListItem content={'Something went wrong, please try again!'} />
      );
      mainContent = (<List component={ErrorComponent} />);
    // If we're not loading, don't have an error and there are repos, show the repos
    } else if (this.props.repos !== false) {
      mainContent = (<List items={this.props.repos} component={RepoListItem} />);
    }

    return (
      <div style={{height: "100%", width: "100%"}}>
        <div style={{height: "100%", width: "30%", float:"right"}}>
          <div>
            <ButtonToolbar>
              <Button bsStyle="primary" bsSize="large">Large button</Button>
              <Button bsSize="large">Large button</Button>
            </ButtonToolbar>
            <ButtonToolbar>
              <Button bsStyle="primary">Default button</Button>
              <Button>Default button</Button>
            </ButtonToolbar>
            <ButtonToolbar>
              <Button bsStyle="primary" bsSize="small">Small button</Button>
              <Button bsSize="small">Small button</Button>
            </ButtonToolbar>
            <ButtonToolbar>
              <Button bsStyle="primary" bsSize="xsmall">Extra small button</Button>
              <Button bsSize="xsmall">Extra small button</Button>
            </ButtonToolbar>
          </div>
          <Navbar id="search" style={{height: "100%", width:"100%"}}>
            <Navbar.Collapse>
              <Navbar.Form pullLeft>
                <Input
                  type="number"
                  value={this.state.range}
                  label="Search range"
                  bsStyle={this.validationState()}
                  hasFeedback
                  ref="input"
                  groupClassName="group-class"
                  labelClassName="label-class"
                  onChange={this.handleChange}
                />
              </Navbar.Form>
            </Navbar.Collapse>
          </Navbar>
        </div>
        <div style={{height: "100%", width: "70%"}}>

          <GoogleMapLoader
            containerElement={
              <div
                {...this.props}
                style={{
                  height: "100%",
                }}
              />
            }
            googleMapElement={
              <GoogleMap
                ref={(map) => console.log(map)}
                defaultZoom={12}
                defaultCenter={{lat: this.state.position.lat, lng: this.state.position.lon}}>
                {this.state.markers.map((marker, index) => {
                  return (
                    <Marker
                      {...marker}
                      onClick={this.showModal.bind(this)}/>
                    );
                  })
                }
              </GoogleMap>
              }
          />
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
    changeRoute: (url) => dispatch(push(url)),
    onSubmitForm: (evt) => {
      evt.preventDefault();
      dispatch(loadRepos());
    },
    dispatch,
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(createSelector(
  reposSelector,
  usernameSelector,
  loadingSelector,
  errorSelector,
  (repos, username, loading, error) => ({ repos, username, loading, error })
), mapDispatchToProps)(HomePage);
