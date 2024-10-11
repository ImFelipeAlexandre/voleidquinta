import { db } from './firebase-config.js';
import { loadHeader } from './components/header.js';

loadHeader();

let saldoInicial = 100; 
let saldoAtual = saldoInicial;
let totalRecebimentosMes = 0;
let totalGastosMes = 0;

// preview
function carregarResumoFinanceiro() {
  const dataAtual = new Date();
  const primeiroDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
  const ultimoDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);
  const dataInicio = primeiroDia.toISOString().split('T')[0];
  const dataFim = ultimoDia.toISOString().split('T')[0];

  // Resetar os valores
  totalRecebimentosMes = 0;
  totalGastosMes = 0;
  saldoAtual = saldoInicial;

  // recebimentos
  db.collection('recebimentos').where("diaJogo", ">=", dataInicio).where("diaJogo", "<=", dataFim)
    .get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const recebimento = doc.data();
        totalRecebimentosMes += recebimento.valor;
        saldoAtual += recebimento.valor;
      });

      document.getElementById('recebimentosMes').textContent = `R$ ${totalRecebimentosMes.toFixed(2)}`;
      document.getElementById('saldoAtual').textContent = `R$ ${saldoAtual.toFixed(2)}`;
    });

  // gastos
  db.collection('gastos_entradas').where("data", ">=", dataInicio).where("data", "<=", dataFim)
    .get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const gasto = doc.data();
        if (gasto.tipo === 'gasto') {
          totalGastosMes += gasto.valor;
          saldoAtual -= gasto.valor;
        }
      });

      document.getElementById('gastosMes').textContent = `R$ ${totalGastosMes.toFixed(2)}`;
      document.getElementById('saldoAtual').textContent = `R$ ${saldoAtual.toFixed(2)}`;
    });
}

carregarResumoFinanceiro();
