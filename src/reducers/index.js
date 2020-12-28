import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router'
import Settings from './Settings';
import CoronaApi from './CoronaApi';
import Covid19Api from './Covid19Api';
import Common from './Common';
import NovelCovid from './NovelCovid';


export default (history) => combineReducers({
  router: connectRouter(history),
  settings: Settings,
  coronaApi: CoronaApi,
  covid19Api: Covid19Api,
  common: Common,
  novelCovid: NovelCovid,
});
