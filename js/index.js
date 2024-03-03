const $d = document;
const $form = $d.querySelector(".crud-form");
const $table = $d.querySelector(".crud-table");
const $title = $d.querySelector(".crud-title");
const $template = $d.getElementById("crud-template").content;
const $fragment = $d.createDocumentFragment(); // fragment per no re-renderitzar tota la taula, conté els nodes que volem afegir

const getAll = async () => {
  try {
    let res = await fetch("http://localhost:4444/results");
    let data = await res.json();
    console.log(data);
    data.forEach((el) => {
      // Set dataset attributes for each row
      // $template.querySelector(".id").dataset.id = el.id; // data-id per editar el registre
      $template.querySelector(".nom").textContent = el.name; // data-nom per editar el registre
      $template.querySelector(".especie").textContent = el.species; // data-especie per editar el registre
      $template.querySelector(".estat").textContent = el.status; // data-status per editar el registre
      $template.querySelector(".update").dataset.id = el.id; // data-id per eliminar el registre
      $template.querySelector(".update").dataset.nom = el.name; // data-id per eliminar el registre
      $template.querySelector(".update").dataset.especie = el.species; // data-id per eliminar el registre
      $template.querySelector(".update").dataset.estat = el.status; // data-id per eliminar el registre
      $template.querySelector(".delete").dataset.id = el.id; // data-id per eliminar el registre

      let $clone = $d.importNode($template, true); // clonem el template, true per clonar tot el contingut
      $fragment.appendChild($clone);

      console.log(el);
    });

    $table.querySelector("tbody").appendChild($fragment);
  } catch (e) {
    console.error(e);
  }
};

$d.addEventListener("DOMContentLoaded", getAll);

$d.addEventListener("submit", async (e) => {
  // console.log("Entrando a la función submit");
  // e.preventDefault();
  if (e.target === $form) {
    e.preventDefault();
    if (!e.target.id.value) {
      // POST
      try {
        // get last id from db.json
        let res = await fetch("http://localhost:4444/results");
        let data = await res.json();
        let lastId = data[data.length - 1].id;

        let options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            id: lastId + 1,
            name: e.target.nom.value,
            species: e.target.especie.value,
            status: e.target.estat.value,
          }),
        };
        res = await fetch("http://localhost:4444/results", options);
        let json = await res.json();
        location.reload();
      } catch (e) {
        console.error(e);
      }
    } else {
      // PUT
      try {
        let options = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: e.target.nom.value,
            species: e.target.especie.value,
            status: e.target.estat.value,
          }),
        };
        let res = await fetch(
          `http://localhost:4444/results/${e.target.id.value}`,
          options
        );
        let json = await res.json();
        location.reload();
        btnEnvia.value = "Afegir";
        $title.textContent = "Agregar nou personatge";
      } catch (e) {
        console.error(e);
      }
    }
  }
});

$d.addEventListener("click", async (e) => {
  if (e.target.matches(".delete")) {
    let isDelete = confirm(
      `Estàs segur d'eliminar el registre amb l'Id: ${e.target.dataset.id}?`
    );
    if (isDelete) {
      try {
        let options = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        };
        let res = await fetch(
          `http://localhost:4444/results/${e.target.dataset.id}`,
          options
        );
        let json = await res.json();
        location.reload();
      } catch (e) {
        console.error(e);
      }
    }
  }

  if (e.target.matches(".update")) {
    $title.textContent = "Editar personatge";
    console.log(
      e.target.dataset.id,
      e.target.dataset.nom,
      e.target.dataset.especie,
      e.target.dataset.estat
    );
    $form.nom.value = e.target.dataset.nom;
    $form.especie.value = e.target.dataset.especie;
    $form.estat.value = e.target.dataset.estat;
    $form.id.value = e.target.dataset.id;
    $form.btnEnvia.value = "Desar";
  }
});
