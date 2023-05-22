let values = {
  entry: [],
  exit: [],
  desExit: [],
  desEntry: [],
  previous: 0,
  sum: 0,
  total: 0,
};

let contEntry = 0,
  contExit = 0;

// entradas---------------------------------------------------------
const createNewEntry = document.querySelector(".set-entry"),
  cardEntry = document.querySelector(".add-card"),
  disabledOrEnabledEntry = document.querySelector("#add-entry");

let descriptionEntry, valueEntry;

function addNewEntry() {
  createNewEntry.innerHTML = `
  <div class="modal-shadow">
    <div class="_entry modal">
      <h4>Adicionar <span style="color: green;">entrada</span></h4>
      <input type="text" id="entry-description" placeholder="descrição"/> <br>
      <input type="number" id="entry-value" placeholder="R$ 0,00"/> <br>
      <div class="buttons-add">
        <button onclick="removeEntry()" class="back">cancelar</button>
        <button onclick="addEntry()" class="entry">adicionar</button>
      </div>
    </div>
  </div>`;
  document.querySelector("._entry").classList.add("select");
  document.querySelector(".modal-shadow").classList.add("select");
  disabledOrEnabledEntry.disabled = true;

  // precionar o enter para adicionar saida ou entrada
  document.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      addEntry();
    }
  });
}

function addEntry() {
  valueEntry = document.querySelector("#entry-value").value;
  values.entry.push(+valueEntry);

  descriptionEntry = document.querySelector("#entry-description").value;
  values.desEntry.push(descriptionEntry);

  disabledOrEnabledEntry.disabled = false;
  createNewEntry.innerHTML = "";
  cardEntry.innerHTML += `<div class="card-entry entry${contEntry}">
  <p><b>${descriptionEntry}</b>${descriptionEntry === "" ? "" : ": R$ "}
  ${values.entry[values.entry.length - 1].toFixed(2).replace(".", ",")}</p>
  <img src="./assets/x.svg" alt="excluir valor" class="close" onclick="openModal(this)">
  </div>`;
  contEntry++;
}

function removeEntry() {
  createNewEntry.innerHTML = "";
  disabledOrEnabledEntry.disabled = false;
}

// saidas--------------------------------------------------------------------
const createNewExit = document.querySelector(".set-exit"),
  cardExit = document.querySelector(".add-card-exit"),
  disabledOrEnabledExit = document.querySelector("#add-exit");

let descriptionExit, valueExit;

function addNewExit() {
  createNewExit.innerHTML = `
  <div class="modal-shadow">
    <div class="exit modal">
      <h4>Adicionar <span style="color: red;">saída</span></h4>
      <input type="text" id="exit-description" placeholder="descrição"/> <br>
      <input type="number" id="exit-value" placeholder="R$ 0,00"/> <br>
      <div class="buttons-add">
        <button onclick="removeExit()" class="back">cancelar</button>
        <button onclick="addExit()" class="entry">adicionar</button>
      </div>
    </div>
  </div>`;

  document.querySelector(".exit").classList.add("select");
  document.querySelector(".modal-shadow").classList.add("select");
  disabledOrEnabledExit.disabled = true;

  // precionar o enter para adicionar saida ou entrada
  document.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      addExit();
    }
  });
}

function addExit() {
  valueExit = document.querySelector("#exit-value").value;
  values.exit.push(+valueExit);

  descriptionExit = document.querySelector("#exit-description").value;
  values.desExit.push(descriptionExit);

  disabledOrEnabledExit.disabled = false;

  createNewExit.innerHTML = "";
  cardExit.innerHTML += `<div class="card-exit exit${contExit}">
  <p><b>${descriptionExit}</b>${descriptionExit === "" ? "" : ": R$ "}
  ${values.exit[values.exit.length - 1].toFixed(2).replace(".", ",")}</p>
  <img src="./assets/x.svg" alt="excluir valor" class="close" onclick="openModal(this)">
  </div>`;
  contExit++;
}

function removeExit() {
  createNewExit.innerHTML = "";
  disabledOrEnabledExit.disabled = false;
}

function calculate(event) {
  event.preventDefault();

  // removendo os itens de entrada que o usuário excluiu entradas--------------
  const itensToRemoveEn = [];
  for (let i = 0; i < values.desEntry.length; i++) {
    let element = document.querySelector(`.entry${i}`);

    if (element.classList.contains("remove")) {
      itensToRemoveEn.push(i);
    }
  }

  for (let i = itensToRemoveEn.length - 1; i >= 0; i--) {
    const index = itensToRemoveEn[i];

    values.entry.splice(index, 1);
    values.desEntry.splice(index, 1);
  }

  // para as saídas----------------
  const itensToRemoveEx = [];
  for (let i = 0; i < values.desExit.length; i++) {
    let element = document.querySelector(`.entry${i}`);

    if (element.classList.contains("remove")) {
      itensToRemoveEx.push(i);
    }
  }

  for (let i = itensToRemoveEx.length - 1; i >= 0; i--) {
    const index = itensToRemoveEx[i];

    values.exit.splice(index, 1);
    values.desExit.splice(index, 1);
  }
  // --------------------------------------------------------------------------

  values.previous = +document.querySelector("#balance").value;

  let sumExit = 0;
  for (let i = 0; i < values.entry.length; i++) {
    values.sum += values.entry[i];
  }

  for (let j = 0; j < values.exit.length; j++) {
    sumExit += values.exit[j];
  }

  values.total = values.sum - sumExit + values.previous;

  const result = document.querySelector(".input-info");
  const table = document.querySelector("table");
  const main = document.querySelector(".container");
  main.innerHTML = "";
  table.classList.add("select");
  for (let i = 0; i < values.desEntry.length; i++) {
    result.innerHTML += `
    <tr>
      <td></td>
      <td>${values.desEntry[i]}</td>
      <td class="table-green">${values.entry[i]
        .toFixed(2)
        .replace(".", ",")}</td>
      <td></td>
    </tr>
    `;
  }
  for (let j = 0; j < values.desExit.length; j++) {
    result.innerHTML += `<tr>
      <td></td>
      <td>${values.desExit[j]}</td>
      <td></td>
      <td class="table-red">${values.exit[j].toFixed(2).replace(".", ",")}</td>
    </tr>
    `;
  }

  result.innerHTML += `
  <tr>
    <td class="table-head"><b>saldo anterior</b></td>
    <td colspan=3>${values.previous.toFixed(2).replace(".", ",")}</td>
  </tr>
  <tr>
    <td class="table-head"><b>saldo atual</b></td>
    <td colspan=3>${values.total.toFixed(2).replace(".", ",")}</td>
  </tr>
  <tr>
    <td class="table-head"><b>para conferência</b></td>
    <td colspan=3>${(values.sum + values.previous)
      .toFixed(2)
      .replace(".", ",")}</td>
  </tr>
  <tr>
    <td class="table-head table-green">total de entradas</td>
    <td colspan=3 class="table-green">${values.sum
      .toFixed(2)
      .replace(".", ",")}</td>
  </tr>
  <tr>
    <td class="table-head table-red">total de saídas</td>
    <td colspan=3 class="table-red">${sumExit.toFixed(2).replace(".", ",")}</td>
  </tr>
  <tr class="table-rend">
    <td class="table-head ${
      values.sum - sumExit >= 0 ? "table-green" : "table-red"
    }">rendimento mensal</td>
    <td colspan=3 class="${
      values.sum - sumExit >= 0 ? "table-green" : "table-red"
    }">${(values.sum - sumExit).toFixed(2).replace(".", ",")}</td>
  </tr>
  `;

  document.querySelector(".restart").style.display = "inline";
  document.querySelector(".save").style.display = "inline";
}

function save(event) {
  event.preventDefault();
  window.print();
}

let elementCard;
const modalShadow = document.querySelector(".modal-shadow"),
  modal = document.querySelector(".modal");

function openModal(e) {
  elementCard = e;

  modalShadow.style.display = "block";
  modal.style.display = "block";
}

function closeModal() {
  modalShadow.style.display = "none";
  modal.style.display = "none";
}

function deleteCard() {
  modalShadow.style.display = "none";
  modal.style.display = "none";
  elementCard.parentElement.classList.add("remove");
}
