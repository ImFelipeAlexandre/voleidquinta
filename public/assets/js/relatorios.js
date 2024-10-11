import { db } from './firebase-config.js';
import { loadHeader } from './components/header.js';

loadHeader();

let saldoInicial = 100; // saldo de 100 referente a setembro que o vini recebeu
let saldoAtual = saldoInicial;
let totalRecebimentosMes = 0;
let totalGastosMes = 0;
let totalEntradasMes = 0;
let totalMensalistas = 0;
let totalDiaristas = 0;

// preview
function carregarGastosERecebimentosPeriodo(dataInicio, dataFim) {
  const mensalistaList = document.getElementById('mensalistaList');
  const diaristaList = document.getElementById('diaristaList');
  const totalMensalistasEl = document.getElementById('totalMensalistas');
  const totalDiaristasEl = document.getElementById('totalDiaristas');

  mensalistaList.innerHTML = '';
  diaristaList.innerHTML = '';
  totalMensalistas = 0;
  totalDiaristas = 0;
  totalRecebimentosMes = 0;
  totalGastosMes = 0;
  totalEntradasMes = 0;
  saldoAtual = saldoInicial;

  // recebimentos
  db.collection('recebimentos').where("diaJogo", ">=", dataInicio).where("diaJogo", "<=", dataFim)
    .get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const recebimento = doc.data();
        if (recebimento.pessoaNome) {
          const listItemDiarista = document.createElement('li');
          listItemDiarista.textContent = `${recebimento.pessoaNome} - Valor: R$ ${recebimento.valor} - Data do Jogo: ${recebimento.diaJogo}`;
          diaristaList.appendChild(listItemDiarista);
          totalDiaristas++;
          totalRecebimentosMes += recebimento.valor;
          saldoAtual += recebimento.valor;
        }
      });

      totalDiaristasEl.textContent = totalDiaristas;
      document.getElementById('totalRecebimentosMes').textContent = `R$ ${totalRecebimentosMes.toFixed(2)}`;
      document.getElementById('saldoAtual').textContent = `R$ ${saldoAtual.toFixed(2)}`;
    });

  // mensalistas
  db.collection('pessoas').get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      const pessoa = doc.data();
      const listItem = document.createElement('li');
      if (pessoa.tipo === 'mensalista') {
        listItem.textContent = `${pessoa.nome} - ${pessoa.telefone}`;
        mensalistaList.appendChild(listItem);
        totalMensalistas++;
        totalRecebimentosMes += pessoa.valor || 0;
        saldoAtual += pessoa.valor || 0;
      }
    });

    totalMensalistasEl.textContent = totalMensalistas;
    document.getElementById('totalRecebimentosMes').textContent = `R$ ${totalRecebimentosMes.toFixed(2)}`;
    document.getElementById('saldoAtual').textContent = `R$ ${saldoAtual.toFixed(2)}`;
  });

  // load gastos
  db.collection('gastos_entradas').where("data", ">=", dataInicio).where("data", "<=", dataFim)
    .get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const registro = doc.data();
        if (registro.tipo === 'gasto') {
          totalGastosMes += registro.valor;
          saldoAtual -= registro.valor;
        } else if (registro.tipo === 'entrada') {
          totalEntradasMes += registro.valor;
          saldoAtual += registro.valor;
        }
      });

      document.getElementById('totalGastosMes').textContent = `R$ ${totalGastosMes.toFixed(2)}`;
      document.getElementById('totalEntradasMes').textContent = `R$ ${totalEntradasMes.toFixed(2)}`;
      document.getElementById('saldoAtual').textContent = `R$ ${saldoAtual.toFixed(2)}`;
    });
}

// resumo do mes atual
function carregarResumoFinanceiroDoMesAtual() {
  const dataAtual = new Date();
  const primeiroDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
  const ultimoDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);
  const dataInicio = primeiroDia.toISOString().split('T')[0];
  const dataFim = ultimoDia.toISOString().split('T')[0];

  carregarGastosERecebimentosPeriodo(dataInicio, dataFim);
}

// filtrar realtorio baseado no período definido
document.getElementById('periodoForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const dataInicio = document.getElementById('dataInicio').value;
  const dataFim = document.getElementById('dataFim').value;
  carregarGastosERecebimentosPeriodo(dataInicio, dataFim);
});

// data max hoje
const hoje = new Date().toISOString().split('T')[0];
document.getElementById('dataInicio').setAttribute('max', hoje);
document.getElementById('dataFim').setAttribute('max', hoje);

carregarResumoFinanceiroDoMesAtual();
