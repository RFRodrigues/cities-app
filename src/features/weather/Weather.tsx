import { useAppSelector} from '../../app/hooks';
import {
  selectData,
  selectWeekDays,
} from './weatherSlice';
import styles from './Weather.module.css';

export function Weather() {
  const data = useAppSelector(selectData);
  const weekDay = useAppSelector(selectWeekDays);

  return (
    <div>
      <div className={styles.row}>
        <div id="current" className={data?.current?.dt > data?.current?.sunrise && data?.current?.dt < data?.current?.sunset ? styles.currentday : styles.currentnight}>
          <span>Current Weather</span>
          <div >
            <div className={styles.info}>
              <span className={styles.temperature}>{Math.round(data?.current?.temp)}º</span>
              <img src={`http://openweathermap.org/img/wn/${data?.current?.weather[0].icon}@2x.png`} alt="weather image" />
            </div>
            <div>
              <span id="description">{data?.current?.weather[0].description}</span>
            </div>
          </div>
        </div>
        <div id="forecast">
          {data?.daily?.map((dailyInfo: any, index: number) => {
            return <div key={index} className={styles.day}>
              <div className={styles.weekday}><span>{weekDay[index]}</span></div>
              <div className={styles.daytemp}>
                <img src={`http://openweathermap.org/img/wn/${data?.daily[index]?.weather[0].icon}.png`} alt="weather icon" />
                <span>{Math.round(dailyInfo?.temp?.min)}º/{Math.round(dailyInfo?.temp?.max)}º</span>
              </div>
              <div className={styles.daydescription}>
                <span>{data?.daily[index]?.weather[0].description}</span>
              </div>
            </div>
          })}
        </div>
      </div>
    </div>
  );
}
