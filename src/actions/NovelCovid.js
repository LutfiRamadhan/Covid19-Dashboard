//corona.lmao.ninja/v2

import {
    FETCH_ERROR,
    FETCH_START,
    FETCH_SUCCESS,
    INIT_URL,
    GET_SUMMARY_NOVEL_COVID,
    GETTING_READY_TO_GET_SUMMARY_NOVEL_COVID,
    SUMMARY_NOVEL_COVID_READY,
    GET_TIMELINE_NOVEL_COVID,
    GETTING_READY_TO_GET_TIMELINE_NOVEL_COVID,
    TIMELINE_NOVEL_COVID_READY,
    GETTING_READY_TO_GET_DATA_COUNTRY_NOVEL_COVID,
    GET_DATA_COUNTRY_NOVEL_COVID,
  } from "../constants/ActionTypes"
import axios from 'axios';
import { AllInclusiveSharp } from "@material-ui/icons";

  
  export const setInitUrl = (url) => {
    return {
      type: INIT_URL,
      payload: url
    }
  }

  const api = axios.create({
    baseURL: `https://corona.lmao.ninja/v2`,//YOUR_API_URL HERE
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  export const getSummary = () => {
    return (dispatch) => {
      dispatch({type: FETCH_START})
      dispatch({type: GETTING_READY_TO_GET_SUMMARY_NOVEL_COVID})
      api.get(`/all`).then(({data}) => {
        if (data) {
            dispatch({type: FETCH_SUCCESS})
            dispatch({type: GET_SUMMARY_NOVEL_COVID, payload: data})
        } else {
          dispatch({type: FETCH_ERROR, payload: data.error})
        }
      }).catch(function (error) {
        console.log("Error****:", error.message)
      })
    }
  }

  export const getTimeline = ({lastday}) => {
    if (lastday === undefined || lastday === null) {
        lastday = "all";
    }
    return (dispatch) => {
        dispatch({type: GETTING_READY_TO_GET_TIMELINE_NOVEL_COVID})
      dispatch({type: FETCH_START})
      let chartData = []
      let tmpConfirmed = [],
          tmpRecovered = [],
          tmpDeaths = []
      api.get(`/historical/all?lastdays=${lastday}`).then(({data}) => {
        if (data.cases && data.recovered && data.deaths) {
          dispatch({type: FETCH_SUCCESS})
          tmpConfirmed = Object.entries(data.cases).map((v, i) => {
            const datetime = new Date(v[0]).getTime();
            return [datetime, parseInt(v[1])];
          });
          tmpRecovered = Object.entries(data.recovered).map((v, i) => {
            const datetime = new Date(v[0]).getTime();
            return [datetime, parseInt(v[1])];
          });
          tmpDeaths = Object.entries(data.deaths).map((v, i) => {
            const datetime = new Date(v[0]).getTime();
            return [datetime, parseInt(v[1])];
          });
        //   console.log(tmpConfirmed)
          chartData = [{
            name: 'Confirmed',
            data: tmpConfirmed.sort((a, b) => a[0] < b[0] ? 1 : -1),
            cropThreshold: 9999,
          } , {
            name: 'Recovered',
            data: tmpRecovered.sort((a, b) => a[0] < b[0] ? 1 : -1),
            cropThreshold: 9999,
          }, {
            name: 'Deaths',
            data: tmpDeaths.sort((a, b) => a[0] < b[0] ? 1 : -1),
            cropThreshold: 9999,
          }]
          dispatch({type: GET_TIMELINE_NOVEL_COVID, payload: chartData})
          dispatch({type: FETCH_SUCCESS})
        } else {
          dispatch({type: FETCH_ERROR, payload: data.error})
        }
      }).catch(function (error) {
        console.log("Error****:", error.message)
      })
    }
  }
  
  export const getDataCountries = ({country, sort}) => {
      let filter = []; 
      let specific = '';
      if(country !== undefined && country !== null) {
          specific = `/${country}`;
      }
      if (sort !== undefined && sort !== null) {
          filter.push(`sort=${sort}`);
      }
      if(filter.length > 0) {
          filter = filter.join('&')
      }
    return (dispatch) => {
      dispatch({type: FETCH_START})
      dispatch({type: GETTING_READY_TO_GET_DATA_COUNTRY_NOVEL_COVID})
      api.get(`/countries${specific}?${filter}`).then(({data}) => {
        if (data) {
            let tmpConfirmed, tmpRecovered, tmpRecoveredRate, tmpDeaths, tmpDeathsRate, tmpActive, result, jdbfhjsagadb;
            tmpConfirmed = data.slice(0, 10).map((v, i) => {
                return {name: v.country, data: [v.cases]};
            });
            tmpRecovered = data.sort((a, b) => a.recovered < b.recovered ? 1 : -1).slice(0, 10).map((v, i) => {
                return {name: v.country, data: [v.recovered]};
            });
            tmpDeaths = data.sort((a, b) => a.deaths < b.deaths ? 1 : -1).slice(0, 10).map((v, i) => {
                return {name: v.country, data: [v.deaths]};
            });
            tmpActive = data.sort((a, b) => a.active < b.active ? 1 : -1).slice(0, 10).map((v, i) => {
                return {name: v.country, data: [v.active]};
            });
            tmpRecoveredRate = data.filter(r => r.recovered !== r.cases && (r.recovered/r.cases*100) !== 100).sort((a, b) => (a.recovered/a.cases*100) < (b.recovered/b.cases*100) ? 1 : -1).slice(0, 10).map((v, i) => {
              const tmpRate = (v.recovered/v.cases*100).toFixed(2);
              return {name: v.country, data: [parseFloat(tmpRate)]};
            });
            tmpDeathsRate = data.filter(r => r.recovered !== r.cases && (r.recovered/r.cases*100) !== 100).sort((a, b) => (a.deaths/a.cases*100) < (b.deaths/b.cases*100) ? 1 : -1).slice(0, 10).map((v, i) => {
              const tmpRate = (v.deaths/v.cases*100).toFixed(2)
              return {name: v.country, data: [parseFloat(tmpRate)]};
          });
            jdbfhjsagadb = data.map((v, i) => {
                //   return {'hc-key': v.countryInfo.iso2, key: v.country, value: v.cases, arrVal: [confirmed => v.cases, active => v.active, recovered => v.recovered, deaths => v.deaths]};
                if (v.countryInfo.iso2 === null) {
                    return ['', v.cases]
                }else {
                    // return [v.countryInfo.iso2.toLowerCase(), v.cases];
                    return {'hc-key':v.countryInfo.iso2.toLowerCase(), value: v.cases, data: {cases: v.cases, active: v.active, recovered: v.recovered, deaths: v.deaths} };
                }
            })
            result = {
                confirmed: tmpConfirmed,
                recovered: tmpRecovered,
                deaths: tmpDeaths,
                recoveredRate: tmpRecoveredRate,
                deathsRate: tmpDeathsRate,
                active: tmpActive,
                rawData: data,
                dataCovidDunia: jdbfhjsagadb,
            }
            console.log('result', result)
            dispatch({type: GET_DATA_COUNTRY_NOVEL_COVID, payload: result});
        } else {
          dispatch({type: FETCH_ERROR, payload: data.error})
        }
      }).catch(function (error) {
        console.log("Error****:", error.message)
      })
    }
  }