import getDados from "./getDados.js";

// Mapeia os elementos DOM que você deseja atualizar
const elementos = {
    frase: document.querySelector('[data-name="frase_match"]'),
};
// Função genérica para tratamento de erros
function lidarComErro(mensagemErro) {
    console.error(mensagemErro);
}

// Array de URLs para as solicitações
geraSeries();
function geraSeries() {
    const urls = ['/series/frases'];

    // Faz todas as solicitações em paralelo
    Promise.all(urls.map(url => getDados(url)))
        .then(data => {
            criarFrase(elementos.frase, data);
        })
        .catch(error => {
            lidarComErro(error);
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

    //Função para carregar nova frase
    var button = document.querySelector(".button_frase_nova");
    button.addEventListener("click", geraSeries);
}

