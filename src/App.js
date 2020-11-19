import './App.css';
import React, { useState, useEffect } from "react";
import { useQueryParam, StringParam, QueryParamProvider } from 'use-query-params';


const DEFAULT_CITY = 'Copenhagen';

function App() {

  const baseURL = "https://api.openweathermap.org/data/2.5/weather?q=";
  const key = "&appid=166d00e26d3ff2c6149e89feccc5c59a&fbclid=IwAR39DN2Wk1AedRc442IROzoUcCTMJhIoL703n52IpNMbMiidZxgQFcJKClc";
  const [info, setInfo] = useState({});
  const [inputText, setInputText] = useState('');
  const [cityParam, setCityParam] = useQueryParam('city', StringParam);
  const [error, setError] = useState(null)

  //Search for city
  const searchCity = (city) => {

    fetch(baseURL + city + key)
      .then(res => res.json())
      .then(
        (result) => {
          setError(null);
          setInfo({ city: result.name, temperature: result.main.temp, humidity: result.main.humidity, wind: result.wind.speed });
        }
      ).catch(err => {
        console.log(err);
        setError('Nothing found');
      })
  };

  //Submit button
  const submitForm = (e) => {
    e.preventDefault();
    searchCity(inputText);

  }

  //On input field change
  const handleChange = (e) => {
    setInputText(e.target.value)
    setCityParam(e.target.value);
  };

  // On load
  useEffect(() => {
    const city = cityParam || DEFAULT_CITY;
    setInputText(city);
    searchCity(city);

  //If no parameter in url
    if (!cityParam) {
      setCityParam(DEFAULT_CITY);
    }
  }, []);

  return (
    <div className="App">
      <div className="widget" />
      <div className="panel panel-info">
        {error ? <div className="panel-heading">{error}</div> : <div className="panel-heading">Weather in <b>{info.city}</b></div>}
        <ul className="list-group">
          {(!error) && (
            <>
              <li className="list-group-item">Temperature: <b>{info.temperature}</b></li>
              <li className="list-group-item">Humidity: <b>{info.humidity}</b></li>
              <li className="list-group-item">Wind: <b>{info.wind}</b></li>
            </>
          )}
          <li className="list-group-item">
            <form className="form-inline" onSubmit={submitForm}>
              <div className="form-group">
                <input value={inputText} onChange={handleChange} type="text" className="form-control" id="city" placeholder="City" />
              </div>
              <button type="submit" className="btn btn-default">Search</button>
            </form>
          </li>
        </ul>
      </div>
    </div>

  );

}


export default () => (
  <QueryParamProvider>
    <App />
  </QueryParamProvider>
);
