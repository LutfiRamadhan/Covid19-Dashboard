//corona-api.com

import {
    FETCH_ERROR,
    FETCH_START,
    FETCH_SUCCESS,
    INIT_URL,
    GET_DATA_CORONA_API,
    GET_SELECTED_DATA_CORONA_API,
    GET_TIMELINE_CORONA_API,
    GETTING_READY_TO_GET_DATA_CORONA_API,
    GETTING_READY_TO_GET_SELECTED_DATA_CORONA_API,
    GETTING_READY_TO_GET_TIMELINE_CORONA_API,
    GET_RAW_TIMELINE_CORONA_API
  } from "../constants/ActionTypes";
import axios from 'axios';
  
  export const setInitUrl = (url) => {
    return {
      type: INIT_URL,
      payload: url
    }
  }

  const api = axios.create({
    baseURL: `https://corona-api.com`,//YOUR_API_URL HERE
    headers: {
      'Content-Type': 'application/json',
    }
  })
  
  export const getData = () => {
    return (dispatch) => {
      dispatch({type: FETCH_START})
      dispatch({type: GETTING_READY_TO_GET_DATA_CORONA_API})
      api.get(`/countries`).then(({data}) => {
        if (data.data) {
          let tmpConfirmed, tmpRecovered, tmpDeaths, result;
          tmpConfirmed = data.data.sort((a, b) => a.latest_data.confirmed < b.latest_data.confirmed ? 1 : -1).slice(0, 10).map((v, i) => {
            return {name: v.name, data: [v.latest_data.confirmed]};
          });
          tmpRecovered = data.data.sort((a, b) => a.latest_data.recovered < b.latest_data.recovered ? 1 : -1).slice(0, 10).map((v, i) => {
            return {name: v.name, data: [v.latest_data.recovered]};
          });
          tmpDeaths = data.data.sort((a, b) => a.latest_data.deaths < b.latest_data.deaths ? 1 : -1).slice(0, 10).map((v, i) => {
            return {name: v.name, data: [v.latest_data.deaths]};
          });
          result = {
            confirmed: tmpConfirmed,
            recovered: tmpRecovered,
            deaths: tmpDeaths
          }
          dispatch({type: GET_DATA_CORONA_API, payload: result});
        } else {
          dispatch({type: FETCH_ERROR, payload: data.error})
        }
      }).catch(function (error) {
        console.log("Error****:", error.message)
      })
    }
  }

  export const getSelectedData = ({code}) => {
    return (dispatch) => {
      dispatch({type: FETCH_START})
      dispatch({type: GETTING_READY_TO_GET_SELECTED_DATA_CORONA_API})
      let data = []
      api.get(`/countries/${code}`).then(({data}) => {
        if (data.data) {
          dispatch({type: FETCH_SUCCESS})
          data = data.data.map(function(val, index){
              return {
                no: index,
                code: val.code,
                name: val.name,
                today: {
                    deaths: val.today.death,
                    confirmed: val.today.confirmed
                },
                latest_data: {
                    deaths: val.latest_data.deaths,
                    confirmed: val.latest_data.confirmed,
                    recovered: val.latest_data.recovered,
                    critical: val.latest_data.critical,
                    calculated: {
                        death_rate: val.latest_data.calculated.death_rate,
                        recovery_rate: val.latest_data.calculated.recovery_rate,
                        recovered_vs_death_ratio: val.latest_data.calculated.recovered_vs_death_ratio,
                        cases_per_million_population: val.latest_data.calculated.cases_per_million_population,
                    }
                },
                timeline: val.timeline
              }
          })
          
  
          dispatch({type: GET_SELECTED_DATA_CORONA_API, payload: data})
          dispatch({type: FETCH_SUCCESS})
        } else {
          dispatch({type: FETCH_ERROR, payload: data.error})
        }
      }).catch(function (error) {
        console.log("Error****:", error.message)
      })
    }
  }

  export const getTimeline = () => {
    return (dispatch) => {
        dispatch({type: GETTING_READY_TO_GET_TIMELINE_CORONA_API})
      dispatch({type: FETCH_START})
      let chartData = []
      let tmpConfirmed = [],
          tmpRecovered = [],
          tmpDeaths = []
      api.get(`/timeline`).then(({data}) => {
        if (data.data) {
          dispatch({type: FETCH_SUCCESS})
          data.data.map((v, i) => {
            const datetime = new Date(v.date).getTime();
            tmpConfirmed.push([datetime, v.confirmed]);
            tmpRecovered.push([datetime, v.recovered]);
            tmpDeaths.push([datetime, v.deaths]);
          })
          chartData = [{
            name: 'Confirmed',
            data: tmpConfirmed,
            cropThreshold: 9999,
          } , {
            name: 'Recovered',
            data: tmpRecovered,
            cropThreshold: 9999,
          }, {
            name: 'Deaths',
            data: tmpDeaths,
            cropThreshold: 9999,
          }]
          console.log(chartData)
          dispatch({type: GET_TIMELINE_CORONA_API, payload: chartData})
          dispatch({type: GET_RAW_TIMELINE_CORONA_API, payload: data.data})
          dispatch({type: FETCH_SUCCESS})
        } else {
          dispatch({type: FETCH_ERROR, payload: data.error})
        }
      }).catch(function (error) {
        console.log("Error****:", error.message)
      })
    }
  }