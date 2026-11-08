// Referència a la col·lecció "items" de Firestore
const items = db.collection("items");

/**
 * Retorna l'UID de l'usuari amb la sessió iniciada, o null si no n'hi ha cap.
 * Cada ítem es guarda amb l'UID del seu propietari i cada usuari només veu els seus.
 */
function currentUid() {
  return auth.currentUser ? auth.currentUser.uid : null;
}

/**
 * Afegeix un nou document a la col·lecció.
 * @param {Object} doc - Objecte amb les propietats del nou ítem.
 */
async function addItem(doc) {
  try {
    // Esperem que Firebase afegeixi el document, marcat amb el seu propietari
    await add(items, { ...doc, uid: currentUid() });

    // Recàrrega la llista d'ítems per a mostrar el nou element
    await loadItems();

    // Neteja el formulari
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

    // Mostra un missatge d'èxit
    showAlert("Element guardat correctament", "alert-success");
  } catch (error) {
    // En cas d'error, mostra un missatge d'error
    showAlert("Error al intentar guardar l'element", "alert-danger");
  }
}

/**
 * Elimina un document per ID.
 * @param {string} id - ID del document a eliminar.
 */
async function deleteItem(id) {
  try {
    // Esperem que Firebase elimini el document
    await deleteById(items, id);

    // Recàrrega la llista per reflectir l'eliminació
    await loadItems();

    // Missatge d'èxit
    showAlert("Element eliminat correctament", "alert-success");
  } catch (error) {
    // Missatge d'error en cas de problema
    showAlert("Error al intentar eliminar l'element", "alert-danger");
  }
}

/**
 * Carrega les dades d'un document per editar.
 * @param {string} id - ID del document que volem editar.
 */
async function editItem(id) {
  try {
    // Emmagatzema temporalment l'ID en un camp ocult del formulari
    document.getElementById("elementId").value = id;

    // Esperem la lectura del document de Firestore
    const doc = await selectById(items, id);
    const data = doc.data();

    // Omple el formulari amb les dades actuals
    document.getElementById("title").value = data.title;
    document.getElementById("content").value = data.content;
  } catch (error) {
    // Si falla la lectura, mostra un error
    showAlert("Error al intentar editar l'element", "alert-danger");
  }
}

/**
 * Crea un botó de la taula amb el text, les classes i l'acció indicades.
 */
function createButton(text, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = text;
  button.addEventListener("click", onClick);
  return button;
}

/**
 * Recupera els documents de l'usuari actual i els mostra en una taula.
 */
async function loadItems() {
  const table = document.getElementById("listItems");
  const uid = currentUid();

  // Sense sessió iniciada no es mostra res
  if (!uid) {
    table.innerHTML = "";
    return;
  }

  try {
    // Obtenim només els documents de l'usuari actual
    const arrayItems = await selectWhere(items, "uid", "==", uid);

    // Capçalera de la taula
    table.innerHTML = `
      <tr>
        <th>Títol</th>
        <th>Contingut</th>
        <th></th>
      </tr>
    `;

    // Iterem cada document i construïm una fila per a la taula.
    // Fem servir textContent (no innerHTML) perquè el text de l'usuari
    // es mostri tal qual i no s'executi mai com a HTML o JavaScript.
    arrayItems.forEach((doc) => {
      const { title, content } = doc.data();
      const row = table.insertRow();
      row.insertCell().textContent = title;
      row.insertCell().textContent = content;

      const actions = row.insertCell();
      actions.append(
        createButton("Eliminar", "btn btn-danger float-right", () => deleteItem(doc.id)),
        createButton("Editar", "btn btn-primary mr-2 float-right", () => editItem(doc.id))
      );
    });
  } catch (error) {
    // Error mostrant la taula
    showAlert("Error al mostrar els elements", "alert-danger");
  }
}

/**
 * Actualitza un document existent.
 * @param {string} id - ID del document a actualitzar.
 * @param {Object} doc - Objecte amb les noves dades.
 */
async function updateItem(id, doc) {
  try {
    // Esperem que Firebase actualitzi el document
    await updateById(items, id, doc);

    // Recàrrega la llista per mostrar l'actualització
    await loadItems();

    // Neteja el formulari i l'ID ocult
    document.getElementById("elementId").value = "";
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

    // Missatge d'èxit
    showAlert("Element actualitzat correctament", "alert-success");
  } catch (error) {
    // Missatge d'error si no es pot actualitzar
    showAlert("Error al intentar actualitzar l'element", "alert-danger");
  }
}