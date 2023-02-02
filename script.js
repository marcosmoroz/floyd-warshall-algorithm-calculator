/*
This "floyd-warshall-algorithm-calculator" is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
*/



function doTask(doAction){
    if(doAction == 0)
        clean();

    if(doAction == 1){
        matrixInputName = generateMatrix();
        changeNumber();
    }

    if (doAction == 2 && wasGenerated) {
        matrixWithValues = getMatrixValues(matrixInputName);
        validateMatrixWithValues(matrixWithValues);
        handler(matrixWithValues, matrixWithValues.length);
    }
    if(doAction == 3)
        if(typeof matrixWithValues !== "undefined")
            resetMatrix(matrixWithValues, matrixInputName);
}

function generateMatrix() {
    clean();
    var rowsAndCols = parseInt(document.getElementById("rowsAndCols").value, 10);
    if(isNaN(rowsAndCols) || rowsAndCols == null || rowsAndCols === undefined){
        document.getElementById("lblError").innerHTML = "El alto y el ancho deben ser un numero.";
        return false;
    }
    if((rowsAndCols > 20)||(rowsAndCols <= 1)){
        document.getElementById("lblError").innerHTML = "El alto y ancho de la matriz debe ser menor o igual a 20 y mayor a 1.";
        return false;
    }
    document.getElementById("lblError").innerHTML = "";
    txtHtml = '<div id="div_w0"><table id="table_w0">';
    var matrixInputName = new Array();
    for (var i=0; i < rowsAndCols; i++) {
        matrixInputName[i] = new Array();
        txtHtml += '<tr id="trInput_'+ i +'">';
        for (var j=0; j < rowsAndCols; j++) {
            inputName = 'input_'+ i + '!' + j;
            txtHtml += '<td id="tdInput_'+ i + "!" + j + '" class="td-bordered"><input class="inputCell" id="'+ inputName +'" maxlength="1" size="1"></td>';
            matrixInputName[i][j] = inputName;
        }
        txtHtml += '</tr>';
    }
    txtHtml += '</table></div><br>';
    document.getElementById("container").innerHTML = txtHtml;
    var newElement = document.createElement("div");
    var currentElement = newElement.setAttribute("id", "div_wMatrix");
    document.getElementById("container").insertBefore(newElement, currentElement);
    document.getElementById("div_wMatrix").classList.add("wMatrix");
    wasGenerated = true;
    return matrixInputName;
}

function getMatrixValues(matrixInputName){
    var matrixWithValues = new Array();
    for (var i = 0, n = matrixInputName.length; i < n; i++){
        matrixWithValues[i] = new Array();
        for (var j = 0, m = matrixInputName.length; j < m; j++){
            matrixWithValues[i][j] = parseInt(document.getElementById(matrixInputName[i][j]).value,10);
        }
    }
    fixMatrix(matrixWithValues, matrixInputName)
    console.log(matrixWithValues);
    wasCalculated = true;
    return matrixWithValues;
}

function validateMatrixWithValues(matrixWithValues){
    for(var i = 0; i < matrixWithValues.length; i++){
        for(var j = 0; j < matrixWithValues.length; j++){
            if(matrixWithValues[i][j] != 0 && matrixWithValues[i][j] != 1){
                alert("La matriz \u00FAnicamente adm\u00EDte 0 y 1 como valores.");
                wasCalculated = true;
                return false;
            }
        }
    }
    wasGenerated = true;
    wasCalculated = true;
    return true;
}

function fixMatrix(matrixWithValues, matrixInputName){
    for(var i = 0; i < matrixWithValues.length; i++){
        for(var j = 0; j < matrixWithValues.length; j++){
            if((matrixWithValues[i][j] != 0 && matrixWithValues[i][j] != 1) || matrixWithValues[i][j] == ""){
                matrixWithValues[i][j] = 0;
                document.getElementById(matrixInputName[i][j]).value = 0;
            }
            if((document.getElementById(matrixInputName[i][j]).value).length != 1){
                if(matrixWithValues[i][j] == 1){
                    document.getElementById(matrixInputName[i][j]).value = 1;
                }
            }
        }
    }
    wasGenerated = true;
}

function handler(matrixWithValues, n){
    var elementName = "";
    var posRowHistory = new Array();
    var posColHistory = new Array();
    for(var k = 0; k < n ; k++){
        w = k+1;
        elementName = "div_w"+w;
        elementName = addElement("div", elementName, "wClass");
        arrayOfReturns = warshallIt(matrixWithValues, posRowHistory, posColHistory, n, k);
        matrixWithValues  = arrayOfReturns[0];
        posRow            = arrayOfReturns[1];
        posCol            = arrayOfReturns[2];
        count             = arrayOfReturns[3];
        newPositionCount  = arrayOfReturns[4];
        printMatrixIntoElement(elementName, matrixWithValues, posRow, posCol, count, newPositionCount);
    }
}

function printMatrixIntoElement(elementName, matrixWithValues, posRow, posCol, count, newPositionCount){
    document.getElementById("lblError").innerHTML = "";
    wCount = parseInt(elementName.substring(5),10);
    if(Number.isInteger(wCount)){
        txtHtml = '<table id="table_w'+ wCount +'" class="wTable">';
    }else{
        return false;
    }
    for (var i=0; i < matrixWithValues.length; i++) {
        txtHtml += '<tr id="tr_'+ wCount +'">';
        for (var j=0; j < matrixWithValues.length; j++) {
            txtHtml += '<td id="td_'+ wCount + '_' + i + "!" + j + '" class="td-bordered">'+ matrixWithValues[i][j] +'</td>';
        }
        txtHtml += '</tr>';
    }
    txtHtml += '</table><br>';
    document.getElementById(elementName).innerHTML = txtHtml;
    highlightPositionIntoMatrix(posRow, posCol, count, newPositionCount);
    ++wCount;
}

function warshallIt(matrixWithValues, posRowHistory, posColHistory, n, k){
    z = k+1;
    for(var i = k; i < z; i++){
        posRow = new Array();
        posCol = new Array();
        var newPositionCount = 0;
        for (var r = 0; r < n; r++) 
            if(matrixWithValues[i][r] == 1)
                for(var c = 0; c < n; c++)
                    if(matrixWithValues[c][i] == 1 && matrixWithValues[c][r] != 1)
                        newPositionCount = addPositionToPairedArray(c, r, posRowHistory, posColHistory, newPositionCount);
    }
    var count = ++k;
    for(var v = 0; v < posRow.length; v++){
        matrixWithValues[posRow[v]][posCol[v]] = 1;
        console.log("w"+ count +". imprimimos en la pos " + posCol[v] + "," + posRow[v]);
    }
    return [matrixWithValues, posRow, posCol, count, newPositionCount];
}

function addElement(elementType, elementName, className) {
    if(!document.getElementById(elementName)){
        var newElement = document.createElement(elementType);
        var currentElement = newElement.setAttribute("id", elementName);
        document.getElementById("div_wMatrix").insertBefore(newElement, currentElement);
        if(className != ""){
            document.getElementById(elementName).classList.add(className);
        }
    }
    return elementName;
}

function resetMatrix(matrixWithValues, matrixInputName){
    for(var i=0; i < matrixWithValues.length; i++){
        for(var j=0; j < matrixWithValues.length; j++){
            matrixWithValues[i][j] = 0;
            document.getElementById(matrixInputName[i][j]).value = 0;
            document.getElementById("div_wMatrix").innerHTML = "";
        }
    }
    wasGenerated = true;
    wasCalculated = false;
    return true;
}

function clean(){
    document.getElementById("container").innerHTML = "";
    wasGenerated = false;
    wasCalculated = false;
}

function highlightPositionIntoMatrix(posRow, posCol, wCount, newPositionCount){
    for(var i = 0; i < newPositionCount; i++){
        var a = "td_" + wCount + "_" + posRow[i] + "!" + posCol[i];
        console.log(a);
        document.getElementById(a).style.backgroundColor = "#6c6f79";
    }
}

function addPositionToPairedArray(c, r, posRowHistory, posColHistory, newPositionCount){
    var wasFound = true;
    if(posRowHistory.length == 0 && posColHistory.length == 0){
        posRow.push(c);
        posCol.push(r);
        posRowHistory.push(c);
        posColHistory.push(r);
        newPositionCount++;
    }else{
        for(var i = 0; i < posRowHistory.length; i++){
            if(posRowHistory[i] != c || posColHistory[i] != r)
                wasFound = false;
            else
                wasFound = true;
        }
        if(!wasFound){
            posRow.push(c);
            posCol.push(r);
            posRowHistory.push(c);
            posColHistory.push(r);
            newPositionCount++;
        }
    }
    return newPositionCount;
}

function changeNumber(){
    const matrix = document.querySelector('#table_w0');

    matrix.addEventListener('click', (e) => {
       
        
        if(e.target.classList.contains("inputCell")){
            if(e.target.value === "" || e.target.value == 0){
                e.target.value = 1;
            } else {
                e.target.value = 0;
            }
        }

    });
}