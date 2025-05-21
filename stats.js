// Statistiken laden
function loadStats() {
    try {
        const stats = localStorage.getItem('tictactoe_stats');
        return stats ? JSON.parse(stats) : { wins: 0, losses: 0, draws: 0 };
    } catch (error) {
        console.error('Fehler beim Laden der Statistiken:', error);
        return { wins: 0, losses: 0, draws: 0 };
    }
}

// Statistiken speichern
function saveStats(stats) {
    try {
        localStorage.setItem('tictactoe_stats', JSON.stringify(stats));
    } catch (error) {
        console.error('Fehler beim Speichern der Statistiken:', error);
    }
}

// Statistik nach Spielende aktualisieren
async function updateGameStats(result) {
    try {
        // Aktuelle Statistiken laden
        const stats = loadStats();
        
        // Statistiken aktualisieren
        switch (result) {
            case 'win':
                stats.wins++;
                break;
            case 'loss':
                stats.losses++;
                break;
            case 'draw':
                stats.draws++;
                break;
        }
        
        // Statistiken speichern
        saveStats(stats);
        
        // Anzeige aktualisieren
        await updateStatsDisplay();
        
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Statistik:', error);
    }
}

// Statistikanzeige aktualisieren
document.addEventListener('DOMContentLoaded', () => {
    const resetButton = document.getElementById('reset-stats-button');
    if (resetButton) {
        resetButton.addEventListener('click', async () => {
            try {
                const confirmed = confirm('Möchtest du wirklich deine Statistik zurücksetzen?');
                
                if (confirmed) {
                    // Statistik zurücksetzen und sofort speichern
                    const resetStats = { wins: 0, losses: 0, draws: 0 };
                    saveStats(resetStats);
                    
                    // Tabelle sofort aktualisieren
                    const statsBody = document.getElementById('stats-body');
                    statsBody.innerHTML = `
                        <tr>
                            <td>Siege</td>
                            <td>0</td>
                            <td>0%</td>
                        </tr>
                        <tr>
                            <td>Niederlagen</td>
                            <td>0</td>
                            <td>0%</td>
                        </tr>
                        <tr>
                            <td>Unentschieden</td>
                            <td>0</td>
                            <td>0%</td>
                        </tr>
                    `;
                    
                    alert('Statistik wurde erfolgreich zurückgesetzt!');
                }
            } catch (error) {
                console.error('Fehler beim Zurücksetzen der Statistik:', error);
                alert('Fehler beim Zurücksetzen der Statistik');
            }
        });
    }
});

// Bestehende updateStatsDisplay Funktion aktualisieren
async function updateStatsDisplay() {
    try {
        const stats = loadStats();
        const total = stats.wins + stats.losses + stats.draws;

        // Prozente berechnen
        const winsPercent = total > 0 ? ((stats.wins / total) * 100).toFixed(1) + '%' : '0%';
        const lossesPercent = total > 0 ? ((stats.losses / total) * 100).toFixed(1) + '%' : '0%';
        const drawsPercent = total > 0 ? ((stats.draws / total) * 100).toFixed(1) + '%' : '0%';

        const statsBody = document.getElementById('stats-body');
        if (!statsBody) return;

        statsBody.innerHTML = '';

        const rows = [
            { label: 'Siege', value: stats.wins, percent: winsPercent },
            { label: 'Niederlagen', value: stats.losses, percent: lossesPercent },
            { label: 'Unentschieden', value: stats.draws, percent: drawsPercent }
        ];

        rows.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.label}</td>
                <td>${row.value}</td>
                <td>${row.percent}</td>
            `;
            statsBody.appendChild(tr);
        });

    } catch (error) {
        console.error('Fehler beim Aktualisieren der Statistikanzeige:', error);
    }
}

// Auto-Update für Statistik
function startAutoUpdate() {
    setInterval(async () => {
        const stats = loadStats();
        const statsSection = document.getElementById('stats-section');
        
        // Nur aktualisieren wenn Statistik sichtbar ist
        if (statsSection && !statsSection.classList.contains('hidden')) {
            await updateStatsDisplay();
        }
    }, 1000); // Jede Sekunde aktualisieren
}

// Starte Auto-Update beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    startAutoUpdate();
});

// Initial laden
document.addEventListener('DOMContentLoaded', updateStatsDisplay);

// Funktion global verfügbar machen
window.updateGameStats = updateGameStats;

// Am Ende der Datei hinzufügen:
window.updateStatsDisplay = updateStatsDisplay;

// In stats.js
document.getElementById('stats-button')?.addEventListener('click', () => {
    document.getElementById('stats-section').classList.remove('hidden');
    updateStatsDisplay(); // Sofort aktualisieren beim Öffnen
});

document.getElementById('return-from-stats')?.addEventListener('click', () => {
    document.getElementById('stats-section').classList.add('hidden');
});