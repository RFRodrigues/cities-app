import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { fetchLocationByCityName } from './cityListAPI';
import toast from 'react-hot-toast';
import { getLocation, getWeatherData, getWeekDays, setCoordinates, WeatherState } from '../weather/weatherSlice';


export interface City {
  id: number,
  name: string,
  lat: number,
  long: number,
  countryCode: string
}

interface SelectedCity {
  id?: number,
  cityName: string,
  countryCode: string
}

export interface CityListState {
  selectedCity: SelectedCity,
  cities: Array<City>
}

const initialState: CityListState = {
  selectedCity: { id: -1, cityName: '', countryCode: '' },
  cities: []
};


export const cityListSlice = createSlice({
  name: 'cityList',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setCity: (state, action: PayloadAction<SelectedCity>) => {
      console.log(action.payload);
      state.selectedCity = action.payload;
    },
    addCity: (state, action: PayloadAction<City>) => {
      console.log(action.payload);
      state.cities = [...state.cities, action.payload];
      notify(`City ${action.payload.name} added`);
    },
    delCity: (state, action: PayloadAction<City>) => {
      console.log(action.payload);
      let citiesTemp = [...state.cities];
      let newCities = citiesTemp.filter(cityTemp => !(cityTemp.id === action.payload.id));
      //citiesTemp.splice(action.payload.id, 1);
      state.cities = newCities;
      notify(`City ${action.payload.name} removed`);
    }
  }
});

const notify = (message: string) => toast.success(message);

export const { setCity, addCity, delCity } = cityListSlice.actions;

export const selectCitySelected = (state: RootState) => state.cityList.selectedCity;
export const selectCities = (state: RootState) => state.cityList.cities;

export const setSelectedCity = (id: number, selectedCity: string): AppThunk => async (
  dispatch,
  getstate
) => {

  dispatch(getWeekDays());
  let city: SelectedCity = {
    id: id === -1 ? - 1 : id,
    cityName: id === -1 ? "" : selectedCity.split(',')[0],
    countryCode: id === -1 ? "" : selectedCity.split(',')[1]
  }
  console.log(id);
  console.log(selectedCity);
  if (id !== -1) {
    let cityLat = getstate().cityList.cities[id].lat;
    let cityLong = getstate().cityList.cities[id].long;
    let weather: WeatherState = { lat: cityLat, long: cityLong, data: {}, weekdays: [] };
    dispatch(setCoordinates(weather));
  }
  else {
    dispatch(getLocation());
  }
  dispatch(setCity(city));
  dispatch(getWeatherData());
}

export const addNewCity = (city: string): AppThunk => (
  dispatch,
  getstate
) => {

  let cityName = city.split(',')[0];
  let countryCode = city.split(',')[1];

  const fetchInfo = async () => {
    let response = await fetchLocationByCityName(cityName, countryCode);

    let parsedResponse: any = JSON.parse(JSON.stringify(response));
    console.log(parsedResponse);

    let newCity: City = {
      id: getstate().cityList.cities.length,
      name: city.split(',')[0],
      countryCode: city.split(',')[1].trim(),
      lat: parsedResponse[0].lat,
      long: parsedResponse[0].lon
    }

    dispatch(addCity(newCity));
  }
  fetchInfo();
}

export const removeCity = (city: City): AppThunk => (
  dispatch,
  getstate
) => {
  console.log(city);

  dispatch(delCity(city));
  dispatch(setSelectedCity(-1, ""));
}

export default cityListSlice.reducer;
