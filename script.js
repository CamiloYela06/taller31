const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


/* =====================================================
   DIBUJAR VENTANA DE RECORTE
   ===================================================== */

function drawViewport(xmin, ymin, xmax, ymax){

    ctx.strokeStyle = "black";

    ctx.strokeRect(
        xmin,
        ymin,
        xmax - xmin,
        ymax - ymin
    );
}


/* =====================================================
   RENDERIZAR ESCENA
   ===================================================== */

function render(){

    // Limpiar canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Obtener coordenadas desde HTML
    let xmin = Number(document.getElementById("xmin").value);

    let ymin = Number(document.getElementById("ymin").value);

    let xmax = Number(document.getElementById("xmax").value);

    let ymax = Number(document.getElementById("ymax").value);

    // Dibujar ventana
    drawViewport(xmin,ymin,xmax,ymax);
}


/* =====================================================
   INICIO
   ===================================================== */

render();