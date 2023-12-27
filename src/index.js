import './style.css'
//get needed elements of the page
const button = document.querySelector('button')
const input = document.querySelector('input')
const paras = document.getElementsByTagName('p')
const error = document.querySelector('.error')
let tempArry //for working with the button that shows temperature

//get object (promis with object) with data
async function getResponse (location) {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=b67700fca5264a80882174953231412&q=${location}&aqi=no`, {mode: 'cors'});
    const json = await response.json()
    return json
}

//when user click on the button 'send'
button.addEventListener('click', function() {
    //if input is filled
    if (input.value) {
        //add the ‘loading’ component that displays from the time the form is submitted
        // until the information comes back from the API
        error.innerHTML = 'Wait a second!'
        getResponse (input.value)
        .then((result) => {
            //clean up error field
            error.innerHTML = '' 
            populateParas(result)
            changeBackground()//change look of the page
            
        })
        //if there is no matching city
        .catch(() => {
            error.innerHTML = 'No matching location found!'
        })
    }
    //if input is empty
    else error.innerHTML = 'There is no data in the form'
})

function populateParas (result) {
    //at the begining populate paras with data
    paras[0].textContent = `City: ${result.location.name}`
    paras[1].textContent = `Country: ${result.location.country}`
    paras[2].textContent = `Local time: ${result.location.localtime}`
    paras[3].textContent = `Temperature: ${result.current.temp_c}°C`
    paras[4].textContent = `Feels like: ${result.current.feelslike_c}°C`
    paras[5].textContent = result.current.condition.text
    paras[6].textContent = `Wind: ${result.current.wind_kph}km/h`
    paras[7].textContent = `Wind direction: ${result.current.wind_dir}`
    paras[8].textContent = `Pressure: ${result.current.pressure_mb}mb`
    paras[9].textContent = `Humidity: ${result.current.humidity}%`
    input.value = ''//clean up input value
    addToggleButton()//add button for changing farenheit to celsius and vice versa next to one of the para
    fillTempArry(result)//fill array with temperature data
}

const addToggleButton = () => {
    //initially remove old toggle button in order to avoid existence two or more such buttons
    if (document.querySelector('.toggle')) {
        document.querySelector('.toggle').remove()
    } 
    const toggleButton = document.createElement('button')
    toggleButton.classList.add('toggle')
    toggleButton.textContent = 'Show temp in f'
    paras[3].insertAdjacentElement('afterend', toggleButton)
    toggleTemp(toggleButton)
}

//toggle from C to F and vice versa when user click corresponding button
const toggleTemp = (toggleButton) => {
    toggleButton.addEventListener('click', () => {
        if (toggleButton.textContent == 'Show temp in f') {
            toggleButton.textContent = 'Show temp in c'
            paras[3].textContent = tempArry[1]
            paras[4].textContent = tempArry[3] 
        }
        else {
            toggleButton.textContent = 'Show temp in f'
            paras[3].textContent = tempArry[0]
            paras[4].textContent = tempArry[2]
        }   
    })
}

//change background image when change temperature (more than 20C, from 1 to 20C, less than 1C)
const changeBackground = () => {
    const container = document.querySelector('#container')
    container.className = ''
    const temp = tempArry[4]
    if (temp > 20) container.classList.add('hot')
    else if (temp <= 20 && temp > 0) container.classList.add('normal')
    else if (temp <= 0) container.classList.add('cold')
}

//fill tempArry
const fillTempArry = (result) => {
    tempArry = []//tempArry become empty every time when user make new query
    tempArry.push(
        //1-4 parameters for using in function toggleTemp()
        //5 parameter for using in fucntion changeBackground ()
        `Temperature: ${result.current.temp_c}°C`, 
        `Temperature: ${result.current.temp_f}°F`,
        `Feels like: ${result.current.feelslike_c}°C`,
        `Feels like: ${result.current.feelslike_f}°F`,
        +result.current.temp_c
    )
}
































