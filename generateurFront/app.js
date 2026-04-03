let expenseCount = 1;

const selectVehicule = document.getElementById('selectVehicule');
const displayTotalKm = document.getElementById('displayTotalKm');
const inputMontant = document.getElementById('inputMontant');

const expensesContainer = document.getElementById('expenses-container');
const addExpenseButton = document.getElementById('add-expense-button');
const deleteExpenseButton = document.getElementById('delete-expense-button');
const pdfTableBody = document.getElementById('pdf-table-body');

expensesContainer.addEventListener('input', calculerTotaux);
selectVehicule.addEventListener('change', calculerTotaux);

function calculerTotaux() {
  let totalKm = 0;
  let totalPeage = 0;
  let totalAutre = 0;

  for (let i = 1; i <= expenseCount; i++) {
    let kmValue = parseFloat(document.getElementById(`expKm${i}`).value);
    let peageValue = parseFloat(document.getElementById(`expPeage${i}`).value);
    let autreValue = parseFloat(document.getElementById(`expAutre${i}`).value);

    if (isNaN(kmValue)){
      kmValue = 0;
    }
    if (isNaN(peageValue)){
      peageValue = 0;
    }
    if (isNaN(autreValue)){
      autreValue = 0;
    }

    totalKm += kmValue;
    totalPeage += peageValue;
    totalAutre += autreValue;
  }

  const bareme = parseFloat(selectVehicule.value);

  const totalPrixKm = totalKm * bareme;
  const total = totalPrixKm + totalPeage + totalAutre;

  displayTotalKm.innerText = totalKm.toFixed(2) + " km";
  displayTotalKm.value = totalKm.toFixed(2) + " km";
  inputMontant.value = total.toFixed(2) + " €";

  document.getElementById("pdfTotalKm").innerText = totalKm.toFixed(2) + " km";
  document.getElementById("pdfBareme").innerText = bareme.toFixed(2) + " €/km";
  document.getElementById("pdfTotalPrixKm").innerText = totalPrixKm.toFixed(2) + " €";
  document.getElementById("pdfTotalPeage").innerText = totalPeage.toFixed(2) + " €";
  document.getElementById("pdfTotalAutre").innerText = totalAutre.toFixed(2) + " €";
  document.getElementById("pdfTotal").innerText = total.toFixed(2) + " €";

  const optionSelectionnee = selectVehicule.options[selectVehicule.selectedIndex];
  const categorie = optionSelectionnee.parentElement.label;

  const ligneDeduction = document.getElementById("ligne-deduction");
  const pdfApresDeduction = document.getElementById("pdfApresDeduction");
  const zoneBanque = document.getElementById("zone-banque");
  const inputIban = document.getElementById("inputIban");
  const inputBic = document.getElementById("inputBic");

  if (categorie == "Abandon de frais") {
    ligneDeduction.style.display = "table-row";
    const apresDeduction = total * 0.34;
    pdfApresDeduction.innerText = apresDeduction.toFixed(2) + " €";

    zoneBanque.style.display = "none";
    inputIban.required = false;
    inputBic.required = false;
  } else {
    ligneDeduction.style.display = "none"; 
    zoneBanque.style.display = "block";
    inputIban.required = true;
    inputBic.required = true;
  }
}


calculerTotaux();

const canvas = document.querySelector('canvas');
const form = document.querySelector('.form');
const clearButton = document.getElementById('clear-button');
const clearSignButton = document.getElementById('clear-sign-button')
const ctx = canvas.getContext('2d');

let writingMode = false;

const handlePointerDown = (event) => {
  writingMode = true;
  ctx.beginPath();
  const [positionX, positionY] = getCursorPosition(event);
  ctx.moveTo(positionX, positionY);
}

const handlePointerUp = () => {
  writingMode = false;
}

const handlePointerMove = (event) => {
  if (!writingMode) return
  const [positionX, positionY] = getCursorPosition(event);
  ctx.lineTo(positionX, positionY);
  ctx.stroke();
}

canvas.addEventListener('pointerdown', handlePointerDown, {passive: true});
canvas.addEventListener('pointerup', handlePointerUp, {passive: true});
canvas.addEventListener('pointermove', handlePointerMove, {passive: true});

const getCursorPosition = (event) => {
  const positionX = event.clientX - event.target.getBoundingClientRect().x;
  const positionY = event.clientY - event.target.getBoundingClientRect().y;
  return [positionX, positionY];
}

ctx.lineWidth = 3;
ctx.lineJoin = ctx.lineCap = 'round';

clearSignButton.addEventListener('click', (event) => {
  event.preventDefault();
  clearPad();
});

const imageURL = canvas.toDataURL();
const image = document.createElement('img');

// gestion ajout de dépenses individuelles

addExpenseButton.addEventListener('click', () => {
  expenseCount++;
  const newRow = document.createElement('div');
  newRow.className = 'expense-row';
  newRow.innerHTML = `
    <div class="expense-main">
      <div class="form-group">
        <label for="expDate${expenseCount}">Date</label>
        <input type="date" id="expDate${expenseCount}" required />
      </div>
      <div class="form-group">
        <label for="expObjet${expenseCount}">Objet de la dépense</label>
        <input type="text" id="expObjet${expenseCount}" required />
      </div>
      <div class="form-group">
        <label for="expKm${expenseCount}">Km effectués</label>
        <input type="number" id="expKm${expenseCount}" step="1" min="0" value="0" required />
      </div>
    </div>
    <div class="expense-details">
      <div class="form-group">
        <label for="expPeage${expenseCount}">Péages, transports</label>
        <input type="number" id="expPeage${expenseCount}" step="0.01" min="0" value="0" required />
      </div>
      <div class="form-group">
        <label for="expAutre${expenseCount}">Autres</label>
        <input type="number" id="expAutre${expenseCount}" step="0.01" min="0" value="0" required />
      </div>
    </div>
  `;
  expensesContainer.appendChild(newRow);

  const newPdfRow = document.createElement('tr');
  newPdfRow.innerHTML = `
    <td id="pdfExpDate${expenseCount}"></td>
    <td id="pdfExpObjet${expenseCount}"></td>
    <td id="pdfExpKm${expenseCount}"></td>
    <td id="pdfExpPeage${expenseCount}"></td>
    <td id="pdfExpAutre${expenseCount}"></td>
  `;
  pdfTableBody.appendChild(newPdfRow);
});

deleteExpenseButton.addEventListener('click', () => {
  if (expenseCount > 1) {
    expensesContainer.removeChild(expensesContainer.lastElementChild);
    pdfTableBody.removeChild(pdfTableBody.lastElementChild);
    expenseCount--;
    calculerTotaux();
  }
});

const clearPad = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

clearButton.addEventListener('click', (event) => {
  event.preventDefault();
  clearPad();
  form.reset();
  document.getElementById("ticketImage").innerHTML = '';
});

// ajout ticket de caisse par l'utilisateur

const inputFile = document.getElementById("input-file");

inputFile.addEventListener("change", uploadImage);

function uploadImage() {
  document.getElementById("ticketImage").innerHTML = '';
  for (let i = 0; i < inputFile.files.length; i++) {
    const file = inputFile.files[i];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const base64Image = event.target.result;
        document.getElementById("ticketImage").innerHTML += `<img src="${base64Image}"/>`;
      };
      reader.readAsDataURL(file);
    }
  }
}

// génération du PDF

function preparerPdf() {
  const nomSaisi = document.getElementById("inputNom").value;
  const mailSaisi = document.getElementById("inputMail").value;
  const dateSaisie = document.getElementById("inputDate").value;
  const raisonSaisie = document.getElementById("inputRaison").value;
  const budgetSaisi = document.getElementById("selectBudget").value;
  const montantSaisi = document.getElementById("inputMontant").value;
  const ibanSaisi = document.getElementById("inputIban").value;
  const bicSaisi = document.getElementById("inputBic").value;

  document.getElementById("pdfNom").innerText = nomSaisi;
  document.getElementById("pdfMail").innerText = mailSaisi; 
  document.getElementById("pdfDate").innerText = dateSaisie;
  document.getElementById("pdfRaison").innerText = raisonSaisie;
  document.getElementById("pdfBudget").innerText = budgetSaisi;
  document.getElementById("pdfMontant").innerText = montantSaisi;

  for (let i = 1; i <= expenseCount; i++) {
    const expDate = document.getElementById(`expDate${i}`).value;
    const expObjet = document.getElementById(`expObjet${i}`).value;
    const expKm = document.getElementById(`expKm${i}`).value;
    const expPeage = document.getElementById(`expPeage${i}`).value;
    const expAutre = document.getElementById(`expAutre${i}`).value;

    document.getElementById(`pdfExpDate${i}`).innerText = expDate;
    document.getElementById(`pdfExpObjet${i}`).innerText = expObjet;
    document.getElementById(`pdfExpKm${i}`).innerText = expKm;
    document.getElementById(`pdfExpPeage${i}`).innerText = expPeage + "€";
    document.getElementById(`pdfExpAutre${i}`).innerText = expAutre + "€";
  }
  
  const imageURL = canvas.toDataURL('image/png');
  document.getElementById("pdfSignature").innerHTML = `<img src="${imageURL}"/>`;

  const optionSelectionnee = selectVehicule.options[selectVehicule.selectedIndex];
  const categorie = optionSelectionnee.parentElement.label;
  const titrePDF = document.getElementById("titrePDF");
  const texteRemboursement = document.getElementById("texteRemboursement");
  let typeDeFraisSaisi = "";

  if (categorie == "Abandon de frais") {
    titrePDF.innerText= "Abandon de frais";
    texteRemboursement.innerText = "Montant du don :";
    typeDeFraisSaisi = "Abandon";
    document.getElementById("pdfLigneBanque").style.display = "none"; 
  } else {
    titrePDF.innerText= "Note de frais";
    texteRemboursement.innerText = "Montant à rembourser :";
    typeDeFraisSaisi = "Remboursement";
    document.getElementById("pdfLigneBanque").style.display = "block";
    document.getElementById("pdfIban").innerText = ibanSaisi;
    document.getElementById("pdfBic").innerText = bicSaisi;
  }

  const htmlPdf = document.getElementById("zone-pdf");
  const options = {
    margin: 10,
    filename: "Note de frais " + nomSaisi + ".pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, scrollY: 0, scrollX: 0 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ['css', 'legacy'] }
  };

  return {
    worker: html2pdf().set(options).from(htmlPdf),
    donnees: {
      nom: nomSaisi,
      mail: mailSaisi,
      raison: raisonSaisie,
      budget: budgetSaisi,
      montant: parseFloat(montantSaisi),
      dateDemande: dateSaisie,
      typeDeFrais: typeDeFraisSaisi,
      iban: ibanSaisi,
      bic: bicSaisi
    }
  };
}

// envoi du PDF au back

const submitButton = document.getElementById('submit-button');
const checkboxEmail = document.getElementById('checkbox-email');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitButton.innerText = "Traitement en cours...";
    submitButton.disabled = true;
    checkboxEmail.disabled = true;
    const preparation = preparerPdf();
    const veutMail = checkboxEmail.checked;
    preparation.worker.outputPdf('datauristring')
      .then((pdfBase64) => {
        const payload = { ...preparation.donnees, pdfBase64: pdfBase64, envoyerMail: veutMail };
        return fetch('http://localhost:8080/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      })
      .then(response => {
        if (!response.ok) throw new Error("Problème avec le serveur");
        return response.text();
      })
      .then((reponseServeur) => {
        clearPad();
        form.reset();
        document.getElementById("ticketImage").innerHTML = '';
        submitButton.innerText = "Valider la note de frais";
        submitButton.disabled = false;
        checkboxEmail.disabled = false;
        let messageFinal = "Succès : La note a bien été enregistrée et téléchargée.";
        if (veutMail) {
            messageFinal = "Succès : La note a bien été téléchargée et envoyée par mail.";
        }
        alert(messageFinal);
        return preparation.worker.save().then(() => reponseServeur);
      })
      .catch((erreur) => {
        console.error("Erreur lors de la validation :", erreur);
        alert("Une erreur est survenue lors du traitement de la note de frais.");
        submitButton.innerText = "Valider la note de frais";
        submitButton.disabled = false;
        checkboxEmail.disabled = false;
      });
});