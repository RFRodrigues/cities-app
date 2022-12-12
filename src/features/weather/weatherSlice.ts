import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { RootState, AppThunk } from '../../app/store';
import { fetchWeather } from './weatherAPI';

export interface WeatherState {
  lat: number;
  long: number;
  data: any;
  weekdays: Array<string>
}

const initialState: WeatherState = {
  lat: 39.74362,
  long: -8.80705,
  data: {},
  weekdays: []
};

const notify = (message: string) => toast(message);

//async request to get weather data
export const getWeatherData = createAsyncThunk(
  'weather/fetchWeather',
  async (_, { getState }) => {

    const state = getState() as RootState;
    let response = await fetchWeather(state.weather.lat, state.weather.long);
    //console.log(response);
    return response;
  }
);

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setCoordinates: (state, action: PayloadAction<WeatherState>) => {
      console.log(action);
      state.lat = action.payload.lat;
      state.long = action.payload.long;
    },
    setWeekDays: (state, action: PayloadAction<Array<string>>) => {
      state.weekdays = action.payload;
    },
    setNoData: (state, action: PayloadAction<WeatherState>) => {
      state = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWeatherData.pending, (state) => {
        console.log("getting weather data");
      })
      .addCase(getWeatherData.fulfilled, (state, action) => {
        state.data = action.payload;
        console.log(action);
        //state.value += action.payload;
      });
  },
});

export const { setCoordinates, setWeekDays, setNoData } = weatherSlice.actions;

//selectors
export const selectData = (state: RootState) => state.weather.data;
export const selectWeekDays = (state: RootState) => state.weather.weekdays;
export const selectCoordinates = (state: RootState) => {
  return {"lat": state.weather.lat, "long": state.weather.long}
};
export const selectCity = (state: RootState) => state.cityList.selectedCity;

//
export const getLocation = (): AppThunk => (
  dispatch,
  getState
) => {

  let latitude = 0;
  let longitude = 0;
  
  navigator.geolocation.getCurrentPosition(async (position) => {
    console.log(position);
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    let weather:WeatherState = { lat: latitude, long: longitude, data: {}, weekdays: [] };
    dispatch(setCoordinates(weather));
    dispatch(getWeatherData());
    const currentValue = selectCoordinates(getState());
    console.log(currentValue);
  },
    function (error) {
      //Case if the browser don't has the permission to use location
      if (error.code === error.PERMISSION_DENIED) {
        //console.log("Using default location: Leiria [39.74362, -8.80705]");
        notify("Using default location: Leiria");
        dispatch(getWeatherData());
      }
    });
};

//get and set next week days
export const getWeekDays = (): AppThunk => (
  dispatch
) => {
  let weekDays = [];
  let date = new Date();
  for(let i = 0; i < 8; i++){
    if(i !== 0) {
      date = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    }  
    var weekday = date.toLocaleString("en-GB", { weekday: "short", month: 'short', day: '2-digit' });
    weekDays.push(weekday);
  }
  dispatch(setWeekDays(weekDays));
}

export const getSelectedCity = (): AppThunk => (
  dispatch,
  getState
) => {
  let selectedCity = selectCity(getState());
  console.log(selectedCity);
}

export const clearData = (): AppThunk => (
  dispatch
) => {
  let weather:WeatherState = { lat: -1, long: -1, data: {}, weekdays: [] };
  dispatch(setNoData(weather));
}

export default weatherSlice.reducer;
