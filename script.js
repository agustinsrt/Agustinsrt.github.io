
document.addEventListener("DOMContentLoaded", () => {
    // Aquí puedes inicializar funciones o configurar eventos
  });
function openPopup(url, title) {
  // Configuración de la ventana emergente
  const width = 800;  // Ancho de la ventana
  const height = 600; // Altura de la ventana
  const left = (window.screen.width - width) / 2; // Centrar horizontalmente
  const top = (window.screen.height - height) / 2; // Centrar verticalmente

  // Abrir la ventana emergente
  const popup = window.open(url, title, `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`);

  // Verificar que la ventana se abrió correctamente
  if (!popup) {
    alert("No se pudo abrir la ventana del recurso. Verifica los permisos del navegador.");
  }
}
// Inicializar variables clave al cargar la página
let currentLogDate = new Date().toLocaleDateString(); // Fecha actual
let savedLogDate = localStorage.getItem('currentLogDate') || ""; // Fecha guardada previamente
let dailyLog = localStorage.getItem('dailyLog') || ""; // Log acumulado guardado previamente

// Verificar si ha cambiado el día al cargar la página
if (currentLogDate !== savedLogDate) {
    dailyLog = ""; // Reinicia el log si el día ha cambiado
    localStorage.setItem('dailyLog', dailyLog); // Guardar el nuevo log vacío en LocalStorage
    localStorage.setItem('currentLogDate', currentLogDate); // Guardar la nueva fecha actual en LocalStorage
    console.log("El log fue reiniciado automáticamente al cargar la página.");
}

// Función para guardar en el log
function saveToLog() {
    const resultsBox = document.getElementById('results'); // Referencia al elemento de resultados existente
    const resultsContent = resultsBox.value.trim(); // Obtener y limpiar el contenido actual
    const now = new Date();
    const formattedDate = now.toLocaleDateString(); // Fecha (DD/MM/AAAA)
    const formattedTime = now.toLocaleTimeString(); // Hora (HH:MM AM/PM)

    if (!resultsContent) {
        alert("There´s nothing to save."); // Evitar guardar si el contenido está vacío
        return;
    }

    // Lógica para guardar en el log
    console.log(`Guardando en el log: [${formattedDate} ${formattedTime}] ${resultsContent}`);
    // Si tienes un backend, aquí puedes integrar la lógica para enviar el contenido, por ejemplo con fetch()

    // Limpiar el área de resultados después de guardar
    resultsBox.value = "";

    // Refrescar la página y desplazarse hacia arriba suavemente
    setTimeout(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth" // Scroll suave hacia la parte superior
        });
        setTimeout(() => location.reload(), 1000); // Refresca la página después de 1 segundo para completar el scroll
    }, 500); // Espera medio segundo para completar el guardado antes de iniciar el scroll


    // Añadir nueva entrada con fecha y hora
    dailyLog += `=== ${formattedDate} - ${formattedTime} ===\n${resultsContent}\n\n`;

    // Guardar el log en LocalStorage
    localStorage.setItem('dailyLog', dailyLog);

    console.log("Entrada guardada en el log del día.");

    // Actualizar el estado del botón "Save to Log"
    const saveButton = document.getElementById('saveToLogButton');
    saveButton.classList.add('saved');
    saveButton.disabled = true;

    // Mostrar confirmación visual breve
    const confirmationMessage = document.getElementById('saveConfirmation');
    confirmationMessage.style.display = 'inline';
    setTimeout(() => {
        confirmationMessage.style.display = 'none';
    }, 2000);
}

// Función para descargar el archivo del log
function downloadDailyLog() {
    const date = new Date().toISOString().split("T")[0]; // Fecha para el nombre del archivo
    const fileName = `log_${date}.txt`; // Nombre del archivo
    const blob = new Blob([dailyLog], { type: "text/plain" }); // Crear archivo de texto
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName; // Configurar nombre para la descarga
    a.click();
    console.log("Archivo descargado:", fileName);
}

// Función para abrir el log en una nueva ventana
function openLogInBrowser() {
    const logWindow = window.open("", "_blank");

    // Verificar si se pudo abrir la ventana
    if (!logWindow) {
        alert("No se pudo abrir la ventana del log. Verifica los permisos del navegador.");
        return;
    }

    // Generar contenido HTML exclusivo para el log
    const sanitizedLog = dailyLog.replace(/</g, "&lt;").replace(/>/g, "&gt;"); // Sanitizar caracteres HTML
    const logContent = `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Daily Log</title>
                <style>
                    body {
                        font-family: "Courier New", monospace;
                        white-space: pre-wrap; /* Mostrar saltos de línea */
                        margin: 20px;
                    }
                </style>
            </head>
            <body>
                <h1>Daily Log</h1>
                <div>${dailyLog || "No entries available."}</div> <!-- Mostrar el log acumulado -->
           
    `;

    // Escribir el contenido en la ventana recién abierta
    logWindow.document.open();
    logWindow.document.write(logContent);
    logWindow.document.close();
}

// Eventos para los botones
document.getElementById('saveToLogButton').addEventListener('click', saveToLog);
document.getElementById('downloadLogButton').addEventListener('click', downloadDailyLog);
document.getElementById('openLogButton').addEventListener('click', openLogInBrowser);

            function updateRepairPercentageWithLOL() {
  const previousRepairs = parseFloat(document.getElementById('previousClaims').value) || 0;
  const applianceValue = parseFloat(document.getElementById('applianceValue').value) || 0;

  // Calcular el porcentaje de Previous Repairs respecto al Appliance Value (LOL)
  const repairPercentage = applianceValue > 0 ? (previousRepairs / applianceValue) * 100 : 0;

  // Actualizar el contenido del elemento <p>
  document.getElementById('repairResults').textContent = `${Math.round(repairPercentage)}%`;

}
            function formatAuthNumber() {
  const input = document.getElementById('authNumber');
  const value = input.value.replace(/\s+/g, ''); // Eliminar espacios existentes

  if (value.length > 7) {
    // Separar en dos partes: primeros 7 caracteres y el resto
    const firstPart = value.substring(0, 7);
    const secondPart = value.substring(7);
    input.value = `${firstPart} ${secondPart}`; // Actualizar el campo con el formato correcto
  }
}
           
           function toggleField(fieldId, checkboxId) {
  const field = document.getElementById(fieldId);
  const checkbox = document.getElementById(checkboxId);

  if (checkbox.checked) {
    // Bloquear el textbox y limpiar su valor
    field.disabled = true;
    field.value = ""; // Opcional: limpiar el valor si se deshabilita
  } else {
    // Desbloquear el textbox
    field.disabled = false;
  }
}

// Ejecutar la lógica al cargar la página para sincronizar estado inicial
window.onload = function () {
  toggleField('mileageCost', 'noMileage');
  toggleField('rrCost', 'noRR');
  updateTotals(); // Actualizar los cálculos
}


function updateRepairPercentage() {
  const previousClaims = parseFloat(document.getElementById('previousClaims').value) || 0;
  const applianceValue = parseFloat(document.getElementById('applianceValue').value) || 0;

  // Calcular el % de LOL basado en Previous Claims
  const repairPercentage = applianceValue > 0 ? (previousClaims / applianceValue) * 100 : 0;

  // Mostrar el resultado en el elemento <p>
  document.getElementById('repairResults').textContent = `${Math.round(repairPercentage)}%`;
}

function sendCompQuoteEmail() {
  // Obtener los valores dinámicos
  const authNumber = document.getElementById('authNumber').value || "[AUTH_NUMBER]";
  const firstSevenChars = authNumber.substring(0, 7); // Primeros 7 caracteres del Auth Number
  const dealerName = "[Dealer name]"; // Cambiar por un valor dinámico si es necesario

  // Template del correo
  const subject = encodeURIComponent(`REQUESTED COMP QUOTE FROM DEALER. REPLACEMENT IS NOT GUARANTEED: [AGREEMENT# ${firstSevenChars} / DLR ORDER #     `);
  const body = encodeURIComponent(`Hello Team,

Could you kindly provide us with a comparable replacement quote for our mutual customer while we await the diagnostic report from the servicer? (Please include R&R if applicable)

We are requesting this ahead of adjudication to ensure we have all the necessary documentation to make the best claims decision.



Please note that a replacement is not guaranteed at this time.
Thank you



`);

// Obtener el correo del SVC

const svcEmail = document.getElementById('svcEmail')?.value || ''; // Si no hay correo, dejar vacío

  // Generar el enlace mailto
const mailtoLink = `mailto:${svcEmail}?subject=${subject}&body=${body}`;
  
  // Abrir Outlook usando el enlace
  window.location.href = mailtoLink;
}

function calculateLOLPercentage() {
  // Obtener valores necesarios
  const previousClaims = parseFloat(document.getElementById('previousClaims').value) || 0;
  const applianceValue = parseFloat(document.getElementById('applianceValue').value) || 0;

  // Calcular los meses restantes del ESP
  const espMonthsLeftText = calculateESPMonthsLeft();

  // Obtener totales de SVC y CTR
  const svcTotal = parseFloat(document.getElementById('svcSubtotal').textContent.replace(/[^0-9.]/g, '')) || 0;
  const ctrTotal = parseFloat(document.getElementById('ctrSubtotal').textContent.replace(/[^0-9.]/g, '')) || 0;

  // Determinar el tipo de LOL (FV o FV-C)
  const lolType = document.querySelector('input[name="lolType"]:checked')?.value || "FV";

  // Calcular Remaining LOL si FV-C está seleccionado
  const remainingLOL = lolType === "FV-C" ? applianceValue - previousClaims : null;

  // Calcular porcentajes de LOL para SVC y CTR
  const maxLOL = remainingLOL !== null ? remainingLOL : applianceValue; // Usar Remaining LOL si está disponible
  const svcLOLPercentage = maxLOL > 0 ? ((previousClaims + svcTotal) / maxLOL) * 100 : 0;
  const ctrLOLPercentage = maxLOL > 0 ? ((previousClaims + ctrTotal) / maxLOL) * 100 : 0;

  // Determinar los límites de riesgo según meses restantes en el ESP
  const espMonthsLeft = typeof espMonthsLeftText === "number" ? espMonthsLeftText : -1; // Valor numérico o expirado
  const lolLimit = espMonthsLeft < 6 && espMonthsLeft >= 0 ? 70 : 60;

  // Determinar el porcentaje de LOL más bajo entre SVC y CTR
  const lowestLOLPercentage = Math.min(svcLOLPercentage, ctrLOLPercentage);

  // Obtener la fecha actual en formato MM-DD-YYYY
  const currentDate = new Date();
  const formattedDate = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}-${currentDate.getFullYear()}`;

  // Espacio para el correo del SVC
  const svcEmail = document.getElementById('svcEmail')?.value || '____________'; // Si no se ingresa correo, dejar espacio en blanco

  // Generar la recomendación final
  let finalRecommendation = "";

  if (svcLOLPercentage <= lolLimit && ctrLOLPercentage <= lolLimit) {
    if (svcTotal <= ctrTotal + 35) {
      finalRecommendation = `Approve SVC repairs for $${svcTotal.toFixed(2)}. Repairs will reach ${svcLOLPercentage > 100 ? "exceed LOL," : `${Math.round(svcLOLPercentage)}% LOL,`} ${espMonthsLeftText === "agreement already expired," ? "with agreement already expired," : `with ${espMonthsLeftText} months left,`} Repair is the best option.`;
    } else {
      finalRecommendation = `Approve CTR repairs for $${ctrTotal.toFixed(2)}. Repairs will reach ${ctrLOLPercentage > 100 ? "exceed LOL," : `${Math.round(ctrLOLPercentage)}% LOL,`} ${espMonthsLeftText === "agreement already expired," ? "with agreement already expired," : `with ${espMonthsLeftText} months left,`} Repair is the best option.`;
    }
  } else if (svcLOLPercentage <= lolLimit) {
    finalRecommendation = `Approve SVC repairs for $${svcTotal.toFixed(2)}. Repairs will reach ${svcLOLPercentage > 100 ? "exceed LOL," : `${Math.round(svcLOLPercentage)}% LOL,`} ${espMonthsLeftText === "agreement already expired," ? "with agreement already expired," : `with ${espMonthsLeftText} months left,`} Repair is the best option.`;
  } else if (ctrLOLPercentage <= lolLimit) {
    finalRecommendation = `Approve CTR repairs for $${ctrTotal.toFixed(2)}. Repairs will reach ${ctrLOLPercentage > 100 ? "exceed LOL," : `${Math.round(ctrLOLPercentage)}% LOL,`} ${espMonthsLeftText === "agreement already expired," ? "with agreement already expired," : `with ${espMonthsLeftText} months left,`} Repair is the best option.`;
  } else {
    finalRecommendation = `
Repairs will ${lowestLOLPercentage > 100 ? "exceed LOL," : `reach ${Math.round(lowestLOLPercentage)}% LOL`} ${espMonthsLeftText === "agreement already expired," ? "with agreement already expired," : `with ${espMonthsLeftText} months left,`} Best option is to evaluate alternate resolution, request comparable replacement quote to DLR.
(Internal Claims notes only: Email sent to: ${svcEmail} on ${formattedDate})
***REPLACEMENT IS NOT GUARANTEED***
`.trim();
  }

  // Mostrar la recomendación en el Textarea de Final Recommendation
  document.getElementById('finalRecommendation').value = finalRecommendation;

  // Mostrar resultados en pantalla
  document.getElementById('lolResults').innerHTML = `
    <strong>LOL Percentages:</strong><br>
    - SVC LOL: <span style="${svcLOLPercentage > lolLimit ? 'color: red;' : 'color: green;'}">${Math.round(svcLOLPercentage)}%</span><br>
    - CTR LOL: <span style="${ctrLOLPercentage > lolLimit ? 'color: red;' : 'color: green;'}">${Math.round(ctrLOLPercentage)}%</span><br>
    ${lolType === "FV-C" ? `- REMAINING LOL: <Span>$${remainingLOL.toFixed(2)}</span><br>` : ""}
  `;
}


// Función para calcular los meses restantes del ESP
function calculateESPMonthsLeft() {
  const expirationDate = new Date(document.getElementById('expirationDate').value); // Fecha de expiración del acuerdo
  const currentDate = new Date(); // Fecha actual

  // Calcular la diferencia en meses entre la fecha actual y la de expiración
  const monthsLeft = (expirationDate.getFullYear() - currentDate.getFullYear()) * 12 +
                     (expirationDate.getMonth() - currentDate.getMonth());

  // Manejo de casos para meses restantes
  if (monthsLeft < 0) {
    return "agreement already expired"; // Cuando el acuerdo ya expiró
  } else if (monthsLeft === 0) {
    return "0 months left"; // Cuando queda menos de un mes
  } else {
    return monthsLeft; // Devuelve la cantidad de meses restantes si es mayor a 0
  }
}


function openContract() {
  const authNumber = document.getElementById('authNumber').value; // Obtén el valor del campo Authorization Number

  if (authNumber && authNumber.length >= 7) {
    const firstSevenChars = authNumber.slice(0, 7); // Toma los primeros 7 caracteres
    const url = `http://www.bankerswarrantygroup.com/WebServices/TandCWeb/PopupTandC.aspx?P=${encodeURIComponent(firstSevenChars)}`;
    
    // Abrir el vínculo en una nueva ventana con dimensiones específicas
    window.open(url, '_blank', 'width=800,height=600,resizable=yes');
  } else {
    alert("Por favor, ingresa al menos 7 caracteres en el Authorization Number.");
  }
}
function searchModel() {
  const model = document.getElementById('model').value; // Toma el valor del campo "model"
  if (model) {
    const query = `${model} manual`; // Construye el término de búsqueda

    // Abre la búsqueda en una nueva ventana con dimensiones específicas
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      '_blank',
      'width=800,height=600,resizable=yes'
    );
  } else {
    alert("Please enter a model number."); // Mensaje si no se ingresa un modelo
  }
}

            function formatExpirationDate() {
  const input = document.getElementById('expirationDate');
  let value = input.value.replace(/\D/g, ''); // Eliminar cualquier carácter que no sea número
  if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2); // Agregar el primer "/"
  if (value.length >= 5) value = value.slice(0, 5) + '/' + value.slice(5); // Agregar el segundo "/"
  input.value = value.slice(0, 8); // Limitar la entrada al formato MM/DD/YY
  calculateMonthsRemaining(); // Llamar a la función para calcular meses restantes
}

function calculateMonthsRemaining() {
  const dateInput = document.getElementById('expirationDate').value;

  // Validar el formato MM/DD/YY usando una expresión regular
  const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/\d{2}$/; // MM/DD/YY
  if (!datePattern.test(dateInput)) {
    document.getElementById('remainingMonths').textContent = "Enter a valid date in MM/DD/YY format.";
    return;
  }

  // Convertir MM/DD/YY a una fecha completa
  const [month, day, year] = dateInput.split('/').map(Number);
  const fullYear = year + 2000; // Asumir año en formato 2000+
  const expDate = new Date(fullYear, month - 1, day); // Date usa meses de 0-11

  const currentDate = new Date();

  // Calcular diferencia en meses
  const diffTime = expDate - currentDate;
  const diffMonths = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30))); // Convierte ms a meses

  document.getElementById('remainingMonths').textContent = `${diffMonths} MONTHS REMAINING`;
}

            function calculateRepairPercentage() {
  const svcTotal = Array.from(document.querySelectorAll('#svcTable tbody tr input[type="number"]'))
    .reduce((sum, input) => sum + (parseFloat(input.value) || 0), 0);
  const ctrTotal = Array.from(document.querySelectorAll('#ctrTable tbody tr input[type="number"]'))
    .reduce((sum, input) => sum + (parseFloat(input.value) || 0), 0);
  const previousClaims = parseFloat(document.getElementById('previousClaims').value) || 0;
  const lolValue = parseFloat(document.getElementById('applianceValue').value) || 0;

  if (lolValue === 0) {
    document.getElementById('repairResults').textContent = "Enter LOL Value to calculate.";
    return;
  }

  const svcPercentage = ((svcTotal + previousClaims) / lolValue) * 100;
  const ctrPercentage = ((ctrTotal + previousClaims) / lolValue) * 100;

  // Determina el más bajo
  const lowerPercentage = Math.min(svcPercentage, ctrPercentage);
  let finalRecommendation = "";
  let color = "";

  if (lowerPercentage > 60) {
    finalRecommendation = "REPLACEMENT RECOMMENDED";
    color = "red";
  } else {
    finalRecommendation = "REPAIR RECOMMENDED";
    color = "green";
  }

  // Muestra resultados
  document.getElementById('repairResults').innerHTML = `
    SVC: ${Math.round(svcLOLPercentage)}% LOL<br>
    CTR: ${Math.round(ctrLOLPercentage)}ctrPercentage.toFixed(2)}% LOL<br>
    <span style="color: ${color}; font-weight: bold;">${finalRecommendation}</span>
  `;
}
            // Función para agregar una fila en las tablas (CTR o SVC)
            function addRow(tableId) {
  const tableBody = document.querySelector(`#${tableId}Table tbody`);
  const newRow = document.createElement("tr");

  newRow.innerHTML = `
    <td><input type="number" placeholder="Cost" style="width: 90%;" oninput="updateTotals()" min="0"></td>
    <td><input type="number" placeholder="Qty" style="width: 50px;" oninput="updateTotals()" min="1" max="99" value="1"></td>
    <td><input type="number" placeholder="Total Cost" style="width: 90%;" readonly></td>
    <td><input type="text" placeholder="Number" style="width: 90%;"></td>
    <td><input type="text" placeholder="Name" style="width: 90%;"></td>
    <td style="display: flex; gap: 5px; justify-content: flex-start;">
      <button class="orange" onclick="searchEncompass(this)">Encompass</button>
      <button class="dark-gray" onclick="deleteRow(this)">Delete</button>
    </td>
  `;

  tableBody.appendChild(newRow);
}
          
            // Función para eliminar una fila
            function updateTotals() {
  // Variables para SVC
  let svcLabor = parseFloat(document.getElementById('laborCost').value) || 0;
  let svcMileage = parseFloat(document.getElementById('mileageCost').value) || 0;
  let svcRR = parseFloat(document.getElementById('rrCost').value) || 0;
  
  let svcTotal = svcLabor + svcMileage + svcRR ;
  let svcPartsTotal = 0;

  // Recolectar partes en SVC y calcular el costo total
  const svcRows = document.querySelectorAll("#svcTable tbody tr");
  svcRows.forEach((row) => {
    const partCostField = row.querySelector("td input[placeholder='Cost']");
    const qtyField = row.querySelector("td input[placeholder='Qty']");
    const totalCostField = row.querySelector("td input[placeholder='Total Cost']");

    const partCost = parseFloat(partCostField?.value) || 0;
    const quantity = parseInt(qtyField?.value) || 1;

    const totalPartCost = partCost * quantity;
    svcPartsTotal += totalPartCost;

    // Actualizar el campo de Total Cost automáticamente
    totalCostField.value = totalPartCost.toFixed(2);
  });

  svcTotal += svcPartsTotal;

  // Actualizar el subtotal de SVC en el DOM
  const svcSubtotal = document.getElementById("svcSubtotal");
  svcSubtotal.innerHTML = `$${svcTotal.toFixed(2)}   SVC TOTAL <span style="font-size: 0.9em;">($${svcPartsTotal.toFixed(2)} parts)</span>`;

  // Variables para CTR
  let ctrLabor = svcLabor; // Asumimos que el Labor es igual al de SVC
  let ctrMileage = svcMileage; // Asumimos que el Mileage es igual al de SVC
  let ctrRR = svcRR; // Asumimos que el R&R es igual al de SVC
  let ctrPartsTotal = 0;

  const ctrRows = document.querySelectorAll("#ctrTable tbody tr");
  ctrRows.forEach((row) => {
    const partCostField = row.querySelector("td input[placeholder='Cost']");
    const qtyField = row.querySelector("td input[placeholder='Qty']");
    const totalCostField = row.querySelector("td input[placeholder='Total Cost']");

    const partCost = parseFloat(partCostField?.value) || 0;
    const quantity = parseInt(qtyField?.value) || 1;

    const totalPartCost = partCost * quantity;
    ctrPartsTotal += totalPartCost;

    // Actualizar el campo de Total Cost automáticamente
    totalCostField.value = totalPartCost.toFixed(2);
  });

  const ctrTotal = ctrPartsTotal + ctrLabor + ctrMileage + ctrRR;

  // Actualizar el subtotal de CTR en el DOM
  const ctrSubtotal = document.getElementById("ctrSubtotal");
  ctrSubtotal.innerHTML = `$${ctrTotal.toFixed(2)}   CTR TOTAL <span style="font-size: 0.9em;">($${ctrPartsTotal.toFixed(2)} parts)</span>`;
}


function deleteRow(button) {
  const row = button.closest('tr');
  row.remove();
  updateTotals(); // Recalcula los totales al eliminar una fila
}


function deleteRow(button) {
  const row = button.closest('tr');
  row.remove();
  updateTotals(); // Recalcular totales al eliminar una fila
}
function generateResult() {
  // Obtener el valor seleccionado para Physical Damage / Abuse
  const physicalDamage = document.querySelector('input[name="physicalDamage"]:checked')?.value || "NO";

  // Crear el texto del resultado final
  const resultText = `
    PHYSICAL DAMAGE / ABUSE: ${physicalDamage}
    // Aquí agregas el resto de los datos que forman el resultado final
  `;

  // Mostrar el resultado
  document.getElementById('finalResult').textContent = resultText.trim();
}
                      
            // Función para buscar una parte en Encompass
            function searchEncompass(button) {
  const row = button.closest('tr'); // Encuentra la fila del botón clicado
  const partNumber = row.querySelector('td:nth-child(4) input').value; // Toma el valor del campo "Part Number"

  if (partNumber) {
    const url = `https://encompass.com/search?searchTerm=${encodeURIComponent(partNumber)}`;
    
    // Abrir en una nueva ventana con dimensiones específicas
    window.open(url, '_blank', 'width=800,height=600,resizable=yes');
  } else {
    alert("Por favor ingresa un número de parte antes de buscar.");
  }
}
function addShippingHandling() {
    const tableBody = document.querySelector(`#ctrTable tbody`);
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td><input type="number" placeholder="Cost" style="width: 90%;" oninput="updateTotals()" min="0"></td>
        <td><input type="number" placeholder="Qty" style="width: 50px;" oninput="updateTotals()" min="1" max="99" value="1"></td>
        <td><input type="number" placeholder="Total Cost" style="width: 90%;" readonly></td>
        <td><input type="text" placeholder="Number" style="width: 90%;" value="S&H" readonly></td> <!-- Número predefinido -->
        <td><input type="text" placeholder="Name" style="width: 90%;"></td> <!-- Nombre editable -->
        <td style="display: flex; gap: 5px; justify-content: flex-start;">
            <button class="dark-gray" onclick="deleteRow(this)">Delete</button> <!-- Botón de eliminar -->
        </td>
    `;

    tableBody.appendChild(newRow);
}

function addTaxes() {
    const tableBody = document.querySelector(`#ctrTable tbody`);
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td><input type="number" placeholder="Cost" style="width: 90%;" oninput="updateTotals()" min="0"></td>
        <td><input type="number" placeholder="Qty" style="width: 50px;" oninput="updateTotals()" min="1" max="99" value="1"></td>
        <td><input type="number" placeholder="Total Cost" style="width: 90%;" readonly></td>
        <td><input type="text" placeholder="Number" style="width: 90%;" value="Taxes" readonly></td> <!-- Número predefinido -->
        <td><input type="text" placeholder="Name" style="width: 90%;"></td> <!-- Nombre editable -->
        <td style="display: flex; gap: 5px; justify-content: flex-start;">
            <button class="dark-gray" onclick="deleteRow(this)">Delete</button> <!-- Botón de eliminar -->
        </td>
    `;

    tableBody.appendChild(newRow);
}
          
function addSVCTaxes() {
    const tableBody = document.querySelector(`#svcTable tbody`);
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td><input type="number" placeholder="Cost" style="width: 90%;" oninput="updateTotals()" min="0"></td>
        <td><input type="number" placeholder="Qty" style="width: 50px;" oninput="updateTotals()" min="1" max="99" value="1"></td>
        <td><input type="number" placeholder="Total Cost" style="width: 90%;" readonly></td>
        <td><input type="text" placeholder="Number" style="width: 90%;" value="Taxes" readonly></td> <!-- Número predefinido -->
        <td><input type="text" placeholder="Name" style="width: 90%;"></td> <!-- Nombre editable -->
        <td style="display: flex; gap: 5px; justify-content: flex-start;">
            <button class="dark-gray" onclick="deleteRow(this)">Delete</button> <!-- Botón de eliminar -->
        </td>
    `;

    tableBody.appendChild(newRow);
}
            // Función para mostrar todos los datos en el área de resultados
           // Función para mostrar todos los datos en el área de resultados
function showResults() {
    const authNumber = document.getElementById('authNumber').value || "";
    const svcName = document.getElementById('svcName').value || "";
    const model = document.getElementById('model').value || "";
    const serial = document.getElementById('serial').value || "";

    const physicalDamage = document.querySelector('input[name="physicalDamage"]:checked')?.value === "yes" 
        ? "PHYSICAL DAMAGE / ABUSE: YES" 
        : "NO PHYSICAL DAMAGE / ABUSE";

    const complaint = document.getElementById('complaint').value || "";
    const techDiag = document.getElementById('techDiag').value || "";

    const laborCost = parseFloat(document.getElementById('laborCost')?.value) || 0;
    const rrCostElement = document.getElementById('rrCost'); // Verificar existencia
    const mileageCostElement = document.getElementById('mileageCost'); // Verificar existencia

    const rrCost = rrCostElement && rrCostElement.value !== "" 
        ? parseFloat(rrCostElement.value) 
        : 0; // Asegurarse de que RR tenga un valor válido o sea 0
    const mileageCost = mileageCostElement && mileageCostElement.value !== "" 
        ? parseFloat(mileageCostElement.value) 
        : 0; // Asegurarse de que Mileage tenga un valor válido o sea 0

       // **SVC Rows**
    const svcRows = Array.from(document.querySelectorAll('#svcTable tbody tr')).map(row => {
        const partCost = parseFloat(row.querySelector("td input[placeholder='Cost']")?.value) || 0;
        const quantity = parseInt(row.querySelector("td input[placeholder='Qty']")?.value) || 1;
        const partNumber = row.querySelector("td input[placeholder='Number']")?.value || "";
        const partName = row.querySelector("td input[placeholder='Name']")?.value || "";

        const totalCost = partCost * quantity;

        // Concatenar cantidad al nombre de la parte
        const quantityStr = quantity > 1 ? ` (${quantity}pc $${partCost.toFixed(2)}e)` : "";
        const partNameWithQuantity = `${partName}${quantityStr}`;

        // Espaciado dinámico para cada columna
        const costStr = `$${totalCost.toFixed(2)}`.padEnd(12);
        const partNumberStr = `${partNumber}`.padEnd(15);
        const partNameStr = partNameWithQuantity.padEnd(30);

        return `${costStr}${partNumberStr}${partNameStr}`;
    }).join("\n");

    // Calcular **SVC Total**
    let svcPartsTotal = 0;
    document.querySelectorAll('#svcTable tbody tr').forEach(row => {
        const partCost = parseFloat(row.querySelector("td input[placeholder='Cost']")?.value) || 0;
        const quantity = parseInt(row.querySelector("td input[placeholder='Qty']")?.value) || 1;
        svcPartsTotal += partCost * quantity;
    });
    const svcTotal = svcPartsTotal + laborCost + rrCost + mileageCost; // Incluye taxes

    // **CTR Rows**
    const ctrRows = Array.from(document.querySelectorAll('#ctrTable tbody tr')).map(row => {
        const partCost = parseFloat(row.querySelector("td input[placeholder='Cost']")?.value) || 0;
        const quantity = parseInt(row.querySelector("td input[placeholder='Qty']")?.value) || 1;
        const partNumber = row.querySelector("td input[placeholder='Number']")?.value || "";
        const partName = row.querySelector("td input[placeholder='Name']")?.value || "";

        const totalCost = partCost * quantity;

        // Concatenar cantidad al nombre de la parte
        const quantityStr = quantity > 1 ? ` (${quantity}pc $${partCost.toFixed(2)}e)` : "";
        const partNameWithQuantity = `${partName}${quantityStr}`;

        // Espaciado dinámico para cada columna
        const costStr = `$${totalCost.toFixed(2)}`.padEnd(12);
        const partNumberStr = `${partNumber}`.padEnd(15);
        const partNameStr = partNameWithQuantity.padEnd(30);

        return `${costStr}${partNumberStr}${partNameStr}`;
    }).join("\n");

    // Calcular **CTR Total**
    let ctrPartsTotal = 0;
    document.querySelectorAll('#ctrTable tbody tr').forEach(row => {
        const partCost = parseFloat(row.querySelector("td input[placeholder='Cost']")?.value) || 0;
        const quantity = parseInt(row.querySelector("td input[placeholder='Qty']")?.value) || 1;
        ctrPartsTotal += partCost * quantity;
    });
    const ctrTotal = ctrPartsTotal + laborCost + rrCost + mileageCost; // Sin incluir taxes

    // Calcular Remaining LOL (si aplica FV-C)
    const lolType = document.querySelector('input[name="lolType"]:checked')?.value || "No LOL Type selected";
    const lolValue = parseFloat(document.getElementById('applianceValue').value) || 0;
    const previousClaims = parseFloat(document.getElementById('previousClaims').value) || 0;
    const remainingLOL = lolType === "FV-C" ? (lolValue - previousClaims) : null;

    // Obtener valores de MFG Coverage y Final Recommendation
    const mfgCoverage = document.getElementById('noMfgCoverage').checked
        ? "NO ADDITIONAL MFG COVERAGE"
        : document.getElementById('mfgCoverage').value || "";

    const finalRecommendation = document.getElementById('finalRecommendation').value || "";

    // Formatear resultados
    const laborFormatted = `$${laborCost.toFixed(2)}`.padEnd(12);
    const rrFormatted = rrCost > 0 ? `$${rrCost.toFixed(2)}`.padEnd(12) + "RR\n" : ""; // Mostrar RR solo si es mayor a 0
    const mileageFormatted = mileageCost > 0 ? `$${mileageCost.toFixed(2)}`.padEnd(12) + "MILEAGE\n" : ""; // Mostrar Mileage solo si es mayor a 0
    const svcTotalFormatted = `$${svcTotal.toFixed(2)}`.padEnd(12);
    const ctrTotalFormatted = `$${ctrTotal.toFixed(2)}`.padEnd(12);
    const remainingLOLFormatted = remainingLOL !== null 
        ? `Remaining LOL: $${remainingLOL.toFixed(2)}\n` 
        : "";

    let results = `
AUTH: ${authNumber}
RECEIVED AN RFA FROM ${svcName}
MODEL: ${model}
SERIAL: ${serial}
${physicalDamage}
COMPLAINT: ${complaint}
TECH'S DIAG: ${techDiag}
SVC ESTIMATE:
${laborFormatted}LABOR
${rrFormatted}${mileageFormatted}${svcRows}
${svcTotalFormatted}TOTAL SVC ($${svcPartsTotal.toFixed(2)} PARTS)
CTR ESTIMATE:
${laborFormatted}LABOR
${rrFormatted}${mileageFormatted}${ctrRows}
${ctrTotalFormatted}TOTAL CTR ($${ctrPartsTotal.toFixed(2)} PARTS)
LOL: ${lolType}
LOL VALUE: $${lolValue.toFixed(2)}
PREVIOUS CLAIMS: $${previousClaims.toFixed(2)}
${remainingLOLFormatted}MFG COVERAGE:
${mfgCoverage}
FINAL RECOMMENDATION IS TO ${finalRecommendation}`.trim();

    const resultsBox = document.getElementById('results');
    resultsBox.style.fontFamily = 'Courier New, monospace';
    resultsBox.value = results;

    autoResizeTextarea();
}


function autoResizeTextarea() {
    const resultsBox = document.getElementById('results');
    resultsBox.style.height = 'auto'; // Restablece la altura
    resultsBox.style.overflowY = 'hidden'; // Oculta barras de desplazamiento vertical
    resultsBox.style.height = `${resultsBox.scrollHeight}px`; // Ajusta al contenido dinámicamente
    resultsBox.scrollIntoView({ behavior: 'smooth' }); // Opcional: desplazar para que sea visible
}

           
function copyToClipboard() {
    const resultsBox = document.getElementById('results'); // Referencia al área de texto
    resultsBox.select(); // Seleccionar el texto del área de texto
    resultsBox.setSelectionRange(0, 99999); // Para dispositivos móviles
    document.execCommand('copy'); // Copiar el texto al portapapeles

    // Cambiar dinámicamente el texto del botón
    const copyButton = document.getElementById('copyButton');
    if (copyButton) {
        const originalText = copyButton.textContent; // Guarda el texto original
        copyButton.textContent = "Copied"; // Cambia el texto a "Copied"

        setTimeout(() => {
            copyButton.textContent = originalText; // Regresa al texto original después de 3 segundos
        }, 3000);
    } else {
        console.error("No se encontró el botón con ID 'copyButton'.");
    }
}
document.addEventListener("DOMContentLoaded", () => {
  configureColumnTabbing("#svcTable");
  configureColumnTabbing("#ctrTable");
});

function configureColumnTabbing(tableSelector) {
  const table = document.querySelector(tableSelector);

  // Delegación de eventos para capturar la tecla Tab
  table.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      event.preventDefault(); // Evitar comportamiento predeterminado

      // Agrupar inputs por columna
      const columns = [];
      const rows = Array.from(table.querySelectorAll("tbody tr"));
      rows.forEach(row => {
        Array.from(row.children).forEach((cell, columnIndex) => {
          columns[columnIndex] = columns[columnIndex] || [];
          const input = cell.querySelector("input");
          if (input) columns[columnIndex].push(input);
        });
      });

      // Crear una lista ordenada por columna y luego por filas dentro de cada columna
      const orderedInputs = columns.flat(); // Los elementos están en orden columna por columna

      // Identificar el índice actual en la lista ordenada
      const currentInput = event.target;
      const currentIndex = orderedInputs.indexOf(currentInput);

      // Determinar el próximo elemento según Shift
      const nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1;
      if (orderedInputs[nextIndex]) {
        orderedInputs[nextIndex].focus();
      }
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  // Desactivar flechas para todos los inputs actuales en Cost
  document.querySelectorAll("input[placeholder='Cost']").forEach(disableArrowKeys);

  // Desactivar flechas para nuevos inputs dinámicos al agregar filas
  const addButtons = ["svc", "ctr"];
  addButtons.forEach((tableId) => {
    document.querySelector(`button[onclick="addRow('${tableId}')"]`).addEventListener("click", () => {
      setTimeout(() => {
        const newCostInputs = document.querySelectorAll(`#${tableId}Table tbody input[placeholder='Cost']`);
        newCostInputs.forEach(disableArrowKeys); // Aplicar lógica a nuevos inputs
      }, 50); // Breve retraso para asegurar que la fila ya se haya agregado
    });
  });
});

function disableArrowKeys(input) {
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault(); // Bloquear el incremento/decremento
    }
  });
}




// Referencias a los elementos del DOM
// Referencias a los elementos del DOM
const copyTableButton = document.getElementById('copyTableButton');
const authInput = document.getElementById('authNumber');
const svcInput = document.getElementById('svcName');
const dataTable = document.getElementById('dataTable').getElementsByTagName('tbody')[0];

// Función para agregar filas dinámicamente con valores actualizados
function updateTable() {
    const authValue = authInput.value.trim();
    const svcValue = svcInput.value.trim();

    // Validar que los campos no estén vacíos
    if (!authValue || !svcValue) {
        return; // No hacemos nada si los campos están vacíos
    }

    // Obtener los valores de SVC y CTR en tiempo real
    const svcSubtotalElement = document.getElementById('svcSubtotal');
    const ctrSubtotalElement = document.getElementById('ctrSubtotal');

    if (!svcSubtotalElement || !ctrSubtotalElement) {
        console.error("Error: No se encuentran los elementos SVC o CTR en el DOM.");
        return;
    }

    const svcTotal = parseFloat(svcSubtotalElement.textContent.replace(/[^0-9.]/g, '')) || 0;
    const ctrTotal = parseFloat(ctrSubtotalElement.textContent.replace(/[^0-9.]/g, '')) || 0;

    const svcTotalValue = `$${svcTotal.toFixed(2)}`;
    const ctrTotalValue = `$${ctrTotal.toFixed(2)}`;
    const differenceValue = `$${(svcTotal - ctrTotal).toFixed(2)}`; // Calcula la diferencia

    // Crear una nueva fila en la tabla
    const newRow = dataTable.insertRow();

    // Lista de valores para cada celda (en el orden correcto)
    const cellValues = [
        authValue.slice(0, 7), // SP Number RFA
        "", // Date RFA Submitted
        new Date().toLocaleDateString(), // Date Assigned to Agent
        "", // Agent Name
        "", // Status
        authValue.slice(-5), // Authorization
        new Date().toLocaleDateString(), // Current Date
        svcValue, // SVC Name
        "", // Comments
        "", // Req Comp
        "", // Date Completed
        "NO", // Push Back precargado
        "", // Reason
        "0", // Times Push Back precargado
        svcTotalValue, // SVC Cost
        ctrTotalValue, // CTR Cost
        differenceValue, // Difference calculado
        "", // Amount Approved (en blanco por defecto)
        "" // Done
    ];

    // Agregar celdas editables con inputs
    cellValues.forEach(value => {
        const cell = newRow.insertCell();
        const input = document.createElement("input");
        input.type = "text";
        input.value = value;
        input.style.width = "100%";
        cell.appendChild(input);
    });

    // Limpiar los campos después de procesar la fila
    authInput.value = "";
    svcInput.value = "";
}

// Función para actualizar dinámicamente los valores de las filas existentes
function refreshTable() {
    const svcTotal = parseFloat(document.getElementById('svcSubtotal').textContent.replace(/[^0-9.]/g, '')) || 0;
    const ctrTotal = parseFloat(document.getElementById('ctrSubtotal').textContent.replace(/[^0-9.]/g, '')) || 0;
    const differenceValue = (svcTotal - ctrTotal).toFixed(2);

    // Actualizar cada fila con los valores actuales
    const rows = dataTable.querySelectorAll("tr");
    rows.forEach(row => {
        const cells = row.querySelectorAll("td input");
        if (cells.length > 14) {
            cells[14].value = `$${svcTotal.toFixed(2)}`; // SVC Cost
            cells[15].value = `$${ctrTotal.toFixed(2)}`; // CTR Cost
            cells[16].value = `$${differenceValue}`; // Difference
        }
    });
}

// Copiar los datos de la tabla sin encabezados y cambiar el texto del botón a "Copied"
copyTableButton.addEventListener('click', function () {
    let textToCopy = "";
    const rows = dataTable.querySelectorAll("tr");

    rows.forEach(row => {
        const cells = row.querySelectorAll("td input");
        let rowText = Array.from(cells).map(input => input.value).join("\t"); // Separa por tabulación
        textToCopy += rowText + "\n";
    });

    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = copyTableButton.textContent; // Guarda el texto original
        copyTableButton.textContent = "Copied"; // Cambia el texto del botón

        setTimeout(() => {
            copyTableButton.textContent = originalText; // Regresa al texto original después de 3 segundos
        }, 3000); // Espera 3 segundos
    }).catch(err => {
        console.error("Error al copiar datos: ", err);
    });
});

// Detectar cambios en los inputs y agregar filas automáticamente
authInput.addEventListener('blur', updateTable);
svcInput.addEventListener('blur', updateTable);

// Actualizar la tabla dinámicamente cuando cambien SVC o CTR
const svcSubtotalElement = document.getElementById('svcSubtotal');
const ctrSubtotalElement = document.getElementById('ctrSubtotal');

// Observadores para detectar cambios en los elementos de SVC y CTR
const observer = new MutationObserver(refreshTable);

if (svcSubtotalElement && ctrSubtotalElement) {
    observer.observe(svcSubtotalElement, { childList: true, subtree: true });
    observer.observe(ctrSubtotalElement, { childList: true, subtree: true });
}