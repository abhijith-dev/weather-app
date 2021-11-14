import './App.css'
import React from 'react'
import Axios from 'axios'

//images 
import temp from './images/celsius.png'
import humidity from './images/humidity.png'
import wind from './images/wind.png'
import notfound from './images/notfound.gif'
import loadingsrc from './images/loading.gif'
import axios from 'axios';

//env varibales
const API_KEY = process.env.REACT_APP_API_KEY
const MAIN_URL = process.env.REACT_APP_MAIN_URL
const CORDS_URL = process.env.REACT_APP_CORDS_URL
const CUSTOMER_KEY = process.env.REACT_APP_CUSTOMER_KEY
const CORDS_OPTIONS = process.env.REACT_APP_CORDS_OPTIONS

function App() {
  //states
  const [key, setKey] = React.useState()
  const [data, setData] = React.useState([])
  const [loading,setLoading] = React.useState(false)

  //requesting for weather report
  const request = async(position,repeat) =>{
    setLoading(true)
    await Axios({
      url: `${MAIN_URL}?key=${API_KEY} &q=${position}`
    })
      .then(res => {
        setLoading(false)
        setData([res.data])
        slider()
      })
      .catch(async(err) => {
        setLoading(false)
        if(repeat){
          await request('india',0)
        }
       else{
         setData([])
       }
      })
  }

  //setting current location at the beggining
  React.useEffect(async()=>{
    setLoading(true)
    let got = async(pos)=>{
      await axios({
      url :`${CORDS_URL}?key=${CUSTOMER_KEY}&location=${pos.coords.latitude},${pos.coords.longitude}
            &${CORDS_OPTIONS}`
      })
      .then(async(res)=>{
        setLoading(false)
        let location = res.data.results[0].locations[0]
        let position = location.adminArea5 ? location.adminArea5 : location.adminArea3
        await request(position,1)
      })
    }
    let notgot = async(err)=>{
      setLoading(false)
       await request('india',0)
    }
    const options ={
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
    await navigator.geolocation.getCurrentPosition(got,notgot,options)
    
  },[])

  //animation part
  const slider = () => {
    let style = document.createElement('style');
    let keyFrames = `@keyframes wrpu {0%{margin-left: -900px;}100%{margin-left: 0;}}`
    style.innerHTML = keyFrames
    document.getElementsByTagName('head')[0].appendChild(style);
    setTimeout(() => {
      style.innerHTML = ''
      document.getElementsByTagName('head')[0].appendChild(style);
    }, 750)
  }

  const onChangeHandler = (event) => {
    setKey(event.target.value)
  }

  const submitHandler = async(event) => {
    event.preventDefault()
    await request(key,0)
  }
  
  return (
    <div className="container">
      <h2>Weather App</h2>
      <form className="form-banner" onSubmit={submitHandler}>
        <input type="search" className="input-form" placeholder="Enter city name .." onChange={onChangeHandler} />
        <button type="submit" className="submit-button" ><i className="fa fa-search"></i></button>
      </form>
    {
      loading ?( 
        <div className ="loader">
          <img src={loadingsrc} alt={'loading..'} />
        </div>
      ) :
      (
        <>
          {
        data.length ?
          (
            <>
              <div className="weather-list">
                <div className="wl-1">
                  <p>Temperature</p>
                  <img src={temp} alt={"Temperature"} />
                  <p>{data[0].current.temp_c} ℃</p>
                </div>
                <div className="wl-2">
                  <p>Humidity</p>
                  <img src={humidity} alt={"Humidity"} />
                  <p>{data[0].current.humidity} %</p>
                </div>
                <div className="wl-3">
                  <p>Wind Speed</p>
                  <img src={wind} alt={"Wind Speed"} />
                  <p>{data[0].current.wind_kph} kph</p>
                </div>
              </div>
              <div className="more-section">
                <p><img src={data[0].current.condition.icon} alt={data[0].current.condition.text} />{data[0].location.name} {data[0].location.region} ,{data[0].location.country}  <button className="btn-more" data-bs-toggle="modal" data-bs-target="#mdl">more</button></p>
              </div>
              <div className="modal fade" id="mdl" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel"><img src={data[0].current.condition.icon} alt={data[0].current.condition.text} />{data[0].location.name} {data[0].location.region} ,{data[0].location.country} </h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      <p>Condtion :{data[0].current.condition.text}</p>
                      <p>Feels Like : {data[0].current.feelslike_c} ℃</p>
                      <p>Gust : {data[0].current.gust_kph} kph</p>
                      <p>Precipitation : {data[0].current.precip_mm} mm</p>
                      <p>Pressure :{data[0].current.pressure_mb} mb</p>
                      <p>visibility :{data[0].current.vis_km} km</p>
                      <p>Wind Degree :{data[0].current.wind_degree}°</p>
                      <p>Wind Direction :{data[0].current.wind_dir} </p>
                      <br></br>
                      <p>(Last Update on {data[0].current.last_updated})</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (<div className="not-found">
            <img src={notfound} alt={'not found'} />
            <h2> No Data Found</h2>
          </div>)
      }
        </>
      )
    }
    </div>
  );
}

export default App;
