import getDados from "./getDados.js";

const params = new URLSearchParams(window.location.search);
const serieId = params.get('id');
const listaTemporadas = document.getElementById('temporadas-select');
const fichaSerie = document.getElementById('temporadas-episodios');
const fichaDescricao = document.getElementById('ficha-descricao');

// Função para carregar temporadas
function carregarTemporadas() {
    getDados(`/series/${serieId}/temporadas/todas`)
        .then(data => {
            const temporadasUnicas = [...new Set(data.map(temporada => temporada.temporada))];
            listaTemporadas.innerHTML = ''; // Limpa as opções existentes

            const optionDefault = document.createElement('option');
            optionDefault.value = '';
            optionDefault.textContent = 'Selecione a temporada'
            listaTemporadas.appendChild(optionDefault);

            temporadasUnicas.forEach(temporada => {
                const option = document.createElement('option');
                option.value = temporada;
                option.textContent = temporada;
                listaTemporadas.appendChild(option);
            });
            const optionTop = document.createElement('option');
            optionTop.value = 'top5';
            optionTop.textContent = 'Top5 Episódios';
            listaTemporadas.appendChild(optionTop);

            const optionTodos = document.createElement('option');
            optionTodos.value = 'todas';
            optionTodos.textContent = 'Todas as temporadas'
            listaTemporadas.appendChild(optionTodos);
        })
        .catch(error => {
            console.error('Erro ao obter temporadas:', error);
        });
}

// Função para carregar episódios de uma temporada
function carregarEpisodios() {
    getDados(`/series/${serieId}/temporadas/${listaTemporadas.value}`)
        .then(data => {
            const temporadasUnicas = [...new Set(data.map(temporada => temporada.temporada))];
            fichaSerie.innerHTML = '';

            if (listaTemporadas.value == 'top5') {
                const ul = document.createElement('ul');
                
                ul.className = 'episodios-lista';
                temporadasUnicas.forEach(temporada => {

                    const episodiosTemporadaAtual = data.filter(serie => serie.temporada === temporada);
                    const listaHTML = episodiosTemporadaAtual.map(serie => `
                            <li>
                                Episódio ${serie.numeroEpisodio} - Temporada ${serie.temporada} ${serie.titulo} ★${serie.avaliacao}
                            </li>
                    `).join('');


                    ul.innerHTML += listaHTML;
                });
                fichaSerie.appendChild(ul);

            } else {
                temporadasUnicas.forEach(temporada => {
                    const ul = document.createElement('ul');
                    ul.className = 'episodios-lista';

                    const episodiosTemporadaAtual = data.filter(serie => serie.temporada === temporada);

                    const listaHTML = episodiosTemporadaAtual.map(serie => `
                        <li>
                            Episódio ${serie.numeroEpisodio} - ${serie.titulo}
                        </li>
                    `).join('');
                    const paragrafo = document.createElement('p');
                    const linha = document.createElement('br');
                    paragrafo.textContent = `Temporada ${temporada}`;
                    fichaSerie.appendChild(paragrafo);
                    fichaSerie.appendChild(linha);
                    fichaSerie.appendChild(ul);


                    ul.innerHTML = listaHTML;
                });
            }
        }).catch(error => {
            console.error('Erro ao obter episódios:', error);
        });
}

// Função para carregar episódios de uma temporada
function carregarTopEpisodios() {
    getDados(`/series/${serieId}/temporadas/top5`)
        .then(data => {
            const temporadasUnicas = [...new Set(data.map(temporada => temporada.temporada))];
            fichaSerie.innerHTML = '';
            temporadasUnicas.forEach(temporada => {
                const ul = document.createElement('ul');
                ul.className = 'episodios-lista';

                const episodiosTemporadaAtual = data.filter(serie => serie.temporada === temporada);

                const listaHTML = episodiosTemporadaAtual.map(serie => `
                    <li>
                        Episódio ${serie.numeroEpisodio} - ${serie.titulo}
                    </li>
                `).join('');
                ul.innerHTML = listaHTML;

                const paragrafo = document.createElement('p');
                const linha = document.createElement('br');
                fichaSerie.appendChild(paragrafo);
                fichaSerie.appendChild(linha);
                fichaSerie.appendChild(ul);
            });
        })
        .catch(error => {
            console.error('Erro ao obter episódios:', error);
        });
}

// Função para carregar informações da série
function carregarInfoSerie() {
    getDados(`/series/${serieId}`)
        .then(data => {
            fichaDescricao.innerHTML = `
                <img src="${data.poster}" alt="${data.titulo}" />
                <div>
                    <h2>${data.titulo}</h2>
                    <div class="descricao-texto">
                        <p><b>Média de avaliações:</b> ${data.avaliacao}</p>
                        <p>${data.sinopse}</p>
                        <p><b>Estrelando:</b> ${data.atores}</p>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Erro ao obter informações da série:', error);
        });
}

// Adiciona ouvinte de evento para o elemento select
listaTemporadas.addEventListener('change', carregarEpisodios);

// Carrega as informações da série e as temporadas quando a página carrega
carregarInfoSerie();
carregarTemporadas();
