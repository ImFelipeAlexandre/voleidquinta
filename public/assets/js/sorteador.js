import { db } from './firebase-config.js';

let players = [];

function populatePlayerTable(names) {
    const playerTableBody = document.getElementById('playerTableBody');
    playerTableBody.innerHTML = '';

    let row;
    names.forEach((name, index) => {
        if (index % 5 === 0) {
            row = document.createElement('tr');
            playerTableBody.appendChild(row);
        }

        const cell = document.createElement('td');
        cell.innerHTML = `
            <label>
                <input type="checkbox" class="player-checkbox" value="${name}" checked>
                ${name}
            </label>
        `;
        row.appendChild(cell);
    });
}

function loadPlayers() {
    players = [];

    db.collection('pessoas').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            const pessoa = doc.data();
            players.push(pessoa.nome);
        });

        populatePlayerTable(players);
    });
}

document.getElementById('addPlayerBtn').addEventListener('click', function() {
    const newPlayerName = document.getElementById('newPlayerName').value.trim();

    if (newPlayerName !== '') {
        players.push(newPlayerName);
        populatePlayerTable(players);
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
    const totalPlayers = selectedPlayers.length;
    const totalTeams = Math.ceil(totalPlayers / teamSize);

    const teams = [];

    for (let i = 0; i < totalTeams; i++) {
        teams[i] = selectedPlayers.splice(0, teamSize);
    }

    if (selectedPlayers.length > 0) {
        selectedPlayers.forEach(player => {
            const randomTeam = Math.floor(Math.random() * totalTeams);
            teams[randomTeam].push(player);
        });
    }

    const teamsBody = document.getElementById('teamsBody');
    teamsBody.innerHTML = '';

    teams.forEach((team, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Time ${index + 1}</td>
            <td>${team.join(', ')}</td>
        `;
        teamsBody.appendChild(row);
    });

    openModal();
});

function openModal() {
    document.getElementById('teamsModal').style.display = 'block';
}

document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('teamsModal').style.display = 'none';
});

window.onclick = function(event) {
    const modal = document.getElementById('teamsModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

window.onload = loadPlayers;
