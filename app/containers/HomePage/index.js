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

import ExpandableNav from 'react-expandable-nav';
var {ExpandableNavContainer, ExpandableNavbar, ExpandableNavHeader,
      ExpandableNavMenu, ExpandableNavMenuItem, ExpandableNavPage,
      ExpandableNavToggleButton} = ExpandableNav;


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
import bootstrap from 'bootstrap/dist/css/bootstrap.css'

export class HomePage extends React.Component {

  constructor(props){
    super(props)
    navigator.geolocation.getCurrentPosition(function(position){
        alert(position.coords.latitude);
        alert(position.coords.longitude);
    });
    this.state =  {
        markers: [{
            position: {
                lat: 35,
                lng: 46,
            },
            key: "Lausanne",
            defaultAnimation: 2,
        }],
    }
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

    //Menu items
    var header = {
      small: <span className="logo">R</span>,
      full: <span>React</span>
    };
    var menuItems = {
      small: [<span className="glyphicon glyphicon-user"></span>, <span className="glyphicon glyphicon-user"></span>],
      full: [<span>Home</span>, <span>About us</span>, <span>Contact us</span>]
    };

    return (
      <div style={{height: "100%"}}>
      <Modal ref="modal">
        <h2>I am a dialog</h2>
        <button onClick={this.hideModal.bind(this)}>Close</button>
      </Modal>

      <ExpandableNavContainer>
        <ExpandableNavbar>
          <ExpandableNavHeader small={header.small} full={header.full} />
          <ExpandableNavMenu>
            <ExpandableNavMenuItem small={menuItems.small[0]} full={menuItems.full[0]} url='/home/' />
            <ExpandableNavMenuItem small={menuItems.small[1]} full={menuItems.full[1]} url='/about/' />
          </ExpandableNavMenu>
        </ExpandableNavbar>
        <ExpandableNavToggleButton />
        <ExpandableNavPage>
          <p>Hello world</p>
        </ExpandableNavPage>
      </ExpandableNavContainer>

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
            defaultZoom={3}
            defaultCenter={{lat: -25.363882, lng: 131.044922}}>
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
