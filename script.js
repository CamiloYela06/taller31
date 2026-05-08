const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


/* =====================================================
   CONSTANTES DE REGIÓN (TBRL)
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
   ESCENAS DE PRUEBA
   ===================================================== */

const escenas = [

    // Totalmente dentro
    {x1:150, y1:150, x2:350, y2:350},

    // Totalmente fuera
    {x1:20, y1:20, x2:80, y2:80},

    // Entra por izquierda
    {x1:50, y1:200, x2:300, y2:200},

    // Sale por derecha
    {x1:250, y1:250, x2:500, y2:300},

    // Cruza completamente
    {x1:50, y1:500, x2:550, y2:100}
];

let escenaActual = 0;


/* =====================================================
   LIMPIAR CANVAS
   ===================================================== */

function clearCanvas(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}


/* =====================================================
   OBTENER DATOS DEL HTML
   ===================================================== */

function getInputs(){

    return {

        xmin: Number(
            document.getElementById("xmin").value
        ),

        ymin: Number(
            document.getElementById("ymin").value
        ),

        xmax: Number(
            document.getElementById("xmax").value
        ),

        ymax: Number(
            document.getElementById("ymax").value
        )
    };
}


/* =====================================================
   MOSTRAR INFORMACIÓN
   ===================================================== */

function showInfo(result){

    document.getElementById("info").innerHTML =

        "Escena: " + (escenaActual + 1)

        +

        "<br>Codigo P1: " +
        result.code1.toString(2).padStart(4,"0")

        +

        "<br>Codigo P2: " +
        result.code2.toString(2).padStart(4,"0")

        +

        "<br>Aceptada: " +
        result.accept;
}


/* =====================================================
   DIBUJAR VIEWPORT
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
   DIBUJAR LÍNEA
   ===================================================== */

function drawLine(x1, y1, x2, y2, color){

    ctx.beginPath();

    ctx.strokeStyle = color;

    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);

    ctx.stroke();
}


/* =====================================================
   CALCULAR CÓDIGO DE REGIÓN
   ===================================================== */

function computeCode(x, y, xmin, ymin, xmax, ymax){

    let code = INSIDE;

    /*
    IZQUIERDA
    */
    if(x < xmin){
        code |= LEFT;
    }

    /*
    DERECHA
    */
    if(x > xmax){
        code |= RIGHT;
    }

    /*
    ARRIBA
    */
    if(y < ymin){
        code |= TOP;
    }

    /*
    ABAJO
    */
    if(y > ymax){
        code |= BOTTOM;
    }

    return code;
}


/* =====================================================
   ALGORITMO DE COHEN-SUTHERLAND
   ===================================================== */

function cohenSutherland(
    x1, y1,
    x2, y2,
    xmin, ymin,
    xmax, ymax
){

    let code1 = computeCode(
        x1,y1,
        xmin,ymin,
        xmax,ymax
    );

    let code2 = computeCode(
        x2,y2,
        xmin,ymin,
        xmax,ymax
    );

    let accept = false;

    while(true){

        /*
        ACEPTACIÓN TRIVIAL
        */
        if((code1 | code2) === 0){

            accept = true;
            break;
        }

        /*
        RECHAZO TRIVIAL
        */
        else if(code1 & code2){

            break;
        }

        /*
        RECORTE PARCIAL
        */
        else{

            let codeOut;
            let x, y;

            /*
            Seleccionar punto externo
            */
            codeOut = code1 ? code1 : code2;

            /*
            INTERSECCIÓN SUPERIOR
            */
            if(codeOut & TOP){

                x = x1 + (x2 - x1) *
                    (ymin - y1) / (y2 - y1);

                y = ymin;
            }

            /*
            INTERSECCIÓN INFERIOR
            */
            else if(codeOut & BOTTOM){

                x = x1 + (x2 - x1) *
                    (ymax - y1) / (y2 - y1);

                y = ymax;
            }

            /*
            INTERSECCIÓN DERECHA
            */
            else if(codeOut & RIGHT){

                y = y1 + (y2 - y1) *
                    (xmax - x1) / (x2 - x1);

                x = xmax;
            }

            /*
            INTERSECCIÓN IZQUIERDA
            */
            else if(codeOut & LEFT){

                y = y1 + (y2 - y1) *
                    (xmin - x1) / (x2 - x1);

                x = xmin;
            }

            /*
            Reemplazar punto externo
            */
            if(codeOut === code1){

                x1 = x;
                y1 = y;

                code1 = computeCode(
                    x1,y1,
                    xmin,ymin,
                    xmax,ymax
                );
            }

            else{

                x2 = x;
                y2 = y;

                code2 = computeCode(
                    x2,y2,
                    xmin,ymin,
                    xmax,ymax
                );
            }
        }
    }

    return {

        accept,

        x1,y1,
        x2,y2,

        code1,
        code2
    };
}


/* =====================================================
   RENDERIZAR ESCENA
   ===================================================== */

function render(){

    /*
    Limpiar canvas
    */
    clearCanvas();

    /*
    Obtener ventana desde HTML
    */
    const {xmin, ymin, xmax, ymax} = getInputs();

    /*
    Dibujar viewport
    */
    drawViewport(
        xmin,
        ymin,
        xmax,
        ymax
    );

    /*
    Obtener línea actual
    */
    let line = escenas[escenaActual];

    /*
    Dibujar línea original
    */
    drawLine(
        line.x1,
        line.y1,
        line.x2,
        line.y2,
        "gray"
    );

    /*
    Aplicar recorte
    */
    let result = cohenSutherland(

        line.x1,
        line.y1,

        line.x2,
        line.y2,

        xmin,
        ymin,

        xmax,
        ymax
    );

    /*
    Dibujar línea recortada
    */
    if(result.accept){

        drawLine(
            result.x1,
            result.y1,
            result.x2,
            result.y2,
            "red"
        );
    }

    /*
    Mostrar información
    */
    showInfo(result);
}


/* =====================================================
   NAVEGACIÓN
   ===================================================== */

function siguiente(){

    escenaActual++;

    if(escenaActual >= escenas.length){
        escenaActual = 0;
    }

    render();
}


function anterior(){

    escenaActual--;

    if(escenaActual < 0){
        escenaActual = escenas.length - 1;
    }

    render();
}


/* =====================================================
   INICIO
   ===================================================== */

render();