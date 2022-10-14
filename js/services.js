const baseUrl = "http://127.0.0.1:8000/api";

const fetchSaludoBienvenida = async () => {
  let hora = new Date();
  const url = `${baseUrl}/saludo/?hora=${hora.getHours()}:${hora.getMinutes()}`;
  const resp = await fetch(url);
  if (resp.status == 200) {
    const body = await resp.json();
    return body[0];
  } else {
    return undefined;
  }
};

const fetchSaludoPresentacion = async () => {
  let tipo = "MPre";
  const url = `${baseUrl}/generico/?tipo=${tipo}`;
  const resp = await fetch(url);
  if (resp.status == 200) {
    const body = await resp.json();
    return body[0];
  } else {
    return undefined;
  }
};

const fetchCategorias = async () => {
  const url = `${baseUrl}/categoria`;
  const resp = await fetch(url);
  if (resp.status == 200) {
    const body = await resp.json();
    return body;
  } else {
    return undefined;
  }
};

const fetchSubcategoriasByCategoria = async (id) => {
  const url = `${baseUrl}/subcategoria/?id_cat=${id}`;
  const resp = await fetch(url);
  if (resp.status == 200) {
    const body = await resp.json();
    return body;
  } else {
    return undefined;
  }
};

const fetchSubcategoriasByIdSubcategoria = async (id) => {
  const url = `${baseUrl}/subcategoria/${id}/subcategoria`;
  const resp = await fetch(url);
  if (resp.status == 200) {
    const body = await resp.json();
    return body;
  } else {
    return undefined;
  }
};

const fetchQuestionByIdSubcategoria = async (id) => {
  const url = `${baseUrl}/subcategoria/${id}/pregunta`;
  const resp = await fetch(url);
  if (resp.status == 200) {
    const body = await resp.json();
    return body;
  } else {
    return undefined;
  }
};

const fetchQuestion = async (id) => {
  const url = `${baseUrl}/pregunta/${id}/`;
  const resp = await fetch(url);
  if (resp.status == 200) {
    const body = await resp.json();
    return body;
  } else {
    return undefined;
  }
};

export {
  fetchSaludoBienvenida,
  fetchSaludoPresentacion,
  fetchCategorias,
  fetchSubcategoriasByCategoria,
  fetchSubcategoriasByIdSubcategoria,
  fetchQuestionByIdSubcategoria,
  fetchQuestion,
};
