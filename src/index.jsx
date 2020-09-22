import * as $ from 'jquery';
import React from 'react';
import {render} from 'react-dom';

import Post from '@models/Post';
import './babel';

import json from './assets/json';
import xml from './assets/data.xml';
import csv from './assets/data.csv';

import WebpackLogo from './assets/webpack.logo.png'

import './styles/styles.css';
import './styles/less.less';
import './styles/scss.scss';

const post = new Post('Webpack post title', WebpackLogo);

//$('pre').addClass('code').html(post.toString());
//console.log('Post to String:', post.toString());

console.log('JSON:', json);
console.log('XML: ', xml);
console.log('CSC', csv);

const App = () => (
  <div className="container">
    <h1>Webpack Course</h1>

    <hr />

    <div className="logo"></div>

    <hr />

    <pre />

    <div className="box">
      <h2>Less</h2>
    </div>

    <div className="card">
      <h2>Scss</h2>
    </div>
  </div>
);

render(<App/>, document.getElementById('app'));