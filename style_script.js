// let termometer_height = document.getElementById('termometer-progress').style.height
// let root = document.getElement

// termometer_height = Number(termometer_height.replace('%', ''))

// if (termometer_height <= 40) {
//     root.style.setProperty('--termometer', 'green')
// }



function updateColor() {
    // Acessando o elemento do termômetro e o :root
    let termometer = document.getElementById('termometer-progress');
    let root = document.documentElement;

    // Obtendo a altura do termômetro e removendo o símbolo de percentual
    let termometerHeight = termometer.style.height.replace('%', '');

    // Convertendo a string para número
    termometerHeight = Number(termometerHeight);

    // Condicional para mudar a cor com base na altura do termômetro
    if (termometerHeight <= 40) {
        root.style.setProperty('--termometer', 'green');
    } 
    if (termometerHeight > 40) {
        root.style.setProperty('--termometer', 'blue');
    } 
}
