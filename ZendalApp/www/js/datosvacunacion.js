
this.onload = carga;
//30-3 VAL correciones a lo que era un serio candidato al BOMBAY DECADE CODE AWARD
//4-5 VAL MEJORAS EN LAS GRÁFICAS:
    //SE MUESTRAN LA SERIE DE RECIBIDAS SÓLO CON LOS 7 ÚLTIMOS SALTOS
    //LAS ADMINISTRADAS E INMUNIZADAS SE MUESTRAN CON UN SALTO DE 5 DÍAS PARA MEJORAR LA VISILIDIDAD DE LA EVOLUCIÓN
    //SE FORMATEAN CON COMAS Y PUNTOS DEBIDAMENTE LOS NÚMEROS TANTO DE LA GRÁFICA COMO DEL RESUMEN
    //SE AÑADE GRÁFICO DE TARTA A LOS DISTIONTOS FABRICANTES DE VACUNAS

const URL_GRAFICOS_MADRID = "https://raw.githubusercontent.com/civio/covid-vaccination-spain/main/data.csv";
const POBLACION_MADRID = 6779888;
const POBLACION_ESPANIA = 47329000;
var lc;





const POS_FECHA_INFORME = 0
const POS_CAM = 1;
const POS_DOSIS_PFIZER = 2;
const POS_DOSIS_PFIZER_PEDIATRICA = 3;
const POS_DOSIS_MODERNA = 4;
const POS_DOSIS_ASTRAZENECA = 5;
const POS_DOSIS_JANSSEN = 6;
const POS_DOSIS_ENTREGADAS = 7;
const POS_DOSIS_ADMINISTRADAS = 8;
const POS_PORCENTAJE_SOBRE_ENTREGADAS = 9;
const POS_PERSONAS_CON_ALMENOS_UNA_DOSIS = 10;
const POS_PAUTA_COMPLETADA = 11;
const POS_PORCENTAJE_PAUTA_INCOMPLETA = 12;
const POS_PERSONAS_DOSIS_ADICIONALES = 13;
const POS_ULTIMA_VACUNA_REGISTRADA = 14;
const NUMERO_CCAA_VACUNA = 21;//id en número de CCAA en el STA

/**
 * const POS_FECHA_INFORME = 0
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
 */



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

function mostrarDosisEspaniaEnUltimoDia (datosEspania)
{
    let ddaud = Number.parseInt (datosEspania[datosEspania.length - 1][POS_DOSIS_ADMINISTRADAS]);
    let ddapd = Number.parseInt (datosEspania[datosEspania.length - 2][POS_DOSIS_ADMINISTRADAS]);
    let dud = (ddaud-ddapd);
    console.log ("Ultimo dia " + dud);
    let eud = document.getElementById("dosisUltimaJornadaE");
    eud.innerHTML = (new Intl.NumberFormat("es-ES").format(dud));
}

function mostrarInmunizadosEspaniaEnUltimoDia (datosEspania)
{
    let ddaud = Number.parseInt (datosEspania[datosEspania.length - 1][POS_PAUTA_COMPLETADA]);
    let ddapd = Number.parseInt (datosEspania[datosEspania.length - 2][POS_PAUTA_COMPLETADA]);
    let dud = (ddaud-ddapd);
    console.log ("Ultimo dia " + dud);
    let eud = document.getElementById("inmunizadosUltimaJornadaE");
    eud.innerHTML = (new Intl.NumberFormat("es-ES").format(dud));
}

function mostrarSeccionEspania(array_datos_parseado) {
    let datosTotales = [];
    datosTotales = array_datos_parseado.filter(item => item[1].localeCompare('Totales') == 0);//FILTRAMOS SOLO LOS DATOS DE TOTAL
    let ultimos_datos_Espania = datosTotales[datosTotales.length - 1];//OBTENEMOS EL ÚLTIMO REGISTRO DE TOTALES

    muestraDatosVacunaEspanaDosPuntoCero(ultimos_datos_Espania);
    mostrarDosisEspaniaEnUltimoDia(datosTotales);
    mostrarInmunizadosEspaniaEnUltimoDia(datosTotales);

    let ultimos7_variaciones_esp_entragadas = [[],[]];//array bidimensional
    ultimos7_variaciones_esp_entragadas = obtenerUltimos7SaltosDeDosisEntregadas (datosTotales);
    let ultimos7_variaciones_esp_administradas = [[],[]];//array bidimensional
    ultimos7_variaciones_esp_administradas = obtenerUltimos7DatosAdministradosConSalto (datosTotales);

    let ultimos7_variaciones_esp_inmunizadas = [[],[]];//array bidimensional
    ultimos7_variaciones_esp_inmunizadas = obtenerUltimos7DatosInmunizadosConSalto (datosTotales);

    dibujarGraficoDosisEntregadasEspana2(ultimos7_variaciones_esp_entragadas[0], ultimos7_variaciones_esp_entragadas[1]);
    dibujarGraficoDosisAdministradasEspana2(ultimos7_variaciones_esp_administradas[0], ultimos7_variaciones_esp_administradas[1]);
    dibujarGraficoInmunesEspana2(ultimos7_variaciones_esp_inmunizadas[0], ultimos7_variaciones_esp_inmunizadas[1]);
}

function obtenerUltimos7SaltosDeDosisEntregadas (datos)
{
    let ultimos7_variaciones_madrid_entragadas = [[],[]];//array bidimensional
    let cuenta_saltos = 0;
    let dato_actual = 0;
    let ultimo_dato=0;
    let pos_actual = datos.length-1;

        ultimos7_variaciones_madrid_entragadas [0].push (datos[pos_actual][POS_FECHA_INFORME]);
        ultimos7_variaciones_madrid_entragadas [1].push (datos[pos_actual][POS_DOSIS_ENTREGADAS]);

        cuenta_saltos++;
        ultimo_dato = datos[pos_actual][POS_DOSIS_ENTREGADAS];
        pos_actual--;

        do{
            dato_actual = datos[pos_actual][POS_DOSIS_ENTREGADAS];
            if (dato_actual!=ultimo_dato)
            {
                //ha habido variación me lo guardo
                ultimos7_variaciones_madrid_entragadas [0].push (datos[pos_actual][POS_FECHA_INFORME]);
                ultimos7_variaciones_madrid_entragadas [1].push (datos[pos_actual][POS_DOSIS_ENTREGADAS]);
                cuenta_saltos++;
                ultimo_dato = datos[pos_actual][POS_DOSIS_ENTREGADAS];
            }
            pos_actual--;

        }while ((cuenta_saltos<7)&&(pos_actual>=0));


    return ultimos7_variaciones_madrid_entragadas;
}

function obtenerUltimos7DatosAdministradosConSalto(datos)
{
    let ultimos7_variaciones_madrid_administradas = [[],[]];//array bidimensional
    let cuenta_saltos = 0;
       let pos_actual = datos.length-1;

        
        for (cuenta_saltos=0; cuenta_saltos<7; cuenta_saltos++)
        {
            ultimos7_variaciones_madrid_administradas [0].push (datos[pos_actual][POS_FECHA_INFORME]);
            ultimos7_variaciones_madrid_administradas [1].push (datos[pos_actual][POS_DOSIS_ADMINISTRADAS]);
            pos_actual= pos_actual-5;
        }
   
    return ultimos7_variaciones_madrid_administradas;
}

function obtenerUltimos7DatosInmunizadosConSalto(datos)
{
    let ultimos7_variaciones_madrid_inmunizadas = [[],[]];//array bidimensional
    let cuenta_saltos = 0;
    let pos_actual = datos.length-1;

        
        for (cuenta_saltos=0; cuenta_saltos<7; cuenta_saltos++)
        {
            ultimos7_variaciones_madrid_inmunizadas [0].push (datos[pos_actual][POS_FECHA_INFORME]);
            ultimos7_variaciones_madrid_inmunizadas [1].push (datos[pos_actual][POS_PAUTA_COMPLETADA]);
            pos_actual= pos_actual-5;
        }
   
    return ultimos7_variaciones_madrid_inmunizadas;
}

function mostrarDosisMadridEnUltimoDia (datosMadrid)
{
    let ddaud = Number.parseInt (datosMadrid[datosMadrid.length - 1][POS_DOSIS_ADMINISTRADAS]);
    let ddapd = Number.parseInt (datosMadrid[datosMadrid.length - 2][POS_DOSIS_ADMINISTRADAS]);
    let dud = (ddaud-ddapd);
    console.log ("Ultimo dia " + dud);
    let eud = document.getElementById("dosisUltimaJornadaM");
    eud.innerHTML = (new Intl.NumberFormat("es-ES").format(dud));
}
function mostrarInmunizadosMadridEnUltimoDia (datosMadrid)
{
    let ddaud = Number.parseInt (datosMadrid[datosMadrid.length - 1][POS_PAUTA_COMPLETADA]);
    let ddapd = Number.parseInt (datosMadrid[datosMadrid.length - 2][POS_PAUTA_COMPLETADA]);
    let dud = (ddaud-ddapd);
    console.log ("Ultimo dia " + dud);
    let eud = document.getElementById("inmunizadosUltimaJornadaM");
    eud.innerHTML = (new Intl.NumberFormat("es-ES").format(dud));
}
function mostrarSeccionMadrid(array_datos_parseado) {
    //---- SLIDE 1 -----  
    let datosMadrid = [];
    datosMadrid = array_datos_parseado.filter(item => item[1].localeCompare('Madrid') == 0);//FILTRAMOS SOLO LOS DATOS DE MADRID
    let ultimos_datos_Madrid = datosMadrid[datosMadrid.length - 1];//OBTENEMOS LOS ÚLTIMOS DATOS DE MADRID
    muestraDatosVacunaMadridDosPuntoCero(ultimos_datos_Madrid);//mostramos los datos textuales
    mostrarDosisMadridEnUltimoDia(datosMadrid);
    mostrarInmunizadosMadridEnUltimoDia(datosMadrid);

    let ultimos7_variaciones_madrid_entragadas = [[],[]];//array bidimensional
    ultimos7_variaciones_madrid_entragadas = obtenerUltimos7SaltosDeDosisEntregadas (datosMadrid);
  
    let ultimos7_variaciones_madrid_administradas = [[],[]];//array bidimensional
    ultimos7_variaciones_madrid_administradas = obtenerUltimos7DatosAdministradosConSalto (datosMadrid);

    let ultimos7_variaciones_madrid_inmunizadas = [[],[]];//array bidimensional
    ultimos7_variaciones_madrid_inmunizadas = obtenerUltimos7DatosInmunizadosConSalto (datosMadrid);

    dibujarGraficoMadridRecibidas2(ultimos7_variaciones_madrid_entragadas[0], ultimos7_variaciones_madrid_entragadas[1]);
    dibujarGraficoMadridAdministradas2(ultimos7_variaciones_madrid_administradas[0], ultimos7_variaciones_madrid_administradas[1]);
    dibujarGraficoMadridPautaCompleta2(ultimos7_variaciones_madrid_inmunizadas[0], ultimos7_variaciones_madrid_inmunizadas[1]);

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
    let porcentajeAlMenosUnaDosisMadrid = document.getElementById("porcentajeAlMenosUnaDosisMadrid");
   
   
    porcentajeAlMenosUnaDosisMadrid.innerHTML = (new Intl.NumberFormat("es-ES").format(porcentaje_con_al_menos_una_dosis));
    dosisAdministradasTotal.innerHTML = (new Intl.NumberFormat("es-ES").format(dosis_administradas));
    dosisDistribuidas.innerHTML = (new Intl.NumberFormat("es-ES").format(dosis_recibidas));
    

    console.log ("porcentaje_administradas_recibidas " +porcentaje_administradas_recibidas);
    let par = Number.parseFloat(porcentaje_administradas_recibidas.substr(0,porcentaje_administradas_recibidas.length-1).replace(',', '.'));
    console.log ("par " +par);
    porcentajeAdministradasTotal.innerHTML = (new Intl.NumberFormat("es-ES").format(par));
    pautaCompleta.innerHTML = (new Intl.NumberFormat("es-ES").format(personas_pauta_completa));
    porcenSobreTotalCompletas.innerHTML = (new Intl.NumberFormat("es-ES").format(porcentaje_poblacion_pauta_completa));
    console.log("Entregadas = " + dosis_recibidas + " % Entregadas " + porcentaje_recibidas_poblacion + " Administradas " + dosis_administradas + " % Administradas por Población " + porcentaje_recibidas_poblacion + " % Administradas por Recibidas " + porcentaje_administradas_recibidas + " Completa " + personas_pauta_completa + " % Completa " + porcentaje_poblacion_pauta_completa);
   
    fecha.innerHTML = ultimos_datos_Madrid[POS_FECHA_INFORME];
    fechaSlideTres.innerHTML = ultimos_datos_Madrid[POS_FECHA_INFORME];


}

//en el csv los datos llegan de la siguiente forma:
//madrid, posicion 14
//desde el final posicion  - 6, despues cada nueva fecha -20
// oden subarray posicion 0 fecha, posicion 5 dosis entregadas, posicion 6 dosis administradas,
//posicion 7 % sobre entregadas, posicion 8 pauta completada


//MEJORAMOS Y SÓLO SE DIBUJAN CON BARRAS LOS SALTOS CUANDO HAY VARIACIÓN
function dibujarGraficoMadridRecibidas2(ultimas8_fechas_Madrid, ultimas8_dosis_Madrid ) {

    let ctx = document.getElementById('myChartMadridEntregadas').getContext('2d');
    dibujargraficaBarrasVertical(ctx, ultimas8_fechas_Madrid.reverse(), ultimas8_dosis_Madrid.reverse(), 'rgb(16, 26, 214)', 'Vacunas distribuidas Madrid');

}


function dibujarGraficoMadridAdministradas2(fechas, datos) {


    let ctx = document.getElementById('myChartMadridAdministradas').getContext('2d');
    dibujarGraficaLinea(ctx, fechas.reverse(), datos.reverse(), 'rgb(226, 83, 3)', 'Vacunas administradas Madrid');

}


function dibujarGraficoMadridPautaCompleta2(fechas, datos) {


    let ctx = document.getElementById('myChartMadridCompletadas').getContext('2d');
    dibujarGraficaLinea(ctx, fechas.reverse(), datos.reverse(), 'rgb(83, 225, 162)', 'Vacunas pauta completa Madrid');
}



// --------------------- SLIDE 2: EVOLUCIÓN ESPAÑA POR FECHA ------------------------------------------//

function mostrarGraficoSaboresVacuna (porcentaje_pfizer, porcentaje_astrazeneca, porcentaje_moderna, porcentaje_jansen)
{
    let elemento_canvas_graficoSabores = document.getElementById("graficoSabores").getContext('2d');

   

    const data = {
        labels: [
          'Pfizer',
          'Astrazeneca',
          'Moderna',
          'Janssen'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [porcentaje_pfizer, porcentaje_astrazeneca, porcentaje_moderna, porcentaje_jansen],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb( 88, 214, 141)'
          ],
          hoverOffset: 5
        }]
      };

      const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            aspectRatio: 1.2
        }
      };

    var chart = new Chart(elemento_canvas_graficoSabores, config);
 
}

function muestraDatosVacunaEspanaDosPuntoCero(ultimos_datos_Espania) {


    let entregadas_total = ultimos_datos_Espania[POS_DOSIS_ENTREGADAS];
    let total_Pfizer = ultimos_datos_Espania[POS_DOSIS_PFIZER];
    let total_Moderna = ultimos_datos_Espania[POS_DOSIS_MODERNA];
    let total_Astrazenca = ultimos_datos_Espania[POS_DOSIS_ASTRAZENECA];
    let total_Janssen = ultimos_datos_Espania[POS_DOSIS_JANSSEN];
    let personas_con_al_menos_una_dosis_esp = ultimos_datos_Espania[POS_PERSONAS_CON_ALMENOS_UNA_DOSIS];
    let porcentaje_con_al_menos_una_dosis_esp = trunc((personas_con_al_menos_una_dosis_esp * 100) / POBLACION_ESPANIA, 2);


    let porcentajeAlMenosUnaDosisEsp = document.getElementById("porcentajeAlMenosUnaDosisEsp");
    porcentajeAlMenosUnaDosisEsp.innerHTML = (new Intl.NumberFormat("es-ES").format(porcentaje_con_al_menos_una_dosis_esp));

    let num_entregadas = document.getElementById("dosis_totales_ES");
    let chart1_texto = document.getElementById("chart1_text");
    
    let porcentaje_pfizer =  (total_Pfizer * 100 / entregadas_total).toFixed(2);
    let porcentaje_moderna =  (total_Moderna * 100 / entregadas_total).toFixed(2);
    let porcentaje_astrazeneca =  (total_Astrazenca * 100 / entregadas_total).toFixed(2);
    let porcentaje_jansen =  (total_Janssen * 100 / entregadas_total).toFixed(2);
    num_entregadas.innerHTML = (new Intl.NumberFormat("es-ES").format(entregadas_total));
    chart1_texto.innerHTML = "<b>" + (new Intl.NumberFormat("es-ES").format(porcentaje_pfizer)) + "%</b> de Pfizer <br><b>" +
    (new Intl.NumberFormat("es-ES").format(porcentaje_moderna)) + "% </b> de Moderna <br><b>" +
    (new Intl.NumberFormat("es-ES").format(porcentaje_astrazeneca)) + "% </b> de Astrazeneca<br><b>" +
    (new Intl.NumberFormat("es-ES").format(porcentaje_jansen)) + "% </b> de Janssen";
    mostrarGraficoSaboresVacuna (porcentaje_pfizer, porcentaje_astrazeneca, porcentaje_moderna, porcentaje_jansen);

    let admin_total = ultimos_datos_Espania[POS_DOSIS_ADMINISTRADAS];
    let admin_por_total = trunc((admin_total * 100) / POBLACION_ESPANIA, 3);
    let dosis_admin = document.getElementById("dosis_admin_ES");
    let chart2_texto = document.getElementById("chart2_text");
    console.log("admin_total", admin_total);
    dosis_admin.innerHTML =  (new Intl.NumberFormat("es-ES").format(admin_total));
    let pbae  =  (admin_total.replace('.', "") * 100 / entregadas_total).toFixed(2);
    chart2_texto.innerHTML = "El <b>" + (new Intl.NumberFormat("es-ES").format(pbae)) + "%</b> de vacunas recibidas ya han sido administradas";



    let adminx2_total = ultimos_datos_Espania[POS_PAUTA_COMPLETADA];
    let adminx2_por_total = trunc((adminx2_total * 100) / POBLACION_ESPANIA, 3);
    console.log("porcentaje inmunida2 = " + adminx2_por_total);

    let num_adminx2 = document.getElementById("pauta_comp_ES");
    console.log("pauta_comp", adminx2_total);
    num_adminx2.innerHTML = (new Intl.NumberFormat("es-ES").format(adminx2_total));
    document.getElementById("porcentajePoblacionInmuneES").innerHTML = (new Intl.NumberFormat("es-ES").format(trunc((adminx2_total * 100) / POBLACION_ESPANIA, 2)));

    let fecha = document.getElementById("fechaActu");
    fecha.innerHTML = ultimos_datos_Espania[POS_FECHA_INFORME];


}



function dibujarGraficoDosisEntregadasEspana2(fechas, datos) {

   // let ultimos7_registros_dosis_Entregadas_Espania = ultimos7_datos_Espania.map(registro => registro[POS_DOSIS_ENTREGADAS]);
    let ctx = document.getElementById('myChart').getContext('2d');

    dibujargraficaBarrasVertical (ctx, fechas.reverse(), datos.reverse(), 'rgb(16, 26, 214)', 'Vacunas distribuidas España');
    //dibujargraficaBarrasVertical
}



function dibujarGraficoDosisAdministradasEspana2(fechas, datos) {


   // let ultimos7_registros_dosis_Administradas_Espania = ultimos7_datos_Espania.map(registro => registro[POS_DOSIS_ADMINISTRADAS]);
    let ctx = document.getElementById('myChartAdministradas').getContext('2d');

    dibujarGraficaLinea(ctx, fechas.reverse(), datos.reverse(), 'rgb(226, 83, 3)', 'Vacunas administradas España');

}



function dibujarGraficoInmunesEspana2(fechas, datos) {

    //let ultimos7_registros_dosis_PautaCompleta_Espania = ultimos7_datos_Espania.map(registro => registro[POS_PAUTA_COMPLETADA]);
    let ctx = document.getElementById('myChartCompletada').getContext('2d');

    dibujarGraficaLinea(ctx, fechas.reverse(), datos.reverse(), 'rgb(83, 225, 162)', 'Vacunas pauta completa España');

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

   // for (let i = (datos.length - 20); i < datos.length; i++) {
    for (let i = (datos.length - NUMERO_CCAA_VACUNA); i < datos.length; i++) {
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
    dibujargraficaBarras(ctx3, ccaa, dosis_adminx2, 'rgb(83, 225, 162)', "Personas pauta completa por CCAA");
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

        options: {
            responsive: true,
            aspectRatio: 1,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        userCallback: function(value, index, values) {
                            return value.toLocaleString();   // this is all we need
                        }
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
        type: 'horizontalBar',

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
            aspectRatio: 0.7,
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


function dibujargraficaBarrasVertical(ctx, ejeX, ejeY, color, leyenda) {

    //OBTENERLOS DATOS
    var chart = new Chart(ctx, {
        type: 'bar',

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
            aspectRatio: 1,//más pequeño, más grande se ve
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            userCallback: function(value, index, values) {
                                return value.toLocaleString();   // this is all we need
                            }
                        }
                    }
                ]
            }
        }
    })
}

function vistaAutocita ()
{
    window.open("https://autocitavacuna.sanidadmadrid.org/ohcitacovid/", "_blank");
}