const API_KEY = "3f1d182";

const form = document.querySelector("#form-busca");
const input = document.querySelector("#input-busca");
const resultados = document.querySelector("#Resultado");
const loading = document.querySelector("#loading");
const erro = document.querySelector("#erro");
const modal = document.querySelector("#modal");
const modalDetalhes = document.querySelector("#modal-detalhes");
const fecharModal = document.querySelector("#fechar-modal");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const termo = input.value.trim();

  if (termo === "") {
    alert("Digite o nome de um filme.");
    return;
  }

  buscarFilmes(termo);
});

async function buscarFilmes(termo) {
  try {
    mostrarLoading();
    esconderErro();
    resultados.innerHTML = "";

    const url = `https://www.omdbapi.com/?s=${termo}&apikey=${API_KEY}`;
    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (dados.Response === "False") {
      mostrarErro();
      return;
    }

    renderizarCards(dados.Search);

  } catch {
    mostrarErro();
  } finally {
    esconderLoading();
  }
}

function renderizarCards(lista) {
  lista.forEach(filme => {
    const card = document.createElement("article");

    card.innerHTML = `
      <img src="${filme.Poster !== "N/A"
        ? filme.Poster
        : 'https://via.placeholder.com/300x450?text=Sem+Imagem'}"
        alt="${filme.Title}">
      <div class="card-info">
        <h3>${filme.Title}</h3>
        <p>${filme.Year}</p>
      </div>
    `;

    card.addEventListener("click", () => {
      buscarDetalhes(filme.imdbID);
    });

    resultados.appendChild(card);
  });
}

async function buscarDetalhes(id) {
  try {
    const url = `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${API_KEY}`;
    const resposta = await fetch(url);
    const dados = await resposta.json();

    abrirModal(dados);
  } catch {
    alert("Erro ao carregar detalhes");
  }
}

function abrirModal(filme) {
  modalDetalhes.innerHTML = `
    <h2>${filme.Title}</h2>
    <p><strong>Ano:</strong> ${filme.Year}</p>
    <p><strong>Gênero:</strong> ${filme.Genre}</p>
    <p><strong>Sinopse:</strong> ${filme.Plot}</p>
    <img src="${filme.Poster !== "N/A"
      ? filme.Poster
      : 'https://via.placeholder.com/300x450?text=Sem+Imagem'}"
      alt="${filme.Title}"
      style="width:100%; margin-top:10px;">
  `;

  modal.style.display = "flex";  
}

fecharModal.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

function mostrarLoading() {
  loading.classList.remove("hidden");
}

function esconderLoading() {
  loading.classList.add("hidden");
}

function mostrarErro() {
  erro.classList.remove("hidden");
}

function esconderErro() {
  erro.classList.add("hidden");
}