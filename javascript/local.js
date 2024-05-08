// Função para ativar a visibilidade da seção Local

    let on = 0

    function activateLocal() {

        if (!on) {
            on = 1

            document.getElementById('local').style.display = "flex"
            document.getElementById('in-back').style.display = "block"
            
            document.getElementById('temperatureUnit-local').style.display = "block"
            
            document.getElementById('temperatureUnit').style.display = "none"
            document.getElementById('in-temp').style.display = "none"
            document.getElementById('in-submit').style.display = "none"
            document.getElementById('in-local').style.display = "none"

            setTimeout(getLocation, 1500)

            growViewheight(on)
        } else {
            on = 0

            document.getElementById('local').style.display = "none"
            document.getElementById('in-back').style.display = "none"

            document.getElementById('temperatureUnit-local').style.display = "none"

            document.getElementById('temperatureUnit').style.display = "block"
            document.getElementById('in-temp').style.display = "block"
            document.getElementById('in-submit').style.display = "block"
            document.getElementById('in-local').style.display = "block"

            growViewheight(on)
        }
    }

//





// Função que pega a localização do usuário

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const latitude = position.coords.latitude
                const longitude = position.coords.longitude

                // Fetch city and country from the coordinates
                getCityAndCountry(latitude, longitude)

                // Fetch weather from the coordinates
                getWeather(latitude, longitude)
                }, showError)
        } else {
            alert("Geolocation is not supported by this browser.")
        }
    }

// 





// Função que pega os dados de cidade e país baseado na posição cedida pelo usuário, utilizando a API OpenCage 

    async function getCityAndCountry(latitude, longitude) {
        const apiKey = '5f69092a128b4824abdef48518176c3f'
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`

        try {
            const response = await fetch(url)
            const data = await response.json()
            const allComponents = data.results[0].components
            const city = allComponents.city || allComponents.town || allComponents.village
            const country = allComponents.country_code.toUpperCase()

            updateLocation(city, country)
        } catch (error) {
            console.error("Error fetching location data: ", error)
        }
    }

// 


// Função que adiciona os dados de cidade e país no conteúdo HTML
function updateLocation(city, country) {
    document.getElementById('loading-location').style.display = 'none'
    document.getElementById('location').textContent = city + ', ' + country
}






// Função que pega os dados do clima baseado na posição cedida pelo usuário, utilizando a API OpenWeatherMap

    function getWeather(latitude, longitude) {

        const unit = document.getElementById('temperatureUnit-local').value

        let unit_url

        switch (unit) {
            case 'C':
                unit_url = 'metric'
            break
            case 'F':
                unit_url = 'imperial'
            break
            case 'K':
                unit_url = ''
            break
        }


        const apiKey = '0a01cadc2ea86cb5ef9b410202403ffe'
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit_url}`

        fetch(url)
            .then(response => response.json())
            .then(data => {

                let current_temp = parseInt(data.main.temp)
                let min_temp = parseInt(data.main.temp_min)
                let max_temp = parseInt(data.main.temp_max)
                let weather_icon = data.weather[0].icon

                updateWeatherData(current_temp, min_temp, max_temp, unit, weather_icon)

                console.log(data)
            })
            .catch(error => {
                console.error('Error fetching the weather data:', error)
            })
    }

// 


// Função que adiciona os dados de clima no conteúdo HTML

    function updateWeatherData(current_temp, min_temp, max_temp, unit, weather_icon) {

        updateWeatherImage(weather_icon)
        
        convertTemperature(current_temp, unit)

        if (unit == 'K') document.documentElement.style.setProperty('--api-out-font-size', '8rem')
        else {
            current_temp += '°'
            min_temp += '°'
            max_temp += '°'
        }

        document.getElementById('local-temp').textContent = `${current_temp}`
        document.getElementById('local-min').textContent = `${min_temp}`
        document.getElementById('local-max').textContent = `${max_temp}`
        
        document.getElementById('span-celsius').textContent = parseInt(temp_celsius) + ' °C'
        document.getElementById('span-fahrenheit').textContent = parseInt(temp_fahrenheit) + ' °F'
        document.getElementById('span-kelvin').textContent = parseInt(temp_kelvin) + ' K'
    }

// 

// Função que atualiza o ícone de clima

    function updateWeatherImage(weather_icon) {
        document.getElementById('weather-image').setAttribute('src',
            `https://openweathermap.org/img/wn/${weather_icon}@4x.png`
        )
    }

// 




// Função de Erros

    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.")
                break
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.")
                break
            case error.TIMEOUT:
                alert("The request to get user location timed out.")
                break
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.")
                break
        }
    }

// 




// Função para responsividade da página em mobile, aumentando seu tamanho de acordo com a necessidade

    function growViewheight(on) {
        var styleSheet = document.createElement("style");
        document.head.appendChild(styleSheet);

        if (on) { 
            styleSheet.sheet.insertRule("@media screen and (orientation: portrait) {html {height: 275vh;}", 0);
            styleSheet.sheet.insertRule("@media screen and (orientation: portrait) {:root {--api-out-font-size:3rem}}", 1);
        } 
        if (!on) {
            styleSheet.sheet.insertRule("@media screen and (orientation: portrait) {html {height: 185vh;}", 0);
        }
    }

// 