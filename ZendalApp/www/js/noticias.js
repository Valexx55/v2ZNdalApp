onload = cargarDatos;

function cargarDatos() {
  
    fetch("https://www.who.int/feeds/entity/csr/don/es/rss.xml")
        .then(response => response.text())
        .then(str => {
          let datos = new window.DOMParser().parseFromString(str, "text/xml");
          mostrarDatos(datos);
        })
        .catch(error => mostrarToast());
        
      //  .then(data => mostrarDatos(data)) 
   
}

function traducirFecha(fecha){
    let resultado;
    if (fecha.substring(3,6)=='Jan'){
        resultado = fecha.replace('Jan', 'Enero');
    }else if(fecha.substring(3,6)=='Feb'){
        resultado = fecha.replace('Feb', 'Febrero');
    }else if(fecha.substring(3,6)=='Mar'){
        resultado = fecha.replace('Mar', 'Marzo');
    }else if(fecha.substring(3,6)=='Apr'){
        resultado = fecha.replace('Apr', 'Abril');
    }else if(fecha.substring(3,6)=='May'){
        resultado = fecha.replace('May', 'Mayo');
    }else if(fecha.substring(3,6)=='Jun'){
        resultado = fecha.replace('Jun', 'Junio');
    }else if(fecha.substring(3,6)=='Jul'){
        resultado = fecha.replace('Jul', 'Julio');
    }else if(fecha.substring(3,6)=='Aug'){
        resultado = fecha.replace('Aug', 'Agosto');
    }else if(fecha.substring(3,6)=='Sep'){
        resultado = fecha.replace('Sep', 'Septiembre');
    }else if(fecha.substring(3,6)=='Oct'){
        resultado = fecha.replace('Oct', 'Octubre');
    }else if(fecha.substring(3,6)=='Nov'){
        resultado = fecha.replace('Nov', 'Noviembre');
    }else if(fecha.substring(3,6)=='Dec'){
        resultado = fecha.replace('Dec', 'Diciembre');
    }
    return resultado;
}
function mostrarDatos(data){
    console.log(data);
    //alert ("noticias = " + data);
    //guardo los artículos de noticias del xml en un array
    guardoArticulosPrensa(data);
   
}
function guardoArticulosPrensa(data){
    var xml = data;
    var array_noticias =  xml.getElementsByTagName("item");
     //muestro en la página los artículos de prensa
     visualizoNoticias(array_noticias);
}
function visualizoNoticias(array_noticias){
    //selecciono el punto de anclaje de documento
    var etiqueta_list = document.getElementById("lista");
    //recorro el array con cada noticia a mostrar
    for (let i=0;i<array_noticias.length; i++){
        //creo etiquetas ionic
        let item = document.createElement("ion-item");
        let label = document.createElement("ion-label");
        let h2 = document.createElement("h2");
        let h3 = document.createElement("h3");
        let p = document.createElement("p");
        let nuevoa = document.createElement("a");
        let intro1 = document.createElement("br");
        let intro2 = document.createElement("br");
        //guardo las etiquetas que me interesan de cada artículo de prensa
        let fecha = array_noticias[i].getElementsByTagName("pubDate");
        let titulo = array_noticias[i].getElementsByTagName("title");
        let texto = array_noticias[i].getElementsByTagName("description");
        //add vale
        let enlace = array_noticias[i].getElementsByTagName("link");
        //meto en las etiquetas ionic el contenido html de las etiquetas xml que guardé
        let fecha_ingles = fecha.item(0).innerHTML.substring(5,16);//solo guardo una parte de la fecha/hora
        let fecha_castellano = traducirFecha(fecha_ingles); //traducir la fecha
        h2.innerHTML = fecha_castellano;
        h3.innerHTML = titulo.item(0).innerHTML;
        p.innerHTML = texto.item(0).innerHTML;
        p.style.textAlign='justify';
        nuevoa.href= enlace.item(0).innerHTML;
        //alert ("enlace =  "+ nuevoa.href);
        nuevoa.innerHTML= "Leer más";
        //paso etiquetas dentro de ionic-label
        label.appendChild(h2);
        label.appendChild(h3);
        //label.appendChild(intro1);
        label.appendChild(p);
        label.appendChild(nuevoa);
        //label.appendChild(intro2);
        //paso dentro de ionic-list el ionic-label con todo el contenido
        //etiqueta_list.appendChild(label);
        item.appendChild(label);
        etiqueta_list.appendChild(item);
    }
}