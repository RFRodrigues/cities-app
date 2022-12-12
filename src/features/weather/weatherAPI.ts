// Get Weather by latitude and longitude
export function fetchWeather(lat: number, long: number) {
  return new Promise<{ data: JSON }>((resolve) =>
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=b31e956222b1c56f536b38f7a21deae1&lang=eng&units=metric`).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
      .then((responseJson) => {
        console.log(responseJson);
        resolve(responseJson);
      })
      .catch((error) => {
        console.log(error)
      })
  );
}


