const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


/* =====================================================
   CONSTANTES DE REGIÓN
   ===================================================== */

const INSIDE = 0;
const LEFT = 1;
const RIGHT = 2;
const BOTTOM = 4;
const TOP = 8;


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

    if(x < xmin){
        code |= LEFT;
    }

    else if(x > xmax){
        code |= RIGHT;
    }

    if(y < ymin){
        code |= TOP;
    }

    else if(y > ymax){
        code |= BOTTOM;
    }

    return code;
}


/* =====================================================
   ACEPTACIÓN Y RECHAZO TRIVIAL
   ===================================================== */

function trivialTest(x1,y1,x2,y2,
                     xmin,ymin,xmax,ymax){

    let code1 = computeCode(
        x1,y1,
        xmin,ymin,xmax,ymax
    );

    let code2 = computeCode(
        x2,y2,
        xmin,ymin,xmax,ymax
    );

    /*
    ACEPTACIÓN TRIVIAL

    Si ambos códigos son 0000:
    toda la línea está dentro
    */
    if((code1 | code2) === 0){

        return "accept";
    }

    /*
    RECHAZO TRIVIAL

    Si comparten bits externos:
    la línea está completamente fuera
    */
    if((code1 & code2) !== 0){

        return "reject";
    }

    /*
    Línea parcialmente visible
    */
    return "partial";
}


/* =====================================================
   RENDERIZAR
   ===================================================== */

function render(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    let xmin = Number(document.getElementById("xmin").value);
    let ymin = Number(document.getElementById("ymin").value);
    let xmax = Number(document.getElementById("xmax").value);
    let ymax = Number(document.getElementById("ymax").value);

    drawViewport(xmin,ymin,xmax,ymax);

    /*
    Línea de prueba
    */
    let line = {

        x1:50,
        y1:50,

        x2:500,
        y2:300
    };

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
    Evaluar línea
    */
    let result = trivialTest(

        line.x1,
        line.y1,

        line.x2,
        line.y2,

        xmin,
        ymin,
        xmax,
        ymax
    );
    let code1 = computeCode(
    line.x1,line.y1,
    xmin,ymin,xmax,ymax
);

let code2 = computeCode(
    line.x2,line.y2,
    xmin,ymin,xmax,ymax
);

let outside = getOutsideCode(code1, code2);
    /* =====================================================
   SELECCIONAR PUNTO EXTERNO
   ===================================================== */

function getOutsideCode(code1, code2){

    /*
    Se selecciona el punto que esté fuera
    de la ventana de recorte.
    */

    return code1 !== 0 ? code1 : code2;
}

    /*
    Mostrar resultado
    */
    document.getElementById("info").innerHTML =

        "Resultado: " + result;

    /*
    Si se acepta trivialmente,
    dibujar resaltada
    */
    if(result === "accept"){

        drawLine(
            line.x1,
            line.y1,
            line.x2,
            line.y2,
            "green"
        );
    }

    /*
    Si se rechaza trivialmente,
    mostrar en rojo
    */
    else if(result === "reject"){

        drawLine(
            line.x1,
            line.y1,
            line.x2,
            line.y2,
            "red"
        );
    }
}


/* =====================================================
   INICIO
   ===================================================== */

render();