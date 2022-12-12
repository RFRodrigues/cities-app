import React, { useEffect, useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  addNewCity,
  City,
  removeCity,
  selectCities,
  selectCitySelected,
  setSelectedCity
} from './cityListSlice';
import styles from './CityList.module.css';
import { getLocation, getWeekDays, selectCity } from '../weather/weatherSlice';

export function CityList() {

  const dispatch = useAppDispatch();
  const cities = useAppSelector(selectCities);
  const selectedCity = useAppSelector(selectCitySelected);
  const [newCity, setNewCity] = useState("");

  useEffect(() => {

    if (selectedCity.id === -1) {
      dispatch(getLocation());
      dispatch(getWeekDays());
    }
  }, [selectCity]);

  return (
    <div>
      <div className={styles.box}>
        <div className={styles.list}>
          <ul>
            {cities?.map((city: City, index: number) => {
              return <li key={index} className={selectedCity.id === index ? styles.selectedcity : ''} onClick={() => dispatch(setSelectedCity(index, `${city.name},${city.countryCode}`))}>{city.name}, {city.countryCode}</li>
            })}
          </ul>
        </div>

      </div>
      <div className={styles.newcity}>
        <input className={selectedCity.id !== -1 ? styles.deletecitybutton : styles.deletecitybuttonhidden} type="button" value="Remove City" onClick={() => dispatch(removeCity(cities[selectedCity?.id!]))} />
        <input className={styles.newcityinput} type="text" name="newcity" placeholder='Add city (Ex. Lisbon, PT)' value={newCity} onChange={e => setNewCity(e.target.value)} />
        <input className={styles.newcitybutton} type="button" value="Add City" onClick={() => { dispatch(addNewCity(newCity)); setNewCity('') }} />

      </div>
    </div>
  );
}
