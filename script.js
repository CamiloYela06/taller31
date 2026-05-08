const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


/* =====================================================
   CONSTANTES DE REGIÓN (4 BITS)
   =====================================================

   TOP    = 1000
   BOTTOM = 0100
   RIGHT  = 0010
   LEFT   = 0001

===================================================== */

const INSIDE = 0;
const LEFT = 1;
const RIGHT = 2;
const BOTTOM = 4;
const TOP = 8;


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
   CALCULAR CÓDIGO DE REGIÓN
   =====================================================

   Cada punto recibe un código binario de 4 bits
   dependiendo de su posición respecto a la ventana.

===================================================== */

function computeCode(x, y, xmin, ymin, xmax, ymax){

    let code = INSIDE;

    /*
    Verificar izquierda
    */
    if(x < xmin){
        code |= LEFT;
    }

    /*
    Verificar derecha
    */
    else if(x > xmax){
        code |= RIGHT;
    }

    /*
    Verificar arriba
    */
    if(y < ymin){
        code |= TOP;
    }

    /*
    Verificar abajo
    */
    else if(y > ymax){
        code |= BOTTOM;
    }

    return code;
}


/* =====================================================
   RENDERIZAR ESCENA
   ===================================================== */

function render(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    let xmin = Number(document.getElementById("xmin").value);
    let ymin = Number(document.getElementById("ymin").value);
    let xmax = Number(document.getElementById("xmax").value);
    let ymax = Number(document.getElementById("ymax").value);

    drawViewport(xmin,ymin,xmax,ymax);

    /*
    Puntos de prueba
    */
    let p1 = {x:50, y:50};
    let p2 = {x:500, y:300};

    /*
    Calcular códigos
    */
    let code1 = computeCode(
        p1.x,p1.y,
        xmin,ymin,xmax,ymax
    );

    let code2 = computeCode(
        p2.x,p2.y,
        xmin,ymin,xmax,ymax
    );

    /*
    Mostrar información
    */
    document.getElementById("info").innerHTML =

        "P1 Código: " +
        code1.toString(2).padStart(4,"0")
        +

        "<br>P2 Código: " +
        code2.toString(2).padStart(4,"0");
}


/* =====================================================
   INICIO
   ===================================================== */

render();