/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready


document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    //alert("dispo iniciado");
    document.addEventListener("backbutton", botonHaciaAtras, false);
    //alert("atrás programado");

    document.addEventListener("online", avisoOnline, false);
    document.addEventListener("offline", avisoOffline, false);
    
    let pag_actual = obtenerPaginaActual();
    if (pag_actual=="index.html")
    {
        let valor = JSON.parse(localStorage.getItem("Checkeado"));
        if (!valor)
        {
            mostramosAvisoGPS();
        }
    }
   

}


async function mostramosAvisoGPS() {
    const alert = await alertController.create({
      header: 'ADVERTENCIA',
      message: 'Si no tiene activado el GPS, el mapa no puede mostrar su posición',
      inputs: [{type:'checkbox',label:'No volver a mostrar', handler:(e)=>{console.log(e.checked),localStorage.setItem("Checkeado",JSON.stringify(e.checked))}}],
      buttons: ['aceptar']
      

    });

    await alert.present();
}
    


function botonHaciaAtras() {
    let pagina_actual = obtenerPaginaActual();
    if (pagina_actual.localeCompare("index.html")==0)
    {
        salir2();
    } else {
        navigator.app.backHistory();
    }
    
}





async function avisoOffline() {

    alerta = await alertController.create({
        header: 'Error acceso a internet',
        message: 'La aplicación requiere acceso a internet. Por favor, conecte los datos o pulse salir.',
        buttons: [{
            text: 'Salir',
            handler: () => {
                navigator.app.exitApp();
            }
        }]
    });

    await alerta.present();
}

function avisoOnline() {
    if (alerta != null) {
        alerta.dismiss();
        location.reload();
    }
}



async function salir2() {
    const alert = await alertController.create({
        header: 'AVISO',
        message: '¿Desea salir del programa?',
        buttons: [{
            text: 'NO',
            role: 'cancel',
            cssClass: 'secondary'
        }, {
            text: 'SÍ',
            handler: () => {
                navigator.app.exitApp();
            }
        }]
    });

    await alert.present();
}

function obtenerPaginaActual ()
{
    let pag_actual ='';
    let ruta_actual = '';
    
        ruta_actual = location.href;
        pag_actual = ruta_actual.substr(ruta_actual.lastIndexOf('/') + 1);

    return pag_actual;
}
/**
 * Esta función se invoca al tocar el botón de meud
 * @param la pagina a la que el usuario quiere diriirse 
 */
function cambiaPagina(pagina) {

   // let ruta_actual = location.href;
    let pag_actual = obtenerPaginaActual();// ruta_actual.substr(ruta_actual.lastIndexOf('/') + 1);

    if (pagina.localeCompare("salir") == 0) {
        navigator.app.exitApp();//preguntarle complica el código tontamente. si le da a salir del menú lateral, sale directo sin preguntar
    } else
        if (pag_actual.localeCompare(pagina) == 0)//
        {
            menuController.close();
        } else {
            location.href = pagina;
        }


}

/*function pintarTabs()
{
    let botonesTab = null;
    const COLOR_BTN_PULSADO = "secondary";
    const COLOR_BTN_NO_PULSADO = "light";

    botonesTab = document.getElementsByTagName("ion-tab-button");
    for(let i = 0; i < botonesTab.length; i++) {
      botonesTab[i].setAttribute("onclick", `btnColor(${i})`);
    }

    btnColor(0);

    
}

function btnColor(btnPulsado) {

    let hijos = null;

    for(let i = 0; i < botonesTab.length; i++) {
      hijos = botonesTab[i].childNodes;
      for (let j = 0; j < hijos.length; j++) {
        if (hijos[j].nodeType == Node.ELEMENT_NODE) {
          if (i == btnPulsado) {
            hijos[j].setAttribute("color", COLOR_BTN_PULSADO);
          } else {
            hijos[j].setAttribute("color", COLOR_BTN_NO_PULSADO);
          }
        }
      }
    }
  }*/

  async function mostrarToast() {
    const toast = document.createElement('ion-toast');
    toast.message = 'NO SE HA PODIDO RECUPERAR LOS DATOS. CONSULTE OTRA SECCIÓN.';
    toast.duration = 5000;
    toast.color = "danger";
    toast.position = "middle";
  
    document.body.appendChild(toast);
    return toast.present();
  }

