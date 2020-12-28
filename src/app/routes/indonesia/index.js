import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import asyncComponent from '../../../util/asyncComponent';

const Indonesia = ({match}) => (
  <div className="app-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`}/>
      <Route path={`${match.url}/dashboard`} component={asyncComponent(() => import('./routes/dashboard'))}/>
      {/* <Route component={asyncComponent(() => import('../../../app/routes/extraPages/routes/404'))}/> */}
      <Route component={asyncComponent(() => import('components/Error404'))}/>
    </Switch>
  </div>
);

export default Indonesia;