import { db } from './firebase-config.js';
import { loadHeader } from './components/header.js';

loadHeader();

let saldoInicial = 100; 
let saldoAtual = saldoInicial;
let totalRecebimentosMes = 0;
let totalGastosMes = 0;
let totalEntradasMes = 0;

// Função para carregar o resumo financeiro
function carregarResumoFinanceiro() {
  const dataAtual = new Date();
  const primeiroDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
  const ultimoDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);
  const dataInicio = primeiroDia.toISOString().split('T')[0];
  const dataFim = ultimoDia.toISOString().split('T')[0];

  // Resetar os valores
  totalRecebimentosMes = 0;
  totalGastosMes = 0;
  totalEntradasMes = 0;
  saldoAtual = saldoInicial;

  console.log("Buscando recebimentos...");

  // Buscando os recebimentos
  db.collection('recebimentos').where("diaJogo", ">=", dataInicio).where("diaJogo", "<=", dataFim)
    .get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const recebimento = doc.data();
        const valorRecebido = parseFloat(recebimento.valor) || 0;
        totalRecebimentosMes += valorRecebido;
        saldoAtual += valorRecebido;

        console.log(`Recebimento: ${valorRecebido}, Saldo Atual: ${saldoAtual}`);
      });

      const recebimentosMesEl = document.getElementById('recebimentosMes');
      const saldoAtualEl = document.getElementById('saldoAtual');

      if (recebimentosMesEl) {
        recebimentosMesEl.textContent = `R$ ${totalRecebimentosMes.toFixed(2)}`;
      } else {
        console.error("Elemento 'recebimentosMes' não encontrado no DOM.");
      }

      if (saldoAtualEl) {
        saldoAtualEl.textContent = `R$ ${saldoAtual.toFixed(2)}`;
      } else {
        console.error("Elemento 'saldoAtual' não encontrado no DOM.");
      }
    }).catch(error => {
      console.error("Erro ao buscar recebimentos: ", error);
    });

  console.log("Buscando gastos e entradas...");

  // Buscando os gastos e entradas
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

        console.log(`Registro: ${registro.tipo} - Valor: ${valor}, Saldo Atual: ${saldoAtual}`);
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
