import {
    INIT_URL,
    GET_DATA_CORONA_API,
    GET_SELECTED_DATA_CORONA_API,
    GET_TIMELINE_CORONA_API,
    GETTING_READY_TO_GET_DATA_CORONA_API,
    GETTING_READY_TO_GET_SELECTED_DATA_CORONA_API,
    GETTING_READY_TO_GET_TIMELINE_CORONA_API,
    GET_RAW_TIMELINE_CORONA_API
  } from "../constants/ActionTypes"
  
  const INIT_STATE = {
    initURL: '',
    corona_api_data_loading: false,
    corona_api_data_detail_loading: false,
    corona_api_timeline_loading: false,
    corona_api_data_ready: false,
    corona_api_data_detail_ready: false,
    corona_api_timeline_ready: false,
    corona_api_data: {},
    corona_api_data_detail: {
        name: '',
        code: '',
        population: 0,
        updated_at: '',
        today: {
            deaths: 0,
            confirmed: 0
        },
        latest_data: {
            deaths: 0,
            confirmed: 0,
            recovered: 0,
            critical: 0,
            calculated: {
                death_rate: 0,
                recovery_rate: 0,
                recovered_vs_death_ratio: '',
                cases_per_million_population: 0
            }
        },
        timeline: [],
    },
    corona_api_timeline: [],
    corona_api_timeline_raw: [],
  }
  
  export default (state = INIT_STATE, action) => {
    switch (action.type) {
  
      case INIT_URL: {
        return {...state, initURL: action.payload}
      }

      case GET_TIMELINE_CORONA_API: {
        return {
          ...state,
          corona_api_timeline_ready: true,
          corona_api_timeline_loading: false,
          corona_api_timeline: action.payload,
        }
      }

      case GET_RAW_TIMELINE_CORONA_API: {
          return {
              ...state,
              corona_api_timeline_raw: action.payload,
          }
      }
  
      case GET_DATA_CORONA_API: {
        return {
          ...state,
          corona_api_data_ready: true,
          corona_api_data_loading: false,
          corona_api_data: action.payload,
        }
      }
  
      case GET_SELECTED_DATA_CORONA_API: {
        return {
          ...state,
          corona_api_data_detail_ready: true,
          corona_api_data_detail_loading: false,
          corona_api_data_detail: action.payload,
        }
      }

      case GETTING_READY_TO_GET_TIMELINE_CORONA_API: {
        return {...state, corona_api_timeline_loading: true}
      }

      case GETTING_READY_TO_GET_SELECTED_DATA_CORONA_API: {
        return {...state, corona_api_data_detail_loading: true}
      }

      case GETTING_READY_TO_GET_DATA_CORONA_API: {
        return {...state, corona_api_data_loading: true}
      }
  
      default:
        return state
    }
  }
  