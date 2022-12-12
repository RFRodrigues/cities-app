import { Weather } from './features/weather/Weather';
import { CityList } from './features/cityList/CityList';
import './App.css';
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CityList />
        <Weather />
        <Toaster position="bottom-center" />
      </header>
    </div>
  );
}

export default App;
