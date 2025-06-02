import express from "express"
import axios from "axios"
import 'dotenv/config'
const api_key = process.env.API_KEY;

const app = express();
const port = 3000;
const API_URL = "https://api.openweathermap.org/";


app.use(express.static("public"));
app.use(express.urlencoded());


var weatherData = ""

app.get("/", (req,res) => {
    res.render("index.ejs");
});

app.post("/city", async (req,res) => {
    console.log(req.body)
    try {
       const result = await axios.get(API_URL + `geo/1.0/direct?q=${req.body.city}&limit=5&appid=${api_key}`)
      //  console.log(result.data.length)
       res.render("city.ejs", {cities:result.data})
    }

    catch (error) {

    };
})



app.post("/weather", async (req,res) => {
    //console.log(req.body)
    const city = JSON.parse(req.body.city)
    //console.log(city);
    try {
      const result = await axios.get(API_URL + `data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${api_key}`)
      const air_quality = await axios.get(API_URL + `data/2.5/air_pollution?lat=${city.lat}&lon=${city.lon}&appid=${api_key}`)
      // console.log(air_quality.data.list[0])
      //console.log(result.data)
      weatherData = {
        name: city.name,
        state: city.state,
        country: city.country,
        weather: result.data.weather[0].description,
        icon_URL: `https://openweathermap.org/img/wn/${result.data.weather[0].icon}@2x.png`,
        data : result.data.main,
        wind: result.data.wind,
        air_quality: air_quality.data.list[0],
        
        
      };

      res.render("weather.ejs", weatherData);
      
    }
    
    catch (error) {

    };
})

app.get("/weather", (req,res) => {
  res.render("weather.ejs", weatherData);
})

app.get("/air-quality", (req,res)=>{
  res.render("air-quality.ejs", weatherData)

})


app.listen(port, ()=>{
    console.log(`Server running on port ${port}.`)
});
