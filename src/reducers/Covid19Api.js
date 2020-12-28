import {
    INIT_URL,
    GET_DATA_COVID19_API,
    GETTING_READY_TO_GET_DATA_COVID19_API,
    DATA_COVID19_API_READY
  } from "../constants/ActionTypes"
  
  const INIT_STATE = {
    initURL: '',
    loading: false,
    dataReady: false,
    covid19_api_data: {
        Global: {
            NewConfirmed: 0,
            TotalConfirmed: 0,
            NewDeaths: 0,
            TotalDeaths: 0,
            NewRecovered: 0,
            TotalRecovered: 0
        },
        Countries: [],
        Date: ''
    },
  }
  
  export default (state = INIT_STATE, action) => {
    switch (action.type) {
  
      case INIT_URL: {
        return {...state, initURL: action.payload}
      }
  
      case GET_DATA_COVID19_API: {
        return {
          ...state,
          dataReady: true,
          loading: false,
          covid19_api_data: action.payload,
        }
      }

      case GETTING_READY_TO_GET_DATA_COVID19_API: {
          return {...state, loading: true}
      }
  
      default:
        return state
    }
  }
  