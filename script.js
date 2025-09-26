const telaLogin = document.getElementById('tela-login');
const telaLoja = document.getElementById('tela-loja');
const loginFeedback = document.getElementById('login-feedback');
const produtosGrid = document.getElementById('produtos-grid');
const carrinhoLista = document.getElementById('carrinho-lista');
const carrinhoTotal = document.getElementById('carrinho-total');
const resumoPedido = document.getElementById('resumo-pedido');
const conteudoLoja = document.querySelector('.conteudo-loja');

/** Array de produtos */

const produtosDisponiveis = [
    { codigo: 1, nome: 'Camiseta', preco: 49.90, imagem: 'imagens/camisa.jpg' },
    { codigo: 2, nome: 'Calça', preco: 129.90, imagem: 'imagens/calça jeans.jpg' },
    { codigo: 3, nome: 'Tênis', preco: 249.90, imagem: 'imagens/tenis.jpg' },
    { codigo: 4, nome: 'Jaqueta', preco: 399.90, imagem: 'imagens/jaqueta.jpg' },
    { codigo: 5, nome: 'Boné', preco: 39.90, imagem: 'imagens/boné.jpg' },
    { codigo: 6, nome: 'Meia', preco: 19.90, imagem: 'imagens/meia.jpg' },
];

/** Verificações */
let carrinho = [];
let usuarioLogado = false;

// --- Funções ---

/** Login */

function fazerLogin() {
    const usuarioInput = document.getElementById('usuario').value;
    const senhaInput = document.getElementById('senha').value;

    if (usuarioInput === 'admin' && senhaInput === '123') {
        usuarioLogado = true;
        telaLogin.style.display = 'none';
        telaLoja.style.display = 'block';
        loginFeedback.textContent = '';
        renderizarProdutos();
    } else {
        loginFeedback.textContent = 'Usuário ou senha inválidos.';
    }
}

/** Logout */
function fazerLogout() {
    usuarioLogado = false;
    carrinho = [];
    atualizarCarrinho();
    telaLoja.style.display = 'none';
    telaLogin.style.display = 'flex';
    document.getElementById('usuario').value = '';
    document.getElementById('senha').value = '';
}

/** Mostrar catalogo */
function renderizarProdutos() {
    produtosGrid.innerHTML = '';

    produtosDisponiveis.forEach(produto => {
        const cardProduto = `
            <div class="produto-card">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <h3>${produto.nome}</h3>
                <p>R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
                <button onclick="adicionarAoCarrinho(${produto.codigo})">
                    Adicionar ao Carrinho
                </button>
            </div>
        `;
        produtosGrid.innerHTML += cardProduto;
    });
}

/** ADD PRODUTOS */

function adicionarAoCarrinho(codigoProduto) {
    if (!usuarioLogado) {
        alert("Você precisa estar logado para adicionar produtos ao carrinho!");
        return;
    }
    
    const produto = produtosDisponiveis.find(p => p.codigo === codigoProduto);
    const itemNoCarrinho = carrinho.find(item => item.codigo === codigoProduto);

    if (itemNoCarrinho) {
        itemNoCarrinho.quantidade++;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }

    atualizarCarrinho();
}


/** Remover item */

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

/**Atualiza o carrinho */

function atualizarCarrinho() {
    carrinhoLista.innerHTML = '';
    let total = 0;
    if (carrinho.length === 0) {
        carrinhoLista.innerHTML = '<li>Seu carrinho está vazio.</li>';
    } else {
        carrinho.forEach((item, index) => {
            total += item.preco * item.quantidade;
            const itemLista = `
                <li>
                    <span>${item.nome} (x${item.quantidade}) </span>
                    <span> | </span>
                    <span>
                      R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                        <span class="remover-item" onclick="removerDoCarrinho(${index})">🗑️</span>
                    </span>
                </li>
            `;
            carrinhoLista.innerHTML += itemLista;
        });
    }

    carrinhoTotal.textContent = total.toFixed(2).replace('.', ',');
}

/** Finalizar compra */

function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let resumoHTML = '<h3>Pedido Finalizado com Sucesso!</h3><ul>';
    let total = 0;

    carrinho.forEach(item => {
        resumoHTML += `<li>${item.nome} (x${item.quantidade}) - R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</li>`;
        total += item.preco * item.quantidade;
    });

    resumoHTML += `</ul><p><strong>Total: R$ ${total.toFixed(2).replace('.', ',')}</strong></p>`;

    conteudoLoja.style.display = 'none';
    resumoPedido.innerHTML = resumoHTML;
    resumoPedido.style.display = 'block';

    carrinho = [];
}

/** Busca */

function buscarProdutos() {
    const pesquisaInput = document.getElementById('pesquisa').value.toLowerCase(); // Pega o valor da pesquisa
    const produtosFiltrados = produtosDisponiveis.filter(produto => 
        produto.nome.toLowerCase().includes(pesquisaInput) // Filtra os produtos que contem o texto pesquisado
    );
    
    renderizarProdutosFiltrados(produtosFiltrados);
}

function renderizarProdutosFiltrados(produtos) {
    produtosGrid.innerHTML = ''; // Limpa a lista de produtos antes de renderizar os filtrados

    if (produtos.length === 0) {
        produtosGrid.innerHTML = '<p>Nenhum produto encontrado.</p>';
    } else {
        produtos.forEach(produto => {
            const cardProduto = `
                <div class="produto-card">
                    <img src="${produto.imagem}" alt="${produto.nome}">
                    <h3>${produto.nome}</h3>
                    <p>R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
                    <button onclick="adicionarAoCarrinho(${produto.codigo})">
                        Adicionar ao Carrinho
                    </button>
                </div>
            `;
            produtosGrid.innerHTML += cardProduto;
        });
    }
}
