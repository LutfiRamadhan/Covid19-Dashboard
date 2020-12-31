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
            dispatch({type: GET_DATA_COUNTRY_NOVEL_COVID, payload: data});
        } else {
          dispatch({type: FETCH_ERROR, payload: data.error})
        }
      }).catch(function (error) {
        console.log("Error****:", error.message)
      })
    }
  }