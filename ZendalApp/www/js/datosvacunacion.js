this.onload = carga;

function carga() {

    //muestra spinner 'Cargandoo...' mientras se abre la pagina
    presentLoading();

    //funcion que recoge los datos del github de la web de civio para pintar las graficas de los datos
    //de la comunidad de madrid
    //https://raw.githubusercontent.com/civio/covid-vaccination-spain/main/data.csv
    parseaGraficosCSVMadrid();

}

//necesario para que funcione el menu lateral
async function openMenu() {

    await menuController.open();

}

//necesario para que funcione el spiner de carga de la pagina
async function presentLoading() {

    const loading = await loadingController.create({
        message: 'Cargando...',
        duration: 500
    });

    await loading.present();
}

// --------------------- ACCESO A DATOS ---------------------------------//


// URL del csv de la pagina de civio para pintar los graficos de datos de vacunacion de Madrid
const URL_GRAFICOS_MADRID = "https://raw.githubusercontent.com/civio/covid-vaccination-spain/main/data.csv";



// coge el csv de la pagina de civio para pintar los graficos de datos de vacunacion de Madrid
function parseaGraficosCSVMadrid() {

    console.log("parseaGraficosCSVMadrid");
    fetch(URL_GRAFICOS_MADRID)
        .then(response => response.text())
        .then(data => {
            let array_datos_parseado = parseCSV(data);

            ///lo que hay que añadir a parseaGraficosCSVMadrid
            console.log (array_datos_parseado);

            muestraDatosVacunaMadridDosPuntoCero(array_datos_parseado);
            muestraDatosVacunaEspanaDosPuntoCero(array_datos_parseado);



            //---- SLIDE 1 -----     
            dibujarGraficoMadrid(array_datos_parseado);

            dibujarGraficoDosisAdministradasMadrid(array_datos_parseado);

            dibujarGraficoDosisPautaCompletaMadrid(array_datos_parseado);

            //---- SLIDE 2 -----
            dibujarGraficoDosisEntregadasEspana(array_datos_parseado);

            dibujarGraficoDosisAdministradasEspana(array_datos_parseado);

            dibujarGraficoInmunesEspana(array_datos_parseado);

            //---- SLIDE 3 -----
            // Ultimos datos por CCAA
            dibujarGraficosCCAA(array_datos_parseado);

        })
        .catch(error => mostrarToast());

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

        // If the current character is a quotation mark, and we're inside a
        // quoted field, and the next character is also a quotation mark,
        // add a quotation mark to the current column and skip the next character
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }

        // If it's just one quotation mark, begin/end quoted field
        if (cc == '"') { quote = !quote; continue; }

        // If it's a comma and we're not in a quoted field, move on to the next column
        if (cc == ',' && !quote) { ++col; continue; }

        // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
        // and move on to the next row and move to column 0 of that new row
        if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }

        // If it's a newline (LF or CR) and we're not in a quoted field,
        // move on to the next row and move to column 0 of that new row
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }
        if (cc == '\r' && !quote) { ++row; col = 0; continue; }

        // Otherwise, append the current character to the current column
        arr[row][col] += cc;
    }
    //console.log(arr);
    return arr;
}



/**
 * 
 0:fecha informe
​​​
1: "comunidad autónoma"
​​​
2: "dosis Pfizer"
​​​
3: "dosis Moderna"
​​​
4: "dosis AstraZeneca"
​​​
5: "dosis entregadas"
​​​
6: "dosis administradas"
​​​
7: "% sobre entregadas"
​​​
8: "personas con pauta completa"
​​​
9: "última vacuna registrada"} datos 
 */
// --------------------- SLIDE 1: EVOLUCIÓN MADRID POR FECHA -----------------------------------------//

function muestraDatosVacunaMadridDosPuntoCero(datos) {

    let poblacionMadrid = 6779888;

    let longitudDosisEntregadas = datos.length;
    //el primer dato de madrid aparece en la posicion 7 empezando desde el final
    longitudDosisEntregadas = longitudDosisEntregadas - 7;
    let dosis = datos[longitudDosisEntregadas];

    //dosis entregadas esta en la posicion 4 empezando desde el principio
    //corejimos ajora estaá ne 5
    let numeroFormateado = dosis[5];

    let porcentajeEntregadas = trunc((dosis[5].replace('.', "") * 100) / poblacionMadrid, 3);

    //la cifra con las dosis administradas esta en la posicion 5 del array resultante
    //corejimos ahora está en 6
    let dosisAdministradas = dosis[6];

    let porcentPoblacionMadridAdministradas = trunc((dosis[6].replace('.', "") * 100) / poblacionMadrid, 3);

    let porcentajeAdministradasSobreTotal = (dosis[6].replace('.', "") * 100) / dosis[5].replace('.', "");
    porcentajeAdministradasSobreTotal = trunc(porcentajeAdministradasSobreTotal, 2);

    //el dato de personas con pauta completa aparece en la posicion 7 del array resultante
    //corejimos ahora en la 8
    let dosDosis = dosis[8];

    let porcentajeCompletTotal = trunc(((dosis[8].replace('.', "") * 100) / poblacionMadrid), 3);

    let dosisDistribuidas = document.getElementById("dosisDistribuidas");
    let porcentajeDosisEntregadas = document.getElementById("porcentajeDosisEntregadas");
    let dosisAdministradasTotal = document.getElementById("dosisAdministradas");
    let porcentajeMadridAdministradas = document.getElementById("porcentajePoblacionAdministradas");
    let porcentajeAdministradasTotal = document.getElementById("porcentajeAdministradasTotal");
    let pautaCompleta = document.getElementById("pautaCompleta");
    let porcenSobreTotalCompletas = document.getElementById("porcenSobreTotalCompletas");
    let fecha = document.getElementById("fechaAct");
    let fechaSlideTres = document.getElementById("fechaActua");

    porcentajeDosisEntregadas.innerHTML = porcentajeEntregadas
    dosisAdministradasTotal.innerHTML = dosisAdministradas;
    porcentajeMadridAdministradas.innerHTML = porcentPoblacionMadridAdministradas;
    dosisDistribuidas.innerHTML = numeroFormateado;
    porcentajeAdministradasTotal.innerHTML = porcentajeAdministradasSobreTotal;
    pautaCompleta.innerHTML = dosDosis;
    porcenSobreTotalCompletas.innerHTML = porcentajeCompletTotal;
    //alert("fecha " + dosis[0]);
    fecha.innerHTML = dosis[0];
    fechaSlideTres.innerHTML = dosis[0];


}

//en el csv los datos llegan de la siguiente forma:
//madrid, posicion 14
//desde el final posicion  - 6, despues cada nueva fecha -20
// oden subarray posicion 0 fecha, posicion 5 dosis entregadas, posicion 6 dosis administradas,
//posicion 7 % sobre entregadas, posicion 8 pauta completada

function dibujarGraficoMadrid(datos) {
    // let arrayDatos = datos;
    //muestraDatosVacunaMadridDosPuntoCero(arrayDatos);

    //en este caso el csv es un array en el q cada elemento del array es otro array con los datos de cada
    //fila del csv
    let fechas = [];
    let indiceMadridDesdeElFinal = datos.length;
    //madrid esta en la posicion 7 del array de arrays empezando desde el final
    indiceMadridDesdeElFinal = indiceMadridDesdeElFinal - 7;
    console.log("longitud datos ", indiceMadridDesdeElFinal);
    let i = 0;

    while (i < 7) {
        //se recoge el array de la posicion 7 desde el final, q es donde esta el primer dato de madrid
        let formatFecha = datos[indiceMadridDesdeElFinal];
        //en el array resultando las fechas estan en la posicion 0 (la primera del array)
        fechas.push(formatFecha[0]);
        //en el array de arrays cada dato de madrid esta cada 20 posiciones empezando por el final
        indiceMadridDesdeElFinal = indiceMadridDesdeElFinal - 20;
        i++;
    }
    //se da la vuelta al array para que las fechas queden en orden cronologico
    fechas = fechas.reverse();
    i = 0;
    let longitudDosisEntregadas = datos.length;
    //se recoge el array de la posicion 7 desde el final, q es donde esta el primer dato de madrid
    longitudDosisEntregadas = longitudDosisEntregadas - 7;
    let dosisEntregadas = [];

    while (i < 7) {

        let dosis = datos[longitudDosisEntregadas];
        //en el array resultante que cogemos del array de arrays, el dato de dosis entregadas
        //de madrid esta en la posicion 4 empezando desde el principio
        //correjimos en la 5
        dosisEntregadas.push(dosis[5].replace('.', ""));
        //en el array de arrays cada dato de madrid esta cada 20 posiciones empezando por el final
        longitudDosisEntregadas = longitudDosisEntregadas - 20;
        i++;
    }
    //se da la vuelta al array para que las dosis entregadas queden en orden cronológico
    dosisEntregadas.reverse();

    let ctx = document.getElementById('myChartMadridEntregadas').getContext('2d');

    dibujarGraficaLinea(ctx, fechas, dosisEntregadas, 'rgb(16, 26, 214)', 'Vacunas distribuidas Madrid');

}

//grafico de dosis administradas Madrid
function dibujarGraficoDosisAdministradasMadrid(datos) {

    let fechas = [];
    let indiceMadridDesdeElFinal = datos.length;
    //el primer dato de madrid empieza en el array de arrays en la posicion 7 empezando por el final
    indiceMadridDesdeElFinal = indiceMadridDesdeElFinal - 7;
    console.log("longitud datos ", indiceMadridDesdeElFinal);
    let i = 0;

    while (i < 7) {
        //agregamos las fechas cada 20 posiciones
        let formatFecha = datos[indiceMadridDesdeElFinal];
        //en el array resultante la fecha esta en la posicion 0
        fechas.push(formatFecha[0]);
        //el dato de madrid esta cada 20 posiciones empezando por el final
        indiceMadridDesdeElFinal = indiceMadridDesdeElFinal - 20;
        i++;
    }
    //se le da la vuelta al array para que salga en orden cronologico
    fechas = fechas.reverse();

    i = 0;
    let longitudDosisEntregadas = datos.length;
    //el primer dato de madrid empieza en el array de arrays en la posicion 7 empezando por el final

    longitudDosisEntregadas = longitudDosisEntregadas - 7;
    //el array es de dosis administradas, aunque en el nombre figure 'entregadas'
    let dosisEntregadas = [];

    while (i < 7) {

        let dosis = datos[longitudDosisEntregadas];
        //la cifra con las dosis administradas esta en la posicion 5 del array resultante
        //6 correjimos
        dosisEntregadas.push(dosis[6].replace('.', ""));
        //el dato de madrid esta cada 20 posiciones empezando por el final
        longitudDosisEntregadas = longitudDosisEntregadas - 20;
        i++;
    }
    //se le da la vuelta al array para que salga en orden cronológico
    dosisEntregadas.reverse();

    let ctx = document.getElementById('myChartMadridAdministradas').getContext('2d');
    
    dibujarGraficaLinea(ctx, fechas, dosisEntregadas, 'rgb(226, 83, 3)', 'Vacunas administradas Madrid');

}

//dibuja grafico personas con las dos dosis administrada Madrid
function dibujarGraficoDosisPautaCompletaMadrid(datos) {

    let fechas = [];
    let indiceMadridDesdeElFinal = datos.length;
    //el primer dato de madrid aparece en la posicion 7 empezando desde el final
    indiceMadridDesdeElFinal = indiceMadridDesdeElFinal - 7;
    console.log("longitud datos ", indiceMadridDesdeElFinal);
    let i = 0;

    while (i < 7) {

        let formatFecha = datos[indiceMadridDesdeElFinal];
        //la fecha en el array resultante esta en la posicion 0
        fechas.push(formatFecha[0]);
        //en el array de arrays cada dato de madrid esta cada 20 posiciones empezando desde el final
        indiceMadridDesdeElFinal = indiceMadridDesdeElFinal - 20;
        i++;
    }
    //damos la vuelta al array de fechas para que salga en orden cronologico
    fechas = fechas.reverse();

    i = 0;
    let longitudDosisEntregadas = datos.length;
    //el primer dato de madrid aparece en la posicion 7 empezando desde el final
    longitudDosisEntregadas = longitudDosisEntregadas - 7;
    //el array esde personas con pauta completada, aunque en el nombre aparezca 'dosis entregadas'
    let dosisEntregadas = [];

    while (i < 7) {

        let dosis = datos[longitudDosisEntregadas];
        //el dato de personas con pauta completa aparece en la posicion 7 del array resultante
        //8 correjimos
        dosisEntregadas.push(dosis[8].replace('.', ""));
        //en el array de arrays cada dato de madrid esta cada 20 posiciones empezando desde el final
        longitudDosisEntregadas = longitudDosisEntregadas - 20;
        i++;
    }
    //damos la vuelta al array de pauta completada para que salga en orden cronológico
    dosisEntregadas.reverse();

    let ctx = document.getElementById('myChartMadridCompletadas').getContext('2d');
    
    dibujarGraficaLinea(ctx, fechas, dosisEntregadas, 'rgb(83, 225, 162)', 'Vacunas pauta completa Madrid');
}


// --------------------- SLIDE 2: EVOLUCIÓN ESPAÑA POR FECHA ------------------------------------------//


function muestraDatosVacunaEspanaDosPuntoCero(datos) {

    let longitudDosisEntregadas = datos.length - 1;
    //El ultimo array del último array son los datos totales (España) más recientes

    let dosis = datos[longitudDosisEntregadas];

    let poblacionEs = 47329000;
    //correjimos 5 x4
    let entregadas_total = dosis[5].replace('.', "");
    //indice 2 pfizer
    let total_Pfizer = dosis[2].replace('.', "");
    //indice 3 moderna
    let total_Moderna = dosis[3].replace('.', "");
    //indice 4 astraznca
    let total_Astrazenca = dosis[4].replace('.', "");


    let num_entregadas = document.getElementById("dosis_totales_ES");
    let chart1_texto = document.getElementById("chart1_text");

    //corejimos a 5
    num_entregadas.innerHTML = dosis[5];
    chart1_texto.innerHTML = "<b>" + (total_Pfizer * 100 / entregadas_total).toFixed(2) + "%</b> de Pfizer <br><b>" +
        trunc((((total_Moderna * 100) / entregadas_total) * 0.001), 2) + "% </b> de Moderna <br><b>"+
        trunc((((total_Astrazenca * 100) / entregadas_total) * 0.001), 2) + "% </b> de Astrazenca";
     /*   chart1_texto.innerHTML = "En España se han entregado un total de <b>" + dosis[4] +
        "</b> dosis de las cuales el <b>" + (total_Pfizer * 100 / entregadas_total).toFixed(2) + "%</b> de Pfizer y el <b>" +
        trunc((((total_Moderna * 100) / entregadas_total) * 0.001), 2) + "% </b> de Moderna.";*/

//correjimos a 6
    let admin_total = dosis[6];
    //correjimos a 6
    let admin_por_total = trunc((dosis[6].replace('.', "") * 100) / poblacionEs, 3);
    let dosis_admin = document.getElementById("dosis_admin_ES");
    let chart2_texto = document.getElementById("chart2_text");
    console.log("admin_total", admin_total);
    dosis_admin.innerHTML = admin_total;
    chart2_texto.innerHTML = "El <b>" +(admin_total.replace('.', "") * 100 / entregadas_total).toFixed(2) + "%</b> de vacunas recibidas ya han sido administradas";
    
        /*chart2_texto.innerHTML = "En España se han administrado <b>" + admin_total +
        "</b> dosis que son el <b>" + (admin_total.replace('.', "") * 100 / entregadas_total).toFixed(2) + "%</b> de las dosis entregadas y el <b>" +
        admin_por_total + "%</b> de la población." */

//correimos pauta completa es 8
    let adminx2_total = dosis[8];
    //fallo grave. hay que hacer replaceALl y no replace... si no solo cambia el primer punto y los millones los hace mal
    let adminx2_por_total = trunc((dosis[8].replaceAll('.', "") * 100) / poblacionEs, 3);
    //let adminx2_por_total = trunc(adminx2_total / poblacionEs, 3);
    console.log("porcentaje inmunida2 = "+ adminx2_por_total);

    let num_adminx2 = document.getElementById("pauta_comp_ES");
    let chart3_texto = document.getElementById("chart3_text");
    console.log("pauta_comp", adminx2_total);
    num_adminx2.innerHTML = adminx2_total;
    chart3_texto.innerHTML = "<b>" + adminx2_por_total + "%</b> de la población";

        /*chart3_texto.innerHTML = "En España ya hay <b>" + adminx2_total +
        "</b> personas con la pauta completa administrada.<br>Esto es el <b>" + adminx2_por_total + "%</b> de la población."*/
    let fecha = document.getElementById("fechaActu");
    fecha.innerHTML = dosis[0];
}

//grafico de dosis administradas España
function dibujarGraficoDosisEntregadasEspana(datos) {

    let fechas = [];
    let indiceTotalesDesdeElFinal = datos.length;
    //El ultimo array del último array son los datos totales (España) más recientes
    indiceTotalesDesdeElFinal = indiceTotalesDesdeElFinal - 1;
    //console.log("longitud datos " + indiceTotalesDesdeElFinal);
    let i = 0;

    while (i < 7) {
        //agregamos las fechas cada 20 posiciones
        let formatFecha = datos[indiceTotalesDesdeElFinal];
        //en el array resultante la fecha esta en la posicion 0
        fechas.push(formatFecha[0]);
        //el dato de totales esta cada 20 posiciones empezando por el final
        indiceTotalesDesdeElFinal = indiceTotalesDesdeElFinal - 20;
        i++;
    }
    //se le da la vuelta al array para que salga en orden cronologico
    fechas = fechas.reverse();

    i = 0;
    let longitudDosisEntregadas = datos.length;
    //El ultimo array del último array son los datos totales (España) más recientes
    longitudDosisEntregadas = longitudDosisEntregadas - 1;
    //el array es de dosis administradas, aunque en el nombre figure 'entregadas'
    let dosisEntregadas = [];

    while (i < 7) {

        let dosis = datos[longitudDosisEntregadas];
        //la cifra con las dosis administradas esta en la posicion 5 del array resultante
        //correjimos a 5
        dosisEntregadas.push(dosis[5].replace(/[$.]/g, ''));
        //el dato de totales esta cada 20 posiciones empezando por el final
        longitudDosisEntregadas = longitudDosisEntregadas - 20;
        i++;
    }
    //se le da la vuelta al array para que salga en orden cronológico
    dosisEntregadas.reverse();

    let ctx = document.getElementById('myChart').getContext('2d');

    dibujarGraficaLinea(ctx, fechas, dosisEntregadas, 'rgb(16, 26, 214)', 'Vacunas distribuidas España');

}

function dibujarGraficoDosisAdministradasEspana(datos) {

    let fechas = [];
    let indiceTotalesDesdeElFinal = datos.length;
    //El ultimo array del último array son los datos totales (España) más recientes
    indiceTotalesDesdeElFinal = indiceTotalesDesdeElFinal - 1;
    //console.log("longitud datos " + indiceTotalesDesdeElFinal );
    let i = 0;

    while (i < 7) {
        //agregamos las fechas cada 20 posiciones
        let formatFecha = datos[indiceTotalesDesdeElFinal];
        //en el array resultante la fecha esta en la posicion 0
        fechas.push(formatFecha[0]);
        //el dato de totales esta cada 20 posiciones empezando por el final
        indiceTotalesDesdeElFinal = indiceTotalesDesdeElFinal - 20;
        i++;
    }
    //se le da la vuelta al array para que salga en orden cronológico
    fechas = fechas.reverse();

    i = 0;
    let longitudDosisEntregadas = datos.length;
    //El ultimo array del último array son los datos totales (España) más recientes
    longitudDosisEntregadas = longitudDosisEntregadas - 1;
    //el array es de dosis administradas, aunque en el nombre figure 'entregadas'
    let dosisEntregadas = [];

    while (i < 7) {

        let dosis = datos[longitudDosisEntregadas];
        //la cifra con las dosis administradas esta en la posicion 5 del array resultante
        //correjimos a 6
        dosisEntregadas.push(dosis[6].replace(/[$.]/g, ''));
        //el dato de totales esta cada 20 posiciones empezando por el final
        longitudDosisEntregadas = longitudDosisEntregadas - 20;
        i++;
    }
    //se le da la vuelta al array para que salga en orden cronológico
    dosisEntregadas.reverse();

    let ctx = document.getElementById('myChartAdministradas').getContext('2d');

    dibujarGraficaLinea(ctx, fechas, dosisEntregadas, 'rgb(226, 83, 3)', 'Vacunas administradas España');

}

function dibujarGraficoInmunesEspana(datos) {

    let fechas = [];
    let indiceTotalesDesdeElFinal = datos.length;
    //El ultimo array del último array son los datos totales (España) más recientes
    indiceTotalesDesdeElFinal = indiceTotalesDesdeElFinal - 1;
    //console.log("longitud datos " + indiceTotalesDesdeElFinal);
    let i = 0;

    while (i < 7) {
        //agregamos las fechas cada 20 posiciones
        let formatFecha = datos[indiceTotalesDesdeElFinal];
        //en el array resultante la fecha esta en la posicion 0
        fechas.push(formatFecha[0]);
        //el dato de totales esta cada 20 posiciones empezando por el final
        indiceTotalesDesdeElFinal = indiceTotalesDesdeElFinal - 20;
        i++;
    }
    //se le da la vuelta al array para que salga en orden cronológico
    fechas = fechas.reverse();

    i = 0;
    let longitudDosisEntregadas = datos.length;
    //El ultimo array del último array son los datos totales (España) más recientes
    longitudDosisEntregadas = longitudDosisEntregadas - 1;
    //el array es de dosis administradas, aunque en el nombre figure 'entregadas'
    let dosisEntregadas = [];

    while (i < 7) {

        let dosis = datos[longitudDosisEntregadas];
        //la cifra con las dosis administradas esta en la posicion 5 del array resultante
        //correjimos inmunizados a 8
        dosisEntregadas.push(dosis[8].replace(/[$.]/g, ''));
        //el dato de totales esta cada 20 posiciones empezando por el final
        longitudDosisEntregadas = longitudDosisEntregadas - 20;
        i++;
    }
    //se le da la vuelta al array para que salga en orden cronologico
    dosisEntregadas.reverse();

    let ctx = document.getElementById('myChartCompletada').getContext('2d');

    dibujarGraficaLinea(ctx, fechas, dosisEntregadas, 'rgb(83, 225, 162)', 'Vacunas pauta completa España');

}


// --------------------- SLIDE 3: ÚLTIMOS DATOS POR CCAA ---------------------------------//

// El último array con 20 arrays son los datos mas recientes: 17 x CCAA + Ceuta + Melilla + Totales
// Las posiciones que nos interesan:
// [0]=fecha informe ;[1]= ccaa, [4]= dosis entregadas, [5]=dosis admin, [6]=% admin sobre entregadas, 
// [7]= pauta completa[8] = fecha ultima vacuna registrada.

function dibujarGraficosCCAA(datos) {

    //Datos totales mas recientes
    let datos_totales = datos.pop();


    // Datos de CCAA mas recientes
    let ccaa = [];
    let dosis_admin = [];
    let dosis_entregadas = [];
    let dosis_adminx2 = [];
    let dosis_por_admin = [];

    for (let i = (datos.length - 19); i < datos.length; i++) {
        ccaa.push(datos[i][1]);
        //corregimos por 5 6 7 8
        dosis_admin.push(Number.parseInt(datos[i][6].replaceAll(".", "")));
        dosis_entregadas.push(Number.parseInt(datos[i][5].replaceAll(".", "")));
        dosis_adminx2.push(Number.parseInt(datos[i][8].replaceAll(".", "")));
        Number.parseFloat(dosis_por_admin.push(datos[i][7].replaceAll("%", "").replace(",", ".")));
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