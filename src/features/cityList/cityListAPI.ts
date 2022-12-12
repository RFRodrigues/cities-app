// Get latitude and longitude by city name
export function fetchLocationByCityName(cityName: string, country: string) {
  return new Promise<{ data: JSON }>((resolve) =>
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${country}&limit=5&appid=b31e956222b1c56f536b38f7a21deae1&lang=pt`).then((response) => {
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
