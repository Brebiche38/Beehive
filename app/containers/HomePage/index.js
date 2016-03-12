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
import Modal from "boron/FadeModal";
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

import Button from 'Button';
import H1 from 'H1';
import List from 'List';
import ListItem from 'ListItem';
import RepoListItem from 'RepoListItem';
import LoadingIndicator from 'LoadingIndicator';

import styles from './styles.css';

import Logo from './logoBeeHive.png';

export class HomePage extends React.Component {

  constructor(props){
    super(props)

    this.state =  {
        markers: [{
            position: {
                lat: 46.6,
                lng: 6.5,
            },
            key: "Lausanne",
            defaultAnimation: 2,
        }],
    }
  };

  componentDidMount() {
      this.showLoginModal();
      var _this = this;
      navigator.geolocation.getCurrentPosition(function(position){

        _this.setState({
            markers: [{
            position: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            },
            key: "userPosition",
            defaultAnimation: 2,
        }],
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
      <div style={{height: "100%"}}>
      <Modal ref="modal">
        <h2>I am a dialog</h2>

        <button onClick={this.hideModal.bind(this)}>Close</button>

      </Modal>

      <Modal ref="loginModal">

         <div>
            <img src={Logo} height="100" width="100"/>
            <h2>BeeHive</h2>
         </div>

        <button onClick={this.hideLoginModal.bind(this)}>Close</button>
      </Modal>

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
            defaultCenter={{lat: 46.6, lng: 6.5}}>
            {this.state.markers.map((marker, index) => {
              return (
                <Marker
                  {...marker}
                  onClick={this.showModal.bind(this)}/>
              );
            })}
          </GoogleMap>
        }
      />
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
