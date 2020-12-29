import {
    INIT_URL,
    GET_SUMMARY_NOVEL_COVID,
    GETTING_READY_TO_GET_SUMMARY_NOVEL_COVID,
    GET_TIMELINE_NOVEL_COVID,
    GETTING_READY_TO_GET_TIMELINE_NOVEL_COVID,
    TIMELINE_NOVEL_COVID_READY,
    GETTING_READY_TO_GET_DATA_COUNTRY_NOVEL_COVID,
    GET_DATA_COUNTRY_NOVEL_COVID,
  } from "../constants/ActionTypes"
  
  const INIT_STATE = {
    initURL: '',
    summaryReady: false,
    timelineReady: false,
    dataCountryReady: false,
    country_data: [],
    timeline_data: [],
    summary_data: {
        updated: 0,
        cases: 0,
        todayCases: 0,
        deaths: 0,
        todayDeaths: 0,
        recovered: 0,
        active: 0,
        critical: 0,
        casesPerOneMillion: 0,
        deathsPerOneMillion: 0,
        tests: 0,
        testsPerOneMillion: 2338.0,
        affectedCountries: 0,
    },
    loadingSummary: false,
    loadingTimeline: false,
    loadingDataCountry: false,
  }
  
  export default (state = INIT_STATE, action) => {
    switch (action.type) {
  
      case INIT_URL: {
        return {...state, initURL: action.payload}
      }
  
      case GET_SUMMARY_NOVEL_COVID: {
        return {
          ...state,
          summaryReady: true,
          loadingSummary: false,
          summary_data: action.payload,
        }
      }

      case GETTING_READY_TO_GET_SUMMARY_NOVEL_COVID: {
          return {...state, loadingSummary: true}
      }

      case GET_TIMELINE_NOVEL_COVID: {
        return {
          ...state,
          timelineReady: true,
          loadingTimeline: false,
          timeline_data: action.payload,
        }
      }

      case GETTING_READY_TO_GET_TIMELINE_NOVEL_COVID: {
          return {...state, loadingTimeline: true}
      }

      case GET_DATA_COUNTRY_NOVEL_COVID: {
        return {
          ...state,
          dataCountryReady: true,
          loadingDataCountry: false,
          country_data: action.payload,
        }
      }

      case GETTING_READY_TO_GET_DATA_COUNTRY_NOVEL_COVID: {
          return {...state, loadingDataCountry: true}
      }
  
      default:
        return state
    }
  }
  