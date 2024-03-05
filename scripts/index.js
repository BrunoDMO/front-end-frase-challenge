import getDados from "./getDados.js";

// Mapeia os elementos DOM que você deseja atualizar
const elementos = {
    top5: document.querySelector('[data-name="top5"]'),
    lancamentos: document.querySelector('[data-name="lancamentos"]'),
    series: document.querySelector('[data-name="series"]')
};
// Função genérica para tratamento de erros
function lidarComErro(mensagemErro) {
    console.error(mensagemErro);
}

const categoriaSelect = document.querySelector('[data-categorias]');
const sectionsParaOcultar = document.querySelectorAll('.section'); // Adicione a classe CSS 'hide-when-filtered' às seções e títulos que deseja ocultar.

categoriaSelect.addEventListener('change', function () {
    const categoria = document.querySelector('[data-name="categoria"]');
    const categoriaSelecionada = categoriaSelect.value;

    if (categoriaSelecionada === 'todos') {

        for (const section of sectionsParaOcultar) {
            section.classList.remove('hidden')
        }
        categoria.classList.add('hidden');

    } else {

        for (const section of sectionsParaOcultar) {
            section.classList.add('hidden')
        }

        categoria.classList.remove('hidden')
        // Faça uma solicitação para o endpoint com a categoria selecionada
        getDados(`/series/categoria/${categoriaSelecionada}`)
            .then(data => {
                criarListaFilmes(categoria, data);
            })
            .catch(error => {
                lidarComErro("Ocorreu um erro ao carregar os dados da categoria.");
            });
    }
});

// Array de URLs para as solicitações
geraSeries();
function geraSeries() {
    const urls = ['/series/frases'];

    // // Faz todas as solicitações em paralelo
    // Promise.all(urls.map(url => getDados(url)))
    //     .then(data => elementos.lancamentos.innerHTML = data.map(f=> f.poster));

    Promise.all(urls.map(url => getDados(url)))
        .then(data => {
            criarFrase(elementos.lancamentos, data);
        })
        .catch(error => {
            lidarComErro("Ocorreu um erro ao carregar os dados.");
        });

}

// Função para criar a lista de filmes
function criarFrase(elemento, dados) {
    // Verifique se há um elemento <ul> dentro da seção
    const ulExistente = elemento.querySelector('ul');

    // Se um elemento <ul> já existe dentro da seção, remova-o
    if (ulExistente) {
        elemento.removeChild(ulExistente);
    }

    const ul = document.createElement('ul');
    const listaHTML = dados.map((frase) => ` 
    <div class="frase_text">
        <p class="descricao titulo"> ${frase[0].titulo} </p>   
        <p class="descricao frase"> "${frase[0].frase} </p>
        <p class="descricao personagem"> By: ${frase[0].personagem}</p>
    </div>  
      
    <a> 
        <img class="descricao poster" src="${frase[0].poster}" alt="frase poster">
        <div class="cabecalho__logo" id="box-1">
            <img src="./img/logo.png" alt="Logo ScreenMatch">
            <h2 class="titulo">
                Frase do dia!
            </h2>
        </div>
    </a>
    
    `);

    ul.innerHTML = listaHTML;
    elemento.appendChild(ul);
}

