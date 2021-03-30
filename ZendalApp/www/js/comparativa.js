const lista1localidades = document.getElementById("lista1localidades");
lista1localidades.addEventListener('ionChange', localidadesSeleccionadas);

const lista2localidades = document.getElementById("lista2localidades");
lista2localidades.addEventListener('ionChange', localidadesSeleccionadas);

onload = cargaDatos;
const NUM_FECHAS_EJEX = 7;
let datos_cam;
let fechas;
let localidad1, localidad2;
let TIA1, TIA2;
let lc;

function formatFecha(fecha) {
    let fechaDDMMAAAA;
    fechaDDMMAAAA = fecha.substr(8, 2) + "/";
    fechaDDMMAAAA = fechaDDMMAAAA + fecha.substr(5, 2) + "/";
    fechaDDMMAAAA = fechaDDMMAAAA + fecha.substr(0, 4);
    return fechaDDMMAAAA;
}
function obtenerFechas(datosjson) {
    let listado_fechas = [];
    let listado_fechas_unico = [];

    listado_fechas = datosjson.data.map(elemento => elemento.fecha_informe.substr(0, 10));//saco las fechas
    console.log(listado_fechas);
    console.log(listado_fechas.length);

    listado_fechas_unico = [...new Set(listado_fechas)];

    listado_ultimas_fechas = listado_fechas_unico.slice(0, NUM_FECHAS_EJEX);
    listado_ultimas_fechas = listado_ultimas_fechas.map(elemento => formatFecha(elemento));

    console.log(listado_ultimas_fechas.length);
    console.log(listado_ultimas_fechas);
    return listado_ultimas_fechas;
}
function obtenerLocalidades(datosjson) {
    let listado_localidades = [];
    let listado_localidades_unico = [];

    listado_localidades = datosjson.data.map(elemento => elemento.municipio_distrito);//saco las localidades
    console.log(listado_localidades);
    console.log(listado_localidades.length);

    listado_localidades_unico = [...new Set(listado_localidades)];
    console.log(listado_localidades_unico.length);
    console.log(listado_localidades_unico);
    listado_localidades_unico.sort();
    return listado_localidades_unico;
}
function obtenerTIAs(localidad1, localidad2) {
    let datos_localidad1 = datos_cam.data.filter(item => item.municipio_distrito == localidad1);
    let datos_localidad2 = datos_cam.data.filter(item => item.municipio_distrito == localidad2);

    let datos_ultimos_localidad1 = datos_localidad1.slice(0, NUM_FECHAS_EJEX);
    let datos_ultimos_localidad2 = datos_localidad2.slice(0, NUM_FECHAS_EJEX);

    TIA1 = datos_ultimos_localidad1.map(elemento => elemento.tasa_incidencia_acumulada_ultimos_14dias);
    TIA2 = datos_ultimos_localidad2.map(elemento => elemento.tasa_incidencia_acumulada_ultimos_14dias);
}
function localidadesSeleccionadas() {
    localidad1 = lista1localidades.value;
    localidad2 = lista2localidades.value;

    if (localidad1 && localidad2) {
        obtenerTIAs(localidad1, localidad2);
        dibujarGraficos();
    }
}

function getMiLocalidad() {

    let miLocalidad=null;
    let jsonlocalidad;
    
    jsonlocalidad = JSON.parse(localStorage.getItem('covidCAM_municipio'));
    if (jsonlocalidad!=null) //el fallito de la sb. accede a un objeto suponinedo que hay un favorito
    {
        miLocalidad = jsonlocalidad.municipio;
    }
    return miLocalidad;
 
}

function mostrarIonSelectLocalidades(array_localidades) {
    var elemento_lista1_localidades = document.getElementById("lista1localidades");
    var elemento_lista2_localidades = document.getElementById("lista2localidades");
    let item_localidad1, item_localidad2;

    for (localidad of array_localidades) {

        item_localidad1 = document.createElement("ion-select-option");//creo elemento
        item_localidad1.innerHTML = localidad;//le meto la localidad

        item_localidad2 = document.createElement("ion-select-option");//creo elemento
        item_localidad2.innerHTML = localidad;//le meto la localidad

        elemento_lista1_localidades.appendChild(item_localidad1);//añado al padre
        elemento_lista2_localidades.appendChild(item_localidad2);
    }
    elemento_lista1_localidades.setAttribute('value', getMiLocalidad());

}

async function cargaDatos() {

    //mostramos espera
    lc = await loadingController.create({
        message: 'Cargando...'
    });
    await lc.present();

    fetch("https://datos.comunidad.madrid/catalogo/dataset/7da43feb-8d4d-47e0-abd5-3d022d29d09e/resource/877fa8f5-cd6c-4e44-9df5-0fb60944a841/download/covid19_tia_muni_y_distritos_s.json")
        .then(response => {
            if (response.ok) {
                response.json()
                .then(datosjson => {
                    //console.log("datos covid cam ");
                    //console.log(datosjson);
                    datos_cam = datosjson;
                    let array_localidades = obtenerLocalidades(datosjson);
                    fechas = obtenerFechas(datosjson);
                    mostrarIonSelectLocalidades(array_localidades);
                    //fechas = fechas.reverse();
                    lc.dismiss();
                })
            } else {
                lc.dismiss();
                mostrarToast();
            }
        })
    .catch(error => { lc.dismiss();mostrarToast();});
}

//function dibujarGrafico(ejexFechas, ejeyTIA) {
function dibujarGraficos() {
    var ctx = document.getElementById('compChart').getContext('2d');
    TIA1 = TIA1.reverse();
    TIA2 = TIA2.reverse();
    fechas = fechas.reverse();
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: fechas,
            datasets: [{
                label: localidad1,
                borderColor: 'rgb(235, 68, 90)',
                data: TIA1,
            },
            {
                label: localidad2,
                borderColor: 'rgb(0, 0, 0)',
                data: TIA2,
            }]
        },

        // Configuration options go here
        options: {}
    });


}