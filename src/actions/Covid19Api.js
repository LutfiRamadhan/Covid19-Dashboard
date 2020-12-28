//api.covid19api.com

import {
    FETCH_ERROR,
    FETCH_START,
    FETCH_SUCCESS,
    INIT_URL,
    GET_DATA_COVID19_API,
    GETTING_READY_TO_GET_DATA_COVID19_API,
    DATA_COVID19_API_READY
  } from "../constants/ActionTypes"
import axios from 'axios';

  
  export const setInitUrl = (url) => {
    return {
      type: INIT_URL,
      payload: url
    }
  }

  const api = axios.create({
    baseURL: `https://api.covid19api.com`,//YOUR_API_URL HERE
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  export const getSummary = () => {
    return (dispatch) => {
      dispatch({type: FETCH_START})
      dispatch({type: GETTING_READY_TO_GET_DATA_COVID19_API})
      let data = []
      api.get(`/summary`).then(({data}) => {
        if (data) {
            dispatch({type: FETCH_SUCCESS})
            dispatch({type: DATA_COVID19_API_READY})
            dispatch({type: GET_DATA_COVID19_API, payload: data})
        } else {
          dispatch({type: FETCH_ERROR, payload: data.error})
        }
      }).catch(function (error) {
        console.log("Error****:", error.message)
      })
    }
  }