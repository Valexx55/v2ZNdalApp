onload = recorrerJSON;

let videosimon = document.getElementById("videosimon");
videosimon.addEventListener("ended", ocultarVideo);
let cuenta_clics=0;
const NUM_CLICS = 3;
function verVideo(){
    console.log("se accede a la función verVideo");
    videosimon.removeAttribute("hidden");
    videosimon.play();
}
function ocultarVideo(){
    console.log("Hemos entrado en la función");
    videosimon.setAttribute("hidden", true);
    
}
function egg(){
   // alert ("card creditos tocada");
   cuenta_clics++;
    if (cuenta_clics == NUM_CLICS) {
        cuenta_clics = 0;//reiniciamos el contador
        verVideo();

    } 
}

var data = [
{
    nombre:"Jaime Muñoz",
    foto:"https://avatars.githubusercontent.com/u/69531470?s=460&u=01afb9a4f55bb1383129fbbb77ddb66918930485&v=4",
    linkedin:"https://www.linkedin.com/in/jaime-muñoz-muñoz-84086811",
    github:"https://github.com/Jaime-cpu"
    },

    {
    nombre:"Oscar Ibeas",
    foto:"https://avatars.githubusercontent.com/u/67690278?s=460&u=70f261df94a6d4198aab858b17181d444febda9f&v=4",
    linkedin:"https://www.linkedin.com/in/oscaribeas/",
    github:"https://github.com/oibeas"
    },

    {
    nombre:"María del Pilar Ruiz",
    foto:"https://avatars.githubusercontent.com/u/75325492?s=460&u=5bd107b138327998006e7d5bd2e48a81cc5767fa&v=4",
    linkedin:"https://github.com/fitipili",
    github:"https://avatars.githubusercontent.com/u/75325492?s=400&u=1770de52db99d39c596fcb6d26d2abfd2abecaa1&v=4"
    },
    {
    nombre:"Jonatan Gomez",
    foto:"https://avatars.githubusercontent.com/u/38595532?s=460&u=9137f2e0ae0c93336c35791ffc38e1452953b84d&v=4",
    linkedin:"https://www.linkedin.com/in/jonatan-gomez-martinez-807176150/",
    github:"https://github.com/Pistachu"
    },
    {
    nombre:"Ignacio Gil",
    foto:"https://image.posterlounge.es/img/products/680000/677165/677165_poster_l.jpg",
    linkedin:"https://www.linkedin.com/in/ignacio-gil-torres-a83b361b9/",
    github:"https://github.com/giltorresignacio"
    },
    {
    nombre:"Adalberto Martín",
    foto:"https://i.scdn.co/image/ab6775700000ee8517c354ae4724a87019440e63",
    linkedin:"https://www.linkedin.com/in/amlinkedin/",
    github:"https://github.com/migitgetafe"
    },
    {
    nombre:"Juan Antonio Ortega Budia",
    foto:"https://avatars.githubusercontent.com/u/75325369?s=460&u=887635d4c9bccad52d9f6069531d4b90dbd4851c&v=4",
    linkedin:"https://www.linkedin.com/in/juanantoniobudia/",
    github:"https://github.com/juanantoniobudia"
    },
    {
    nombre:"Carlos Rascon Garcia",
    foto:"", // le falta subirla
    linkedin:"https://www.linkedin.com/in/carlosnewmusic",
    github:"https://github.com/carlosnewmusic"
    },
    {
    nombre:"Juan Carlos Olivares",
    foto:"https://avatars.githubusercontent.com/u/75325360?s=400&v=4",
    linkedin:"https://www.linkedin.com/in/juan-carlos-2037591a1",
    github:"https://github.com/JuanCurso"
    },
    {
    nombre:"Héctor Guillamón Hidalgo",
    foto:"https://avatars.githubusercontent.com/u/73254868?s=460&v=4",
    linkedin:"https://www.linkedin.com/in/hguillamon/",
    github:"https://github.com/heguihi87"
    },
    {
    nombre:"Olga Gatalskaya",
    foto:"https://avatars.githubusercontent.com/u/56432315?s=400&u=65fbb79becfe7c3d6504592a7d9300a6f22d929a&v=4",
    linkedin:"https://www.linkedin.com/in/volhahatalskaya/",
    github:"https://github.com/OlgaGatalskaya"
    },
    {
    nombre:"Ana Pérez Carrera",
    foto:"https://avatars.githubusercontent.com/u/16253709?s=400&v=4",
    linkedin:"https://www.linkedin.com/in/ana-pérez-carrera-a868aa113",
    github:"https://github.com/AnaPC-20"
    },
    {
    nombre:"Ernesto González Castro",
    foto:"https://github.com/ernesto-star.png",
    linkedin:"https://www.linkedin.com/in/ernesto-gonzález-castro-00818b183/",
    github:"https://github.com/ernesto-star"
    },
    {
    nombre:"Mar Macias",
    foto:"https://avatars.githubusercontent.com/u/75326005?s=400&v=4",
    linkedin:"https://www.linkedin.com/in/mar-macias-0a54a260/",
    github:"https://github.com/marm31"
    },
    {
    nombre:"Emilio Sánchez",
    foto:"https://avatars.githubusercontent.com/u/49201043?s=460&u=cb816bf46d408455c1dee1a6842d8375a8b79a5a&v=4",
    linkedin:"",
    github:"https://github.com/emiliosans"
    },
    {
    nombre:"Ildefonso Garcia",
    foto:"", //sin imagen
    linkedin:"https://www.linkedin.com/in/ildefonso-garcia-motila-33116684",
    github:"https://github.com/igarciamotila"
    },
    {
    nombre:"Natalia Figueroa",
    foto:"https://avatars.githubusercontent.com/u/67604035?s=400&u=cf294ed93f462995cb205031690c66ca74fb07cf&v=4",
    linkedin:"https://www.linkedin.com/in/natalia-figueroa-g/",
    github:"https://github.com/natfiguero"
    }
];
// RECORRO EL JSON PARA INSERTAR LOS DATOS, Y DESPUÉS APLICO
//ESTILOS A ESTOS ELEMENTOS CSS
function recorrerJSON() {
    console.log(data);
        for(i=0; i<data.length; i++) {
            agregarInfoCreditos(data[i]);
        }
       aplicoEstilos(); // Lo hago por Javascript en vez de
//código CSS puro y duro por practicar un poco ;)
    }

// FUNCIÓN AGREGAR ITEMS A LA ION-LIST
function agregarInfoCreditos(item) {

    // CREO LAS ETIQUETAS HTML
    let lista_principal = document.getElementById("lista_creditos");
    let elemento_item = document.createElement("ion-item");
    let elemento_avatar = document.createElement("ion-avatar");
    let elemento_imagen = document.createElement("img");

    let elemento_label = document.createElement("ion-label");
    let elemento_h5 = document.createElement("h5");
    let elemento_contenedor_info = document.createElement("div");
    elemento_contenedor_info.className = "info-container";
    let elemento_contenedor_icons = document.createElement("div");
    elemento_contenedor_icons.className = "icons-container";

    let elemento_enlace_github = document.createElement("a");
    elemento_enlace_github.className = "enlace-lista";

    let elemento_icon_github = document.createElement("ion-icon");
    elemento_icon_github.name = "logo-octocat";
    elemento_icon_github.className = "logo-octocat";

    let elemento_enlace_linkedin = document.createElement("a");
    elemento_enlace_linkedin.className = "enlace-lista";

    let elemento_icon_linkedin = document.createElement("ion-icon");
    elemento_icon_linkedin.name = "logo-linkedin";
    elemento_icon_linkedin.className = "logo-linkedin";


    lista_principal.appendChild(elemento_item);
    elemento_item.appendChild(elemento_avatar);

    elemento_avatar.slot = "start";
    elemento_avatar.appendChild(elemento_imagen);
    elemento_item.appendChild(elemento_contenedor_info);

    elemento_contenedor_info.appendChild(elemento_h5);
    elemento_h5.innerHTML = data[i].nombre;
    elemento_contenedor_info.appendChild(elemento_contenedor_icons);

    // COMPRUEBO SI HAY IMAGEN
    if (data[i].foto != "") {
        elemento_imagen.src = data[i].foto;
    }
    else {
        elemento_imagen.src =
"https://ionicframework.com/docs/demos/api/avatar/avatar.svg"; // si no hay foto le meto un avatar tipo
    }

    // COMPRUEBO SI HAY GITHUB
    if (data[i].github != "") {
        elemento_contenedor_icons.appendChild(elemento_enlace_github);
        elemento_enlace_github.appendChild(elemento_icon_github);
        elemento_enlace_github.href = data[i].github;
    }
    else {
    }
    // COMPRUEBO SI HAY LINKEDIN
    if (data[i].linkedin != "") {

        elemento_contenedor_icons.appendChild(elemento_enlace_linkedin);
        elemento_enlace_linkedin.appendChild(elemento_icon_linkedin);
        elemento_enlace_linkedin.href = data[i].linkedin;
    }
    else {
    }
    return item;
}

function aplicoEstilos() {
    var elemento_clase_info_container =
    document.getElementsByClassName('info-container');
                    for(var x=0; x< elemento_clase_info_container.length; x++){
                        elemento_clase_info_container[x].style.width = "100%";
                        elemento_clase_info_container[x].style.display = "flex";
    
    elemento_clase_info_container[x].style.justifyContent =
    "space-between";
                        elemento_clase_info_container[x].style.alignItems
    = "center";
    
                    }
    
                    var elemento_clase_icons_container =
    document.getElementsByClassName('icons-container');
    
                    console.log("Elementos icons-container =" +
    elemento_clase_icons_container.length );
                    for(var y=0; y< elemento_clase_icons_container.length; y++){
                        elemento_clase_icons_container[y].style.marginTop = "10px";
                        elemento_clase_icons_container[y].style.fontSize = "19px";
                        elemento_clase_icons_container[y].style.flex = "1";
                        elemento_clase_icons_container[y].style.display = "flex";
    
    elemento_clase_icons_container[y].style.justifyContent = "flex-end";
    
                        elemento_clase_icons_container[y].style.fontSize = "20px";
    
                    }
                    var elemento_clase_logo_linkedin =
    document.getElementsByClassName('logo-linkedin');
                    for(var z=0; z< elemento_clase_logo_linkedin.length; z++){
                        elemento_clase_logo_linkedin[z].style.marginLeft = "10px";
                    }
                    var elemento_clase_enlace_lista =
    document.getElementsByClassName('enlace-lista');
                    for(var j=0; j< elemento_clase_enlace_lista.length; j++){
                        elemento_clase_enlace_lista[j].style.color =
    "rgb(235, 68, 90)";
                    }
            }
