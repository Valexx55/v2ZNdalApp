
this.onload = carga;
//30-3 VAL correciones a lo que era un serio candidato al BOMBAY DECADE CODE AWARD

const URL_GRAFICOS_MADRID = "https://raw.githubusercontent.com/civio/covid-vaccination-spain/main/data.csv";
const POBLACION_MADRID = 6779888;
const POBLACION_ESPANIA = 47329000;
var lc;


function carga() {


    //obtenerDatosCVSParseadosEnArray();
    parseaGraficosCSVMadrid();



}

//necesario para que funcione el menu lateral
async function openMenu() {

    await menuController.open();

}



// --------------------- ACCESO A DATOS ---------------------------------//

function limpiarYParsearNumeros(array_datos_parseado) {
    array_datos_parseado.shift();//eliminamos la primera posición, que son nombres de columnas
    array_datos_parseado = array_datos_parseado.map(registro => registro.map(function callback(currentValue, index, array) {
        // Elemento devuelto de nuevo_array
        if (index != POS_FECHA_INFORME && index != POS_CAM && index != POS_PORCENTAJE_SOBRE_ENTREGADAS && index != POS_ULTIMA_VACUNA_REGISTRADA) {//EVITO ESTAS POSICIONES PQ NO TIENEN DATOS NUMÉTICOS
            if (currentValue.indexOf(".") != -1) {
                //tiene un punto y es posición de número
                currentValue = currentValue.replaceAll(".", "");
            }
        }
        return currentValue;
    }));
    return array_datos_parseado

}
function mostrarSeccionEspania(array_datos_parseado) {
    let datosTotales = [];
    datosTotales = array_datos_parseado.filter(item => item[1].localeCompare('Totales') == 0);//FILTRAMOS SOLO LOS DATOS DE TOTAL
    let ultimos_datos_Espania = datosTotales[datosTotales.length - 1];//OBTENEMOS EL ÚLTIMO REGISTRO DE TOTALES
    let ultimos7_datos_Espania = datosTotales.slice(datosTotales.length - 1 - 7, datosTotales.length);//OBTENEMOS LOS 7 ÚLTIMOS REGISTRO DE TOTALES
    let ultimas7_fechas_Espania = ultimos7_datos_Espania.map(registro => registro[0]);//OBTENEMOS LAS 7 ÚLTIMAS FECHAS DE TOTALES

    muestraDatosVacunaEspanaDosPuntoCero(ultimos_datos_Espania);

    dibujarGraficoDosisEntregadasEspana(ultimos7_datos_Espania, ultimas7_fechas_Espania);
    dibujarGraficoDosisAdministradasEspana(ultimos7_datos_Espania, ultimas7_fechas_Espania);
    dibujarGraficoInmunesEspana(ultimos7_datos_Espania, ultimas7_fechas_Espania);
}
function mostrarSeccionMadrid(array_datos_parseado) {
    //---- SLIDE 1 -----  
    let datosMadrid = [];
    datosMadrid = array_datos_parseado.filter(item => item[1].localeCompare('Madrid') == 0);//FILTRAMOS SOLO LOS DATOS DE MADRID
    let ultimos_datos_Madrid = datosMadrid[datosMadrid.length - 1];//OBTENEMOS LOS ÚLTIMOS DATOS DE MADRID
    let ultimos7_datos_madrid = datosMadrid.slice(datosMadrid.length - 1 - 7, datosMadrid.length);
    let ultimas7_fechas_Madrid = ultimos7_datos_madrid.map(registro => registro[POS_FECHA_INFORME]);//OBTENEMOS LAS 7 ÚLTIMAS FECHAS DE MADRID   
    muestraDatosVacunaMadridDosPuntoCero(ultimos_datos_Madrid);//mostramos los datos textuales

    dibujarGraficoMadridRecibidas(ultimos7_datos_madrid, ultimas7_fechas_Madrid);
    dibujarGraficoMadridAdministradas(ultimos7_datos_madrid, ultimas7_fechas_Madrid);
    dibujarGraficoMadridPautaCompleta(ultimos7_datos_madrid, ultimas7_fechas_Madrid);

}
// coge el csv de la pagina de civio para pintar los graficos de datos de vacunacion de Madrid
async function parseaGraficosCSVMadrid() {

    //mostramos espera
    lc = await loadingController.create({
        message: 'Cargando...'
    });
    await lc.present();



    fetch(URL_GRAFICOS_MADRID)
        .then(response => response.text())
        .then(data => {
            let array_datos_parseado = parseCSV(data);
            array_datos_parseado = limpiarYParsearNumeros(array_datos_parseado);
            mostrarSeccionMadrid(array_datos_parseado);
            mostrarSeccionEspania(array_datos_parseado);
            mostrarSeccionCCAA(array_datos_parseado);

            lc.dismiss();

        })
        .catch(error => {
            lc.dismiss();
            console.log("error " + error);
            mostrarToast();
            

        });

}
//OTRA FUNCION PARA PARSEAR CSV, A DIFERENCIA DE LA ANTERIOR, DEVUELVE UN ARRAY DE ARRAYS EN EL QUE CADA ARRAY
//ES UNA LINEA DEL CSV
function parseCSV(str) {
    var arr = [];
    var quote = false;  // 'true' means we're inside a quoted field

    // Iterate over each character, keep track of current row and column (of the returned array)
    for (var row = 0, col = 0, c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c + 1];        // Current character, next character
        arr[row] = arr[row] || [];             // Create a new row if necessary
        arr[row][col] = arr[row][col] || '';   // Create a new column (start with empty string) if necessary

        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }

        if (cc == '"') { quote = !quote; continue; }

        if (cc == ',' && !quote) { ++col; continue; }

        if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }

        if (cc == '\n' && !quote) { ++row; col = 0; continue; }
        if (cc == '\r' && !quote) { ++row; col = 0; continue; }

        arr[row][col] += cc;
    }
    return arr;
}



const POS_FECHA_INFORME = 0
const POS_CAM = 1;
const POS_DOSIS_PFIZER = 2;
const POS_DOSIS_MODERNA = 3;
const POS_DOSIS_ASTRAZENECA = 4;
const POS_DOSIS_JANSSEN = 5;
const POS_DOSIS_ENTREGADAS = 6;
const POS_DOSIS_ADMINISTRADAS = 7;
const POS_PORCENTAJE_SOBRE_ENTREGADAS = 8;
const POS_PERSONAS_CON_ALMENOS_UNA_DOSIS = 9;
const POS_PAUTA_COMPLETADA = 10;
const POS_ULTIMA_VACUNA_REGISTRADA = 11;

//informe,  comunidad autónoma,    dosis Pfizer,    dosis Moderna,   dosis AstraZeneca,  dosis Janssen,   dosis entregadas,dosis administradas,% sobre entregadas,personas con al menos una dosis,personas con pauta completa,última vacuna registrada
//informe  ,comunidad autónoma    ,dosis Pfizer    ,dosis Moderna,   dosis AstraZeneca,  dosis entregadas,   dosis administradas,   % sobre entregadas,   personas con al menos una dosis,  personas con pauta completa,última vacuna registrada
//"informe", "comunidad autónoma", "dosis Pfizer", "dosis Moderna", "dosis AstraZeneca", "dosis entregadas", "dosis administradas", "% sobre entregadas", "personas con pauta completa", "última vacuna registrada"
/**
 * 
 0:fecha informe
  ​
1: "comunidad autónoma"
  ​
2: "dosis Pfizer"
  ​
3: "dosis Moderna"
  ​
4: "dosis AstraZeneca"
  ​
5: "dosis entregadas"
  ​
6: "dosis administradas"
  ​
7: "% sobre entregadas"
  ​
8: "personas con pauta completa"
  ​
9: "última vacuna registrada"} datos 
 */
// --------------------- SLIDE 1: EVOLUCIÓN MADRID POR FECHA -----------------------------------------//


function muestraDatosVacunaMadridDosPuntoCero(ultimos_datos_Madrid) {

    let dosis_recibidas, dosis_administradas, porcentaje_recibidas_poblacion, porcentaje_administradas_recibidas, porcentaje_administradas_poblacion, personas_pauta_completa, porcentaje_poblacion_pauta_completa, personas_con_al_menos_una_dosis, porcentaje_con_al_menos_una_dosis;


    console.log("Datos madrid = " + ultimos_datos_Madrid);

    
    dosis_recibidas = ultimos_datos_Madrid[POS_DOSIS_ENTREGADAS];
    dosis_administradas = ultimos_datos_Madrid[POS_DOSIS_ADMINISTRADAS];
    porcentaje_administradas_recibidas = ultimos_datos_Madrid[POS_PORCENTAJE_SOBRE_ENTREGADAS];
    personas_pauta_completa = ultimos_datos_Madrid[POS_PAUTA_COMPLETADA];
    personas_con_al_menos_una_dosis = ultimos_datos_Madrid[POS_PERSONAS_CON_ALMENOS_UNA_DOSIS];

    porcentaje_poblacion_pauta_completa = trunc((personas_pauta_completa * 100) / POBLACION_MADRID, 2);
    porcentaje_con_al_menos_una_dosis = trunc((personas_con_al_menos_una_dosis * 100) / POBLACION_MADRID, 2);

    let dosisDistribuidas = document.getElementById("dosisDistribuidas");
   
    let dosisAdministradasTotal = document.getElementById("dosisAdministradas");
    
    let porcentajeAdministradasTotal = document.getElementById("porcentajeAdministradasTotal");
    let pautaCompleta = document.getElementById("pautaCompleta");
    let porcenSobreTotalCompletas = document.getElementById("porcenSobreTotalCompletas");
    let fecha = document.getElementById("fechaAct");
    let fechaSlideTres = document.getElementById("fechaActua");
    //let personasAlMenosUnaDosisMadrid = document.getElementById("personasAlMenosUnaDosisMadrid");
    let porcentajeAlMenosUnaDosisMadrid = document.getElementById("porcentajeAlMenosUnaDosisMadrid");
   
   
    //personasAlMenosUnaDosisMadrid.innerHTML = personas_con_al_menos_una_dosis;
    porcentajeAlMenosUnaDosisMadrid.innerHTML = porcentaje_con_al_menos_una_dosis;

    dosisAdministradasTotal.innerHTML = dosis_administradas;
   
    dosisDistribuidas.innerHTML = dosis_recibidas;
    porcentajeAdministradasTotal.innerHTML = porcentaje_administradas_recibidas;
    pautaCompleta.innerHTML = personas_pauta_completa;
    porcenSobreTotalCompletas.innerHTML = porcentaje_poblacion_pauta_completa;
    console.log("Entregadas = " + dosis_recibidas + " % Entregadas " + porcentaje_recibidas_poblacion + " Administradas " + dosis_administradas + " % Administradas por Población " + porcentaje_recibidas_poblacion + " % Administradas por Recibidas " + porcentaje_administradas_recibidas + " Completa " + personas_pauta_completa + " % Completa " + porcentaje_poblacion_pauta_completa);
   
    fecha.innerHTML = ultimos_datos_Madrid[POS_FECHA_INFORME];
    fechaSlideTres.innerHTML = ultimos_datos_Madrid[POS_FECHA_INFORME];


}

//en el csv los datos llegan de la siguiente forma:
//madrid, posicion 14
//desde el final posicion  - 6, despues cada nueva fecha -20
// oden subarray posicion 0 fecha, posicion 5 dosis entregadas, posicion 6 dosis administradas,
//posicion 7 % sobre entregadas, posicion 8 pauta completada

function dibujarGraficoMadridRecibidas(ultimos7_datos_madrid, ultimas7_fechas_Madrid) {


    let ultimos7_registros_dosis_Entregadas_Madrid = ultimos7_datos_madrid.map(registro => registro[POS_DOSIS_ENTREGADAS]);

    let ctx = document.getElementById('myChartMadridEntregadas').getContext('2d');

    dibujarGraficaLinea(ctx, ultimas7_fechas_Madrid, ultimos7_registros_dosis_Entregadas_Madrid, 'rgb(16, 26, 214)', 'Vacunas distribuidas Madrid');

}

//grafico de dosis administradas Madrid
function dibujarGraficoMadridAdministradas(ultimos7_datos_madrid, ultimas7_fechas_Madrid) {


    let ultimos7_registros_dosis_Administradas_Madrid = ultimos7_datos_madrid.map(registro => registro[POS_DOSIS_ADMINISTRADAS]);
    let ctx = document.getElementById('myChartMadridAdministradas').getContext('2d');

    dibujarGraficaLinea(ctx, ultimas7_fechas_Madrid, ultimos7_registros_dosis_Administradas_Madrid, 'rgb(226, 83, 3)', 'Vacunas administradas Madrid');

}

//dibuja grafico personas con las dos dosis administrada Madrid
function dibujarGraficoMadridPautaCompleta(ultimos7_datos_madrid, ultimas7_fechas_Madrid) {

    let ultimos7_registros_dosis_PautaCompleta_Madrid = ultimos7_datos_madrid.map(registro => registro[POS_PAUTA_COMPLETADA]);

    let ctx = document.getElementById('myChartMadridCompletadas').getContext('2d');

    dibujarGraficaLinea(ctx, ultimas7_fechas_Madrid, ultimos7_registros_dosis_PautaCompleta_Madrid, 'rgb(83, 225, 162)', 'Vacunas pauta completa Madrid');
}


// --------------------- SLIDE 2: EVOLUCIÓN ESPAÑA POR FECHA ------------------------------------------//


function muestraDatosVacunaEspanaDosPuntoCero(ultimos_datos_Espania) {


    let entregadas_total = ultimos_datos_Espania[POS_DOSIS_ENTREGADAS];
    let total_Pfizer = ultimos_datos_Espania[POS_DOSIS_PFIZER];
    let total_Moderna = ultimos_datos_Espania[POS_DOSIS_MODERNA];
    let total_Astrazenca = ultimos_datos_Espania[POS_DOSIS_ASTRAZENECA];
    let total_Janssen = ultimos_datos_Espania[POS_DOSIS_JANSSEN];
    let personas_con_al_menos_una_dosis_esp = ultimos_datos_Espania[POS_PERSONAS_CON_ALMENOS_UNA_DOSIS];
    let porcentaje_con_al_menos_una_dosis_esp = trunc((personas_con_al_menos_una_dosis_esp * 100) / POBLACION_ESPANIA, 2);


    let porcentajeAlMenosUnaDosisEsp = document.getElementById("porcentajeAlMenosUnaDosisEsp");
    porcentajeAlMenosUnaDosisEsp.innerHTML = porcentaje_con_al_menos_una_dosis_esp;

    let num_entregadas = document.getElementById("dosis_totales_ES");
    let chart1_texto = document.getElementById("chart1_text");

    //corejimos a 5
    num_entregadas.innerHTML = entregadas_total;
    chart1_texto.innerHTML = "<b>" + (total_Pfizer * 100 / entregadas_total).toFixed(2) + "%</b> de Pfizer <br><b>" +
        (total_Moderna * 100 / entregadas_total).toFixed(2) + "% </b> de Moderna <br><b>" +
        (total_Astrazenca * 100 / entregadas_total).toFixed(2) + "% </b> de Astrazeneca<br><b>" +
        (total_Janssen * 100 / entregadas_total).toFixed(2) + "% </b> de Janssen";
    //document.getElementById("porcentajeDosisEntregadasES").innerHTML= trunc((entregadas_total * 100) / POBLACION_ESPANIA, 3);;


    let admin_total = ultimos_datos_Espania[POS_DOSIS_ADMINISTRADAS];
    //correjimos a 6
    let admin_por_total = trunc((admin_total * 100) / POBLACION_ESPANIA, 3);
    let dosis_admin = document.getElementById("dosis_admin_ES");
    let chart2_texto = document.getElementById("chart2_text");
    console.log("admin_total", admin_total);
    dosis_admin.innerHTML = admin_total;
    chart2_texto.innerHTML = "El <b>" + (admin_total.replace('.', "") * 100 / entregadas_total).toFixed(2) + "%</b> de vacunas recibidas ya han sido administradas";
    //document.getElementById("porcentajePoblacionAdministradasES").innerHTML=admin_por_total;



    //correimos pauta completa es 8 AHORA 9
    let adminx2_total = ultimos_datos_Espania[POS_PAUTA_COMPLETADA];
    //fallo grave. hay que hacer replaceALl y no replace... si no solo cambia el primer punto y los millones los hace mal
    let adminx2_por_total = trunc((adminx2_total * 100) / POBLACION_ESPANIA, 3);
    //let adminx2_por_total = trunc(adminx2_total / poblacionEs, 3);
    console.log("porcentaje inmunida2 = " + adminx2_por_total);

    let num_adminx2 = document.getElementById("pauta_comp_ES");
    // let chart3_texto = document.getElementById("chart3_text");
    console.log("pauta_comp", adminx2_total);
    num_adminx2.innerHTML = adminx2_total;
    // chart3_texto.innerHTML = "<b>" + adminx2_por_total + "%</b> de la población";
    document.getElementById("porcentajePoblacionInmuneES").innerHTML = trunc((adminx2_total * 100) / POBLACION_ESPANIA, 3);

    /*chart3_texto.innerHTML = "En España ya hay <b>" + adminx2_total +
    "</b> personas con la pauta completa administrada.<br>Esto es el <b>" + adminx2_por_total + "%</b> de la población."*/
    let fecha = document.getElementById("fechaActu");
    fecha.innerHTML = ultimos_datos_Espania[POS_FECHA_INFORME];


}

//grafico de dosis administradas España
function dibujarGraficoDosisEntregadasEspana(ultimos7_datos_Espania, ultimas7_fechas_Espania) {

    let ultimos7_registros_dosis_Entregadas_Espania = ultimos7_datos_Espania.map(registro => registro[POS_DOSIS_ENTREGADAS]);
    let ctx = document.getElementById('myChart').getContext('2d');

    dibujarGraficaLinea(ctx, ultimas7_fechas_Espania, ultimos7_registros_dosis_Entregadas_Espania, 'rgb(16, 26, 214)', 'Vacunas distribuidas España');
}

function dibujarGraficoDosisAdministradasEspana(ultimos7_datos_Espania, ultimas7_fechas_Espania) {


    let ultimos7_registros_dosis_Administradas_Espania = ultimos7_datos_Espania.map(registro => registro[POS_DOSIS_ADMINISTRADAS]);
    let ctx = document.getElementById('myChartAdministradas').getContext('2d');

    dibujarGraficaLinea(ctx, ultimas7_fechas_Espania, ultimos7_registros_dosis_Administradas_Espania, 'rgb(226, 83, 3)', 'Vacunas administradas España');

}

function dibujarGraficoInmunesEspana(ultimos7_datos_Espania, ultimas7_fechas_Espania) {

    let ultimos7_registros_dosis_PautaCompleta_Espania = ultimos7_datos_Espania.map(registro => registro[POS_PAUTA_COMPLETADA]);
    let ctx = document.getElementById('myChartCompletada').getContext('2d');

    dibujarGraficaLinea(ctx, ultimas7_fechas_Espania, ultimos7_registros_dosis_PautaCompleta_Espania, 'rgb(83, 225, 162)', 'Vacunas pauta completa España');

}


// --------------------- SLIDE 3: ÚLTIMOS DATOS POR CCAA ---------------------------------//

// El último array con 20 arrays son los datos mas recientes: 17 x CCAA + Ceuta + Melilla + Totales
// Las posiciones que nos interesan:
// [0]=fecha informe ;[1]= ccaa, [4]= dosis entregadas, [5]=dosis admin, [6]=% admin sobre entregadas, 
// [7]= pauta completa[8] = fecha ultima vacuna registrada.

function mostrarSeccionCCAA(datos) {

    //Datos totales mas recientes
    let datos_totales = datos.pop();


    // Datos de CCAA mas recientes
    let ccaa = [];
    let dosis_admin = [];
    let dosis_entregadas = [];
    let dosis_adminx2 = [];
    let dosis_por_admin = [];

    for (let i = (datos.length - 20); i < datos.length; i++) {
        ccaa.push(datos[i][POS_CAM]);
        dosis_admin.push(Number.parseInt(datos[i][POS_DOSIS_ADMINISTRADAS]));
        dosis_entregadas.push(Number.parseInt(datos[i][POS_DOSIS_ENTREGADAS]));
        dosis_adminx2.push(Number.parseInt(datos[i][POS_PAUTA_COMPLETADA]));
        Number.parseFloat(dosis_por_admin.push(datos[i][POS_PORCENTAJE_SOBRE_ENTREGADAS].replaceAll("%", "").replace(",", ".")));
    }
    console.log(ccaa);
    console.log(dosis_por_admin);

    // ==> Chart 1: Total vacunas recibidas

    // Datos para la gráfica (ctx, ejeX, ejeY, color, leyenda) 

    let ctx1 = document.getElementById("chart1").getContext('2d');

    dibujargraficaBarras(ctx1, ccaa, dosis_entregadas, 'rgb(16, 26, 214)', 'Vacunas distribuidas por CCAA');

    // ==> Chart 2: Porcentaje de dosis administradas sobre las entregadas.

    // Datos para la gráfica (ctx, ejeX, ejeY, color, leyenda) 

    let ctx2 = document.getElementById("chart2").getContext('2d');

    dibujargraficaBarras(ctx2, ccaa, dosis_por_admin, 'rgb(226, 83, 3)', '% dosis admin. respecto las entregadas');

    // ==> Chart 3: Personas pauta completa.

    // Datos para la gráfica (ctx, ejeX, ejeY, color, leyenda) 

    let ctx3 = document.getElementById("chart3").getContext('2d');
    dibujargraficaBarras(ctx3, ccaa, dosis_adminx2, 'rgb(83, 225, 162)', "Vacunas pauta completa por CCAA");
}


//funcion sacada de stackoverflow que trunca un numero con decimales para que saque solamente los 2 primeros decimales
function trunc(x, posiciones = 0) {
    var s = x.toString()
    var l = s.length
    var decimalLength = s.indexOf('.') + 1
    var numStr = s.substr(0, decimalLength + posiciones)
    return Number(numStr)
}

// --------------------- FUNCIONES PARA LAS GRÁFICAS---------------------------------//


// Gráfica linea
function dibujarGraficaLinea(ctx, ejeX, ejeY, color, leyenda) {
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: ejeX,
            datasets: [{
                label: leyenda,
                backgroundColor: color,
                borderColor: 'rgb(255, 255, 255)',
                data: ejeY
            }]
        },

        // Configuration options go here
        options: {
            responsive: true,
            //aspectRatio: 1,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }

        }
    });
}


// Gráfica de barras
function dibujargraficaBarras(ctx, ejeX, ejeY, color, leyenda) {

    //OBTENERLOS DATOS
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'horizontalBar',

        // The data for our dataset
        data: {
            labels: ejeX,
            datasets: [{
                label: leyenda,
                barThickness: 2,
                backgroundColor: color,
                borderColor: 'rgb(255, 255, 255)',
                data: ejeY
            }]
        },

        options: {
            responsive: true,
            aspectRatio: 1,
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    })
}