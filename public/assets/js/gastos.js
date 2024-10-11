import { db } from './firebase-config.js';
import { loadHeader } from './components/header.js';

loadHeader();

// cadastrar gastos
document.getElementById('expenseForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const descricao = document.getElementById('descricao').value;
  const valor = parseFloat(document.getElementById('valor').value);
  const tipo = document.getElementById('tipo').value;

  db.collection('gastos_entradas').add({ descricao, valor, tipo, data: new Date() })
    .then(() => {
      alert('Registro adicionado!');
      carregarGastos();
      document.getElementById('expenseForm').reset();
    });
});

// lista de gastos
function carregarGastos() {
  const expenseList = document.getElementById('expenseList');
  expenseList.innerHTML = '';
  db.collection('gastos_entradas').get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      const gasto = doc.data();
      const listItem = document.createElement('li');
      listItem.innerHTML = `${gasto.descricao} - R$ ${gasto.valor} - ${gasto.tipo} <button onclick="removerGasto('${doc.id}')">Remover</button>`;
      expenseList.appendChild(listItem);
    });
  });
}

// remover gastos 
function removerGasto(id) {
  db.collection('gastos_entradas').doc(id).delete().then(() => {
    alert('Registro removido!');
    carregarGastos();
  });
}

carregarGastos();
