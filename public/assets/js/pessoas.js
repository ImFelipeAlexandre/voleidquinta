import { db } from './firebase-config.js';
import { loadHeader } from './components/header.js';

loadHeader();

// data de pagamento apenas para diarista
function exibirCampoData(tipoPagamento) {
  const dataPagamentoDiv = document.getElementById('dataPagamentoDiv');
  if (tipoPagamento === 'diarista') {
    dataPagamentoDiv.style.display = 'block';
  } else {
    dataPagamentoDiv.style.display = 'none';
  }
}

const telefoneInput = document.getElementById('telefone');
telefoneInput.addEventListener('input', function(e) {
  let telefone = e.target.value.replace(/\D/g, '');
  telefone = telefone.replace(/^(\d{2})(\d)/g, '($1) $2');
  telefone = telefone.replace(/(\d{5})(\d)/, '$1-$2');
  e.target.value = telefone;
});

function validarTelefone(telefone) {
  const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
  return regex.test(telefone);
}

// cadsatrar pessoas
document.getElementById('personForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;
  const tipo = document.getElementById('tipo').value;
  let dataPagamento = null;

  if (!validarTelefone(telefone)) {
    alert('Por favor, insira um número de telefone válido no formato (XX) XXXXX-XXXX');
    return;
  }

  if (tipo === 'diarista') {
    dataPagamento = document.getElementById('dataPagamento').value;
  }

  // save db
  db.collection('pessoas').add({ nome, telefone, tipo, dataPagamento })
  .then(() => {
    alert('Pessoa cadastrada!');
    carregarPessoas();
    document.getElementById('personForm').reset();
    exibirCampoData('mensalista');
  });
});

function carregarPessoas() {
  const peopleList = document.getElementById('peopleList');
  peopleList.innerHTML = '';
  db.collection('pessoas').get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      const pessoa = doc.data();
      const listItem = document.createElement('li');
      listItem.style.marginBottom = '5px';

      const pessoaInfo = document.createElement('div');
      pessoaInfo.className = 'pessoa-info';
      pessoaInfo.textContent = `${pessoa.nome} - ${pessoa.telefone}`;

      const actionsDiv = document.createElement('div');

      // registro de pgto para diaristas
      if (pessoa.tipo === 'diarista') {
        const pagarBtn = document.createElement('button');
        pagarBtn.textContent = 'Registrar Pagamento (Diarista)';
        pagarBtn.onclick = function () {
          registrarPagamento(pessoa.nome, pessoa.telefone);
        };
        actionsDiv.appendChild(pagarBtn);
      }

      const removerBtn = document.createElement('button');
      removerBtn.textContent = 'Remover';
      removerBtn.style.marginLeft = '10px';
      removerBtn.onclick = function () {
        removerPessoa(doc.id);
      };
      actionsDiv.appendChild(removerBtn);

      const tipoSelect = document.createElement('select');
      tipoSelect.innerHTML = `
        <option value="mensalista" ${pessoa.tipo === 'mensalista' ? 'selected' : ''}>Mensalista</option>
        <option value="diarista" ${pessoa.tipo === 'diarista' ? 'selected' : ''}>Diarista</option>
      `;
      tipoSelect.onchange = function () {
        atualizarTipoPagamento(doc.id, tipoSelect.value);
      };
      actionsDiv.appendChild(tipoSelect);

      listItem.appendChild(pessoaInfo);
      listItem.appendChild(actionsDiv);
      peopleList.appendChild(listItem);
    });
  });
}

// att tipo de pagamento por pessoa
function atualizarTipoPagamento(id, tipo) {
  db.collection('pessoas').doc(id).update({ tipo })
  .then(() => {
    alert('Tipo de pagamento atualizado.');
    carregarPessoas();
  });
}

// registrar pagamento de diarista
function registrarPagamento(nome, telefone) {
  let diaJogo = prompt('Informe o dia do jogo (formato: DD-MM-YYYY):');
  
  if (!diaJogo || !validarDataBrasileira(diaJogo)) {
    alert('Data do jogo inválida. Insira no formato DD-MM-YYYY.');
    return;
  }

  const diaJogoISO = converterParaISO(diaJogo);
  const dataPagamento = new Date().toISOString().split('T')[0];

  db.collection('recebimentos').add({
    pessoaNome: nome,
    pessoaTelefone: telefone,
    valor: 10.00,
    dataPagamento,
    diaJogo: diaJogoISO
  }).then(() => {
    alert('Pagamento registrado com sucesso!');
  });
}

function removerPessoa(id) {
  if (confirm('Tem certeza que deseja remover esta pessoa?')) {
    db.collection('pessoas').doc(id).delete().then(() => {
      alert('Pessoa removida com sucesso.');
      carregarPessoas();
    });
  }
}

function validarDataBrasileira(data) {
  const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
  return regex.test(data);
}

function converterParaISO(data) {
  const [dia, mes, ano] = data.split('-');
  return `${ano}-${mes}-${dia}`;
}

carregarPessoas();
