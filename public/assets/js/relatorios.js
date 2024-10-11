import { db } from './firebase-config.js';
import { loadHeader } from './components/header.js';

loadHeader();

let saldoInicial = 100; 
let saldoAtual = saldoInicial;
let totalRecebimentosMes = 0;
let totalGastosMes = 0;
let totalEntradasMes = 0;
let totalMensalistas = 0;
let totalDiaristas = 0;

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

  console.log("Buscando recebimentos da coleção 'recebimentos'...");

  db.collection('recebimentos').where("diaJogo", ">=", dataInicio).where("diaJogo", "<=", dataFim)
    .get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const recebimento = doc.data();
        const valorRecebido = parseFloat(recebimento.valor) || 0;

        console.log(`Recebimento encontrado: Pessoa: ${recebimento.pessoaNome}, Valor: ${valorRecebido}, Data do Jogo: ${recebimento.diaJogo}`);

        totalRecebimentosMes += valorRecebido;
        saldoAtual += valorRecebido;

        if (recebimento.pessoaNome && recebimento.tipo === 'diarista') {
          const listItemDiarista = document.createElement('li');
          listItemDiarista.textContent = `${recebimento.pessoaNome} - Valor: R$ ${valorRecebido.toFixed(2)} - Data do Jogo: ${recebimento.diaJogo}`;
          diaristaList.appendChild(listItemDiarista);
          totalDiaristas++;
        }
      });

      totalDiaristasEl.textContent = totalDiaristas;
      document.getElementById('totalRecebimentosMes').textContent = `R$ ${totalRecebimentosMes.toFixed(2)}`;
      document.getElementById('saldoAtual').textContent = `R$ ${saldoAtual.toFixed(2)}`;
      
      console.log(`Total Recebimentos: R$ ${totalRecebimentosMes.toFixed(2)}, Saldo Atual: R$ ${saldoAtual.toFixed(2)}, Total Diaristas: ${totalDiaristas}`);
    }).catch(error => {
      console.error("Erro ao carregar recebimentos: ", error);
    });

  db.collection('pessoas').get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      const pessoa = doc.data();
      const valorPessoa = parseFloat(pessoa.valor) || 0;

      if (pessoa.tipo === 'mensalista') {
        const listItemMensalista = document.createElement('li');
        listItemMensalista.textContent = `${pessoa.nome} - ${pessoa.telefone}`;
        mensalistaList.appendChild(listItemMensalista);
        totalMensalistas++;
        totalRecebimentosMes += valorPessoa;
        saldoAtual += valorPessoa;
      }

      if (pessoa.tipo === 'diarista') {
        const listItemDiarista = document.createElement('li');
        listItemDiarista.textContent = `${pessoa.nome} - ${pessoa.telefone}`;
        diaristaList.appendChild(listItemDiarista);
        totalDiaristas++;
      }
    });

    totalMensalistasEl.textContent = totalMensalistas;
    totalDiaristasEl.textContent = totalDiaristas;
    document.getElementById('totalRecebimentosMes').textContent = `R$ ${totalRecebimentosMes.toFixed(2)}`;
    document.getElementById('saldoAtual').textContent = `R$ ${saldoAtual.toFixed(2)}`;

    console.log(`Total Mensalistas: ${totalMensalistas}, Total Diaristas: ${totalDiaristas}, Total Recebimentos Mes: R$ ${totalRecebimentosMes.toFixed(2)}, Saldo Atual: R$ ${saldoAtual.toFixed(2)}`);
  }).catch(error => {
    console.error("Erro ao carregar pessoas: ", error);
  });

  db.collection('gastos_entradas').where("data", ">=", new Date(dataInicio)).where("data", "<=", new Date(dataFim))
    .get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const registro = doc.data();
        const valorRegistro = parseFloat(registro.valor) || 0;

        if (registro.tipo === 'gasto') {
          totalGastosMes += valorRegistro;
          saldoAtual -= valorRegistro;
        } else if (registro.tipo === 'entrada') {
          totalEntradasMes += valorRegistro;
          saldoAtual += valorRegistro;
        }

        console.log(`Registro: ${registro.tipo}, Valor: ${valorRegistro}`);
      });

      document.getElementById('totalGastosMes').textContent = `R$ ${totalGastosMes.toFixed(2)}`;
      document.getElementById('totalEntradasMes').textContent = `R$ ${totalEntradasMes.toFixed(2)}`;
      document.getElementById('saldoAtual').textContent = `R$ ${saldoAtual.toFixed(2)}`;

      console.log(`Total Gastos: R$ ${totalGastosMes.toFixed(2)}, Total Entradas: R$ ${totalEntradasMes.toFixed(2)}, Saldo Atual: R$ ${saldoAtual.toFixed(2)}`);
    }).catch(error => {
      console.error("Erro ao carregar gastos e entradas: ", error);
    });
}

function carregarResumoFinanceiroDoMesAtual() {
  const dataAtual = new Date();
  const primeiroDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
  const ultimoDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);
  const dataInicio = primeiroDia.toISOString().split('T')[0];
  const dataFim = ultimoDia.toISOString().split('T')[0];

  carregarGastosERecebimentosPeriodo(dataInicio, dataFim);
}

document.getElementById('periodoForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const dataInicio = document.getElementById('dataInicio').value;
  const dataFim = document.getElementById('dataFim').value;
  carregarGastosERecebimentosPeriodo(dataInicio, dataFim);
});

const hoje = new Date().toISOString().split('T')[0];
document.getElementById('dataInicio').setAttribute('max', hoje);
document.getElementById('dataFim').setAttribute('max', hoje);

carregarResumoFinanceiroDoMesAtual();
