import { db } from './firebase-config.js';

function loadPlayers() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';

    db.collection('pessoas').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            const pessoa = doc.data();
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <label>
                    <input type="checkbox" class="player-checkbox" value="${pessoa.nome}" checked>
                    ${pessoa.nome}
                </label>
            `;
            playerList.appendChild(listItem);
        });
    });
}

document.getElementById('addPlayerBtn').addEventListener('click', function() {
    const newPlayerName = document.getElementById('newPlayerName').value;
    if (newPlayerName.trim() !== '') {
        const playerList = document.getElementById('playerList');
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <label>
                <input type="checkbox" class="player-checkbox" value="${newPlayerName}" checked>
                ${newPlayerName}
            </label>
        `;
        playerList.appendChild(listItem);
        document.getElementById('newPlayerName').value = ''; 
    }
});

document.getElementById('drawTeamsBtn').addEventListener('click', function() {
    const selectedPlayers = [];
    const checkboxes = document.querySelectorAll('.player-checkbox:checked');

    checkboxes.forEach(checkbox => {
        selectedPlayers.push(checkbox.value);
    });

    selectedPlayers.sort(() => Math.random() - 0.5);

    const teamSize = parseInt(document.getElementById('teamSize').value);

    const team1 = selectedPlayers.slice(0, teamSize);
    const team2 = selectedPlayers.slice(teamSize, teamSize * 2);

    const team1List = document.getElementById('team1List');
    const team2List = document.getElementById('team2List');

    team1List.innerHTML = '';
    team2List.innerHTML = '';

    team1.forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = player;
        team1List.appendChild(listItem);
    });

    team2.forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = player;
        team2List.appendChild(listItem);
    });

    if (selectedPlayers.length > teamSize * 2) {
        alert("Existem jogadores sobrando que não foram sorteados em um time!");
    }
});

window.onload = loadPlayers;
