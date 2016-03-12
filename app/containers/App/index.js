/**
 *
 * App.react.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';

import Img from 'Img';
import Footer from 'Footer';
import Logo from './logo.png';
import A from 'A';

import styles from './styles.css';

function App(props) {
  return (
    <div className={ styles.wrapper }>
      { props.children }
    </div>
  );
}

export default App;
