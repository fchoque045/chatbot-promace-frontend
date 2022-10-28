const baseUrl = "https://chatbot.promace2.jujuy.edu.ar/api";

const fetchSaludoBienvenida = async () => {
  const url = `${baseUrl}/saludo/`;
  const resp = await fetch(url);
  if (resp.status == 200) {
    const body = await resp.json();
    return body[0];
  }
  return undefined;
};

const fetchDespedida = async (text) => {
  const url = `${baseUrl}/despedida/?text=${text}`;
  const resp = await fetch(url);
  if (resp.status == 200) {
    const body = await resp.json();
    return body[0];
  }
  if (resp.status == 404) {
    return [];
  }
  return undefined;
};

const fetchGenerico = async (tipo) => {
  const url = `${baseUrl}/generico/?tipo=${tipo}`;
  const resp = await fetch(url);
  if (resp.status == 200) {
    const body = await resp.json();
    return body[0];
  }
  return undefined;
};

const fetchCategorias = async () => {
  const url = `${baseUrl}/categoria`;
  const resp = await fetch(url);
  if (resp.status == 200) {
    const body = await resp.json();
    return body;
  }
  return undefined;
};

const fetchSubcategoriasByCategoria = async (id) => {
  const url = `${baseUrl}/subcategoria/?id_cat=${id}`;
  const resp = await fetch(url);
  if (resp.status == 200) {
    const body = await resp.json();
    return body;
  }
  if (resp.status == 404) {
    return [];
  }
  return undefined;
};

const fetchSubcategoriasByIdSubcategoria = async (id) => {
  const url = `${baseUrl}/subcategoria/${id}/subcategoria`;
  const resp = await fetch(url);
  if (resp.status == 200) {
    const body = await resp.json();
    return body;
  }
  if (resp.status == 404) {
    return [];
  }
  return undefined;
};

const fetchQuestionByIdSubcategoria = async (id) => {
  const url = `${baseUrl}/subcategoria/${id}/pregunta`;
  const resp = await fetch(url);
  if (resp.status == 200) {
    const body = await resp.json();
    return body;
  }
  return [];
};

const fetchQuestionByIdCategoria = async (id) => {
  const url = `${baseUrl}/categoria/${id}/pregunta`;
  const resp = await fetch(url);
  if (resp.status == 200) {
    const body = await resp.json();
    return body;
  }
  return [];
};

const fetchQuestion = async (id) => {
  const url = `${baseUrl}/pregunta/${id}/`;
  const resp = await fetch(url);
  if (resp.status == 200) {
    const body = await resp.json();
    return body;
  }
  return undefined;
};

const fetchQuestionByKeyword = async (text) => {
  const url = `${baseUrl}/preguntaKeyword/?keyword=${text}`;
  const resp = await fetch(url);
  if (resp.status == 200) {
    const body = await resp.json();
    return body;
  }
  if (resp.status == 404) {
    return [];
  }
  return undefined;
};

export {
  fetchSaludoBienvenida,
  fetchDespedida,
  fetchGenerico,
  fetchCategorias,
  fetchSubcategoriasByCategoria,
  fetchSubcategoriasByIdSubcategoria,
  fetchQuestionByIdSubcategoria,
  fetchQuestionByIdCategoria,
  fetchQuestion,
  fetchQuestionByKeyword,
};
