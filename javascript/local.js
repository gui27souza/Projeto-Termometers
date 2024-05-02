// Função para ativar a visibilidade da seção Local

    let on = 0

    function activateLocal() {

        if (!on) {
            document.getElementById('local').style.display = "flex"
            on = 1

            getLocation()
        } else {
            document.getElementById('local').style.display = "none"
            on = 0
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

            console.log(`City: ${city}, Country Code: ${country}`)
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
        document.getElementById('local-temp').textContent = `${ parseInt(data.main.temp)}°`
        document.getElementById('local-min').textContent = `${ parseInt(data.main.temp_min)}°`
        document.getElementById('local-max').textContent = `${ parseInt(data.main.temp_max)}°`
        
        convertTemperature(data.main.temp, 'C')

        document.getElementById('span-celsius').textContent = parseInt(temp_celsius) + ' °C'
        document.getElementById('span-fahrenheit').textContent = parseInt(temp_fahrenheit) + ' °F'
        document.getElementById('span-kelvin').textContent = parseInt(temp_kelvin) + ' K'
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