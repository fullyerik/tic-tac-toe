// Lade gespeicherte Statistiken aus dem localStorage oder verwende Standardwerte
const savedStats = JSON.parse(localStorage.getItem('demoUserStats'));
const demoUser = {
    stats: savedStats || {
        wins: 0,
        losses: 0,
        draws: 0
    }
};

// Funktion zum Aktualisieren der Statistikanzeige
function updateStatsDisplay(userData) {
    const stats = userData.stats;
    const total = stats.wins + stats.losses + stats.draws;

    const winsPercent = total > 0 ? ((stats.wins / total) * 100).toFixed(1) + '%' : '0%';
    const lossesPercent = total > 0 ? ((stats.losses / total) * 100).toFixed(1) + '%' : '0%';
    const drawsPercent = total > 0 ? ((stats.draws / total) * 100).toFixed(1) + '%' : '0%';

    const statsBody = document.getElementById('stats-body');
    statsBody.innerHTML = '';

    const winRow = document.createElement('tr');
    winRow.innerHTML = `<td>Siege</td><td>${stats.wins}</td><td>${winsPercent}</td>`;
    statsBody.appendChild(winRow);

    const lossRow = document.createElement('tr');
    lossRow.innerHTML = `<td>Niederlagen</td><td>${stats.losses}</td><td>${lossesPercent}</td>`;
    statsBody.appendChild(lossRow);

    const drawRow = document.createElement('tr');
    drawRow.innerHTML = `<td>Unentschieden</td><td>${stats.draws}</td><td>${drawsPercent}</td>`;
    statsBody.appendChild(drawRow);

    document.getElementById('table-total-games').textContent = total;
}

// Funktion zur Aktualisierung nach einem Spiel
function updateGameStats(result) {
    switch (result) {
        case 'win':
            demoUser.stats.wins++;
            break;
        case 'loss':
            demoUser.stats.losses++;
            break;
        case 'draw':
            demoUser.stats.draws++;
            break;
        default:
            console.error('Ungültiges Spielergebnis:', result);
            return;
    }

    // Statistiken aktualisieren & speichern
    updateStatsDisplay(demoUser);
    localStorage.setItem('demoUserStats', JSON.stringify(demoUser.stats));
}

// Initialisierung nach dem Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    updateStatsDisplay(demoUser);

    document.getElementById('reset-stats-button').addEventListener('click', () => {
        demoUser.stats = { wins: 0, losses: 0, draws: 0 };
        localStorage.removeItem('demoUserStats');
        updateStatsDisplay(demoUser);
        alert('Statistik wurde zurückgesetzt!');
    });

    const winButton = document.getElementById('win-button');
    if (winButton) {
        winButton.addEventListener('click', () => {
            updateGameStats('win');
        });
    }

    const lossButton = document.getElementById('loss-button');
    if (lossButton) {
        lossButton.addEventListener('click', () => {
            updateGameStats('loss');
        });
    }

    const drawButton = document.getElementById('draw-button');
    if (drawButton) {
        drawButton.addEventListener('click', () => {
            updateGameStats('draw');
        });
    }
});
