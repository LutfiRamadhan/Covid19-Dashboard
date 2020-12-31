import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import asyncComponent from '../../../util/asyncComponent';

const WorldWide = ({match}) => (
  <div className="app-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`}/>
      <Route path={`${match.url}/dashboard`} component={asyncComponent(() => import('./routes/dashboard'))}/>
      <Route path={`${match.url}/datatable`} component={asyncComponent(() => import('./routes/datatable'))}/>
      <Route component={asyncComponent(() => import('components/Error404'))}/>
    </Switch>
  </div>
);

export default WorldWide;