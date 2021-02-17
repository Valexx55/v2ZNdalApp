let array_sintomas_habituales = [];
let array_sintomas_no_habituales = [];
let mensaje_cronica = "";
let mensaje_habitual = "";
let mensaje_no_habitual = "";
let es_cronica;


onload = inicializar();

function inicializar() {
    //declaracion del slide
    var slides = document.querySelector('ion-slides');

    // añado un escuchador a cada radiobutton de cada pagina
    var hijos = document.querySelectorAll("ion-radio");
    for (unHijo of hijos) {
        unHijo.addEventListener("click", function (evt) {
            var hijo = evt.target;
            id_hijo = hijo.id;
            console.log("Se hizo click en", hijo);
            slides.slideNext(800);
        });
    }


}


// para el boton de realizar test
function realizarTest() {

    array_sintomas_habituales = [];
    array_sintomas_no_habituales = [];
    es_cronica = "";

    //cronica
    let valor0 = document.querySelector("ion-radio-group[name=pregunta0]").value;
    if (!valor0) {
        valor0 = "0"
    }
    console.log("pregunta0 " + valor0);
    es_cronica = valor0;



    //sintomas habituales
    let valor1 = document.querySelector("ion-radio-group[name=pregunta1]").value;
    if (!valor1) {
        valor1 = "0"
    }
    console.log("pregunta1 " + valor1);
    array_sintomas_habituales.push(valor1);

    let valor2 = document.querySelector("ion-radio-group[name=pregunta2]").value;
    if (!valor2) {
        valor2 = "0"
    }
    console.log("pregunta2 " + valor2);
    array_sintomas_habituales.push(valor2);

    let valor3 = document.querySelector("ion-radio-group[name=pregunta3]").value;
    if (!valor3) {
        valor3 = "0"
    }
    console.log("pregunta3 " + valor3);
    array_sintomas_habituales.push(valor3);

    let valor4 = document.querySelector("ion-radio-group[name=pregunta4]").value;
    if (!valor4) {
        valor4 = "0"
    }
    console.log("pregunta4 " + valor4);
    array_sintomas_habituales.push(valor4);


    let valor6 = document.querySelector("ion-radio-group[name=pregunta6]").value;
    if (!valor6) {
        valor6 = "0"
    }
    console.log("pregunta6 " + valor6);
    array_sintomas_habituales.push(valor6);

    let valor8 = document.querySelector("ion-radio-group[name=pregunta8]").value;
    if (!valor8) {
        valor8 = "0"
    }
    console.log("pregunta8 " + valor8);
    array_sintomas_habituales.push(valor8);


    //sintomas menos habituales
    let valor5 = document.querySelector("ion-radio-group[name=pregunta5]").value;
    if (!valor5) {
        valor5 = "0"
    }
    console.log("pregunta5 " + valor5);
    array_sintomas_no_habituales.push(valor5);

    let valor7 = document.querySelector("ion-radio-group[name=pregunta7]").value;
    if (!valor7) {
        valor7 = "0"
    }
    console.log("pregunta7 " + valor7);
    array_sintomas_no_habituales.push(valor7);


    console.log(array_sintomas_habituales);
    console.log(array_sintomas_no_habituales);


    let estanTodasHabituales = array_sintomas_habituales.find(elemento => elemento == "0");
    let estanTodasNoHabituales = array_sintomas_no_habituales.find(elemento => elemento == "0");

    if (estanTodasHabituales || estanTodasNoHabituales) {
        alert("faltan preguntas por contestar");
    } else {
        valorarRespuesta();
        presentAlert();
    }

}

function valorarRespuesta() {

    let habituales_si = array_sintomas_habituales.filter(filtro => filtro == "si");
    let no_habituales_si = array_sintomas_no_habituales.filter(filtro => filtro == "si");

    if (habituales_si.length == 0 && no_habituales_si.length == 0) {
        mensaje_habitual = "No tiene síntomas.<br>Siga cumpliendo con las medidas prevención";

    } else {
        if (habituales_si.length == 1 || no_habituales_si.length != 0) {
            mensaje_habitual = "No presenta síntomas concluyentes";
        }
        if (habituales_si.length > 1) {
            mensaje_habitual = "Presenta una sintomatología compatible <br> Debería ponerse en contacto con su centro de salud";
        }
    }
    if (es_cronica == "si") {
        mensaje_cronica = "<br> Por su situación de enfermo crónico debe extremar las  medidas sanitarias de prevencíon";
    }

}

function presentAlert() {
    const alert = document.createElement('ion-alert');
    alert.cssClass = 'my-custom-class';
    alert.header = 'Test Realizado';
    //alert.subHeader = 'Subtitle';
    alert.message = mensaje_habitual + mensaje_cronica;
    alert.buttons = ['OK'];

    document.body.appendChild(alert);
    return alert.present();
}

function reiniciarTest() {
  
    location.reload();
}






