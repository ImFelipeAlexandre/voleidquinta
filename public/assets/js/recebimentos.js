import { db } from './firebase-config.js';
import { loadHeader } from './components/header.js';

loadHeader();

function carregarPessoas() {
  const pessoaSelect = document.getElementById('pessoa');
  pessoaSelect.innerHTML = '';
  db.collection('pessoas').get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      const pessoa = doc.data();
      const option = document.createElement('option');
      option.value = pessoa.nome;
      option.textContent = `${pessoa.nome} - ${pessoa.telefone}`;
      pessoaSelect.appendChild(option);
    });
  });
}

// entradas registro
document.getElementById('recebimentoForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const pessoaNome = document.getElementById('pessoa').value;
  const valor = parseFloat(document.getElementById('valor').value);
  const dataPagamento = document.getElementById('dataPagamento').value;
  const diaJogo = document.getElementById('diaJogo').value;

  db.collection('recebimentos').add({
    pessoaNome,
    valor,
    dataPagamento,
    diaJogo
  }).then(() => {
    alert('Recebimento cadastrado com sucesso!');
    carregarRecebimentos();
    document.getElementById('recebimentoForm').reset();
  });
});

// listar recebimentos
function carregarRecebimentos() {
  const recebimentoList = document.getElementById('recebimentoList');
  recebimentoList.innerHTML = '';
  db.collection('recebimentos').get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      const recebimento = doc.data();
      const listItem = document.createElement('li');
      listItem.textContent = `Pessoa: ${recebimento.pessoaNome}, Valor: R$${recebimento.valor}, Pagamento: ${recebimento.dataPagamento}, Jogo: ${recebimento.diaJogo}`;
      recebimentoList.appendChild(listItem);
    });
  });
}

carregarPessoas();
carregarRecebimentos();
