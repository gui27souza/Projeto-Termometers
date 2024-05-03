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

            getLocation()
        } else {
            on = 0

            document.getElementById('local').style.display = "none"
            document.getElementById('in-back').style.display = "none"

            document.getElementById('temperatureUnit-local').style.display = "none"

            document.getElementById('temperatureUnit').style.display = "block"
            document.getElementById('in-temp').style.display = "block"
            document.getElementById('in-submit').style.display = "block"
            document.getElementById('in-local').style.display = "block"
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
    document.getElementById('location').textContent = city + ', ' + country
}






// Função que pega os dados do clima baseado na posição cedida pelo usuário, utilizando a API OpenWeatherMap

    function getWeather(latitude, longitude) {

        const apiKey = '0a01cadc2ea86cb5ef9b410202403ffe'
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`

        fetch(url)
            .then(response => response.json())
            .then(data => {
                updateWeatherData(data)
            })
            .catch(error => {
                console.error('Error fetching the weather data:', error)
            })
    }

// 


// Função que adiciona os dados de clima no conteúdo HTML

    function updateWeatherData(data) {

        let unit = document.getElementById('temperatureUnit-local').value

        let temp_c = parseInt(data.main.temp)
        let temp_min_c = parseInt(data.main.temp_min)
        let temp_max_c = parseInt(data.main.temp_max)

        console.log(temp_c)

        if (unit == 'C') {
            document.getElementById('local-temp').textContent = `${temp_c}°`
            document.getElementById('local-min').textContent = `${temp_min_c}°`
            document.getElementById('local-max').textContent = `${temp_max_c}°`
        }

        if (unit == 'F') {
            let temp_f = parseInt((temp_c * 9/5) + 32)
            let temp_min_f = parseInt((temp_min_c * 9/5) + 32)
            let temp_max_f = parseInt((temp_max_c * 9/5) + 32)

            document.getElementById('local-temp').textContent = `${temp_f}°`
            document.getElementById('local-min').textContent = `${temp_min_f}°`
            document.getElementById('local-max').textContent = `${temp_max_f}°`
        }

        if (unit == 'K') {
            document.getElementById('local-temp').textContent = `${temp_c + 273}`
            document.getElementById('local-min').textContent = `${temp_min_c + 273}`
            document.getElementById('local-max').textContent = `${temp_max_c + 273}`

            document.documentElement.style.setProperty('--api-out-font-size', '8rem')
        }
        
        termometerPercentage(temp_c, unit)

        document.getElementById('span-celsius').textContent = temp_c + ' °C'
        document.getElementById('span-fahrenheit').textContent = parseInt(temp_c * 9/5) + 32 + ' °F'
        document.getElementById('span-kelvin').textContent = temp_c + 273 + ' K'
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