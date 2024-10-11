import { db } from './firebase-config.js';
import { loadHeader } from './components/header.js';

loadHeader();

let saldoInicial = 100; 
let saldoAtual = saldoInicial;
let totalRecebimentosMes = 0;
let totalGastosMes = 0;
let totalEntradasMes = 0;

// preview
function carregarResumoFinanceiro() {
  const dataAtual = new Date();
  const primeiroDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
  const ultimoDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);
  const dataInicio = primeiroDia.toISOString().split('T')[0];
  const dataFim = ultimoDia.toISOString().split('T')[0];

  totalRecebimentosMes = 0;
  totalGastosMes = 0;
  totalEntradasMes = 0;
  saldoAtual = saldoInicial;

  // recebimentos
  db.collection('recebimentos').where("diaJogo", ">=", dataInicio).where("diaJogo", "<=", dataFim)
    .get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const recebimento = doc.data();
        totalRecebimentosMes += recebimento.valor;
        saldoAtual += recebimento.valor;
      });

      const recebimentosMesEl = document.getElementById('recebimentosMes');
      const saldoAtualEl = document.getElementById('saldoAtual');

      if (recebimentosMesEl) {
        recebimentosMesEl.textContent = `R$ ${totalRecebimentosMes.toFixed(2)}`;
      }

      if (saldoAtualEl) {
        saldoAtualEl.textContent = `R$ ${saldoAtual.toFixed(2)}`;
      } else {
        console.error("Elemento 'saldoAtual' não encontrado no DOM.");
      }
    });

  // gastos e entradas
  db.collection('gastos_entradas').where("data", ">=", new Date(dataInicio)).where("data", "<=", new Date(dataFim))
    .get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const registro = doc.data();
        const valor = parseFloat(registro.valor) || 0;

        if (registro.tipo === 'gasto') {
          totalGastosMes += valor;
          saldoAtual -= valor;
        } else if (registro.tipo === 'entrada') {
          totalEntradasMes += valor;
          saldoAtual += valor;
        }
      });

      const totalGastosMesEl = document.getElementById('totalGastosMes');
      const totalEntradasMesEl = document.getElementById('totalEntradasMes');
      const saldoAtualEl = document.getElementById('saldoAtual');

      if (totalGastosMesEl) {
        totalGastosMesEl.textContent = `R$ ${totalGastosMes.toFixed(2)}`;
      } else {
        console.error("Elemento 'totalGastosMes' não encontrado no DOM.");
      }

      if (totalEntradasMesEl) {
        totalEntradasMesEl.textContent = `R$ ${totalEntradasMes.toFixed(2)}`;
      } else {
        console.error("Elemento 'totalEntradasMes' não encontrado no DOM.");
      }

      if (saldoAtualEl) {
        saldoAtualEl.textContent = `R$ ${saldoAtual.toFixed(2)}`;
      } else {
        console.error("Elemento 'saldoAtual' não encontrado no DOM.");
      }

      console.log(`Total Gastos: ${totalGastosMes}, Total Entradas: ${totalEntradasMes}, Saldo Atual: ${saldoAtual}`);
    }).catch(error => {
      console.error("Erro ao buscar gastos e entradas: ", error);
    });
}

carregarResumoFinanceiro();