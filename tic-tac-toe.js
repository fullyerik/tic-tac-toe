const app = {
    currentUser: null,
    currentDifficulty: 2, // Medium als Standard
    board: Array(9).fill(''),
    currentPlayer: 'X',
    gameActive: false,
    users: {},
    
    init: function() {
        // Lade gespeicherte Benutzer
        this.loadUsers();
        
        // Event-Listener für Login/Register
        document.getElementById('login-button').addEventListener('click', () => this.login());
        document.getElementById('register-button').addEventListener('click', () => this.register());
        
        // Event-Listener für Hauptmenü
        document.getElementById('new-game-button').addEventListener('click', () => this.showSection('game-section'));
        document.getElementById('difficulty-button').addEventListener('click', () => this.showSection('difficulty-section'));
        document.getElementById('stats-button').addEventListener('click', () => this.showStats());
        document.getElementById('logout-button').addEventListener('click', () => this.logout());
        
        // Event-Listener für Schwierigkeitsgrad
        document.querySelectorAll('.difficulty-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.setDifficulty(parseInt(e.currentTarget.getAttribute('data-difficulty')));
            });
        });
        
        // Event-Listener für Zurück-Buttons
        document.getElementById('return-from-difficulty').addEventListener('click', () => this.showSection('main-section'));
        document.getElementById('return-from-game').addEventListener('click', () => this.showSection('main-section'));
        document.getElementById('return-from-stats').addEventListener('click', () => this.showSection('main-section'));
        
        // Event-Listener für Spielfeld
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                if (this.gameActive) {
                    const index = parseInt(e.target.getAttribute('data-index'));
                    this.makeMove(index);
                }
            });
        });
        
        // Neues Spiel Button Event-Listener
        document.getElementById('play-again-button').addEventListener('click', () => this.startGame());
        
        // Statistik zurücksetzen Button Event-Listener
        document.getElementById('reset-stats-button').addEventListener('click', () => this.resetStats());
        
        // Markiere aktuelle Schwierigkeit
        this.updateDifficultyUI();
    },
    
    loadUsers: function() {
        const savedUsers = localStorage.getItem('ticTacToeUsers');
        if (savedUsers) {
            this.users = JSON.parse(savedUsers);
        }
    },
    
    saveUsers: function() {
        localStorage.setItem('ticTacToeUsers', JSON.stringify(this.users));
    },
    
    login: function() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        if (this.users[username] && this.users[username].password === password) {
            this.currentUser = username;
            this.showMessage(`Willkommen zurück, ${username}!`, 'success');
            this.showSection('main-section');
        } else {
            this.showMessage('Ungültiger Benutzername oder Passwort!', 'error');
        }
    },
    
    register: function() {
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        
        if (!username || !password) {
            this.showMessage('Bitte gib Benutzername und Passwort ein!', 'error');
            return;
        }
        
        if (this.users[username]) {
            this.showMessage('Benutzername existiert bereits!', 'error');
            return;
        }
        
        this.users[username] = {
            password: password,
            stats: {
                wins: 0,
                losses: 0,
                draws: 0
            }
        };
        
        this.saveUsers();
        this.showMessage(`Benutzer ${username} wurde erfolgreich registriert!`, 'success');
        
        // Login-Felder leeren
        document.getElementById('register-username').value = '';
        document.getElementById('register-password').value = '';
    },
    
    logout: function() {
        this.currentUser = null;
        this.showSection('login-section');
        
        // Login-Felder leeren
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
    },
    
    showMessage: function(message, type) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = message;
        messageElement.className = `message message-${type}`;
        
        // Nachricht nach 3 Sekunden ausblenden
        setTimeout(() => {
            messageElement.className = 'hidden message';
        }, 3000);
    },
    
    showSection: function(sectionId) {
        // Alle Bereiche ausblenden
        const sections = ['login-section', 'main-section', 'difficulty-section', 'game-section', 'stats-section'];
        sections.forEach(section => {
            document.getElementById(section).classList.add('hidden');
        });
        
        // Gewählten Bereich einblenden
        document.getElementById(sectionId).classList.remove('hidden');
        
        // Wenn Spielbereich angezeigt wird, Spiel starten
        if (sectionId === 'game-section') {
            this.startGame();
        }
    },
    
    updateDifficultyUI: function() {
        // Alle Optionen zurücksetzen
        document.querySelectorAll('.difficulty-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Aktuelle Option hervorheben
        const selectedOption = document.querySelector(`.difficulty-option[data-difficulty="${this.currentDifficulty}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    },
    
    setDifficulty: function(level) {
        this.currentDifficulty = level;
        this.updateDifficultyUI();
    },
    
    startGame: function() {
        // Spielfeld zurücksetzen
        this.board = Array(9).fill('');
        this.updateBoardUI();
        
        // Konfetti entfernen
        document.querySelectorAll('.confetti').forEach(confetti => {
            confetti.remove();
        });
        
        // Wer beginnt?
        this.currentPlayer = Math.random() < 0.5 ? 'X' : 'O';
        this.gameActive = true;
        
        // Statusanzeige aktualisieren
        this.updateStatus();
        
        // "Neues Spiel" Button ausblenden
        document.getElementById('play-again-button').classList.add('hidden');
        
        // Wenn Computer beginnt
        if (this.currentPlayer === 'O') {
            setTimeout(() => this.computerMove(), 1000);
        }
    },
    
    updateBoardUI: function() {
        document.querySelectorAll('.cell').forEach((cell, index) => {
            cell.textContent = this.board[index];
            cell.className = 'cell';
            
            if (this.board[index] === 'X') {
                cell.classList.add('player-x');
            } else if (this.board[index] === 'O') {
                cell.classList.add('player-o');
            }
        });
    },
    
    updateStatus: function() {
        const status = document.getElementById('game-status');
        
        if (!this.gameActive) {
            return;
        }
        
        if (this.currentPlayer === 'X') {
            status.textContent = 'Du bist am Zug (X)';
        } else {
            status.textContent = 'Computer denkt nach (O)...';
        }
    },
    
    makeMove: function(index) {
        // Prüfen, ob Zug möglich
        if (this.board[index] !== '' || !this.gameActive || this.currentPlayer !== 'X') {
            return;
        }
        
        // Spielzug ausführen
        this.board[index] = 'X';
        this.updateBoardUI();
        
        // Prüfen, ob Spiel zu Ende
        if (this.checkWinner()) {
            return;
        }
        
        // Spieler wechseln
        this.currentPlayer = 'O';
        this.updateStatus();
        
        // Computer-Zug nach kurzer Verzögerung
        setTimeout(() => this.computerMove(), 1000);
    },
    
    computerMove: function() {
        if (!this.gameActive) {
            return;
        }
        
        let move;
        
        // Je nach Schwierigkeitsgrad anderen Algorithmus verwenden
        switch (this.currentDifficulty) {
            case 1: // Easy - Zufälliger Zug
                move = this.getRandomMove();
                break;
            case 2: // Medium - Etwas Strategie
                move = Math.random() < 0.6 ? this.getBestMove(2) : this.getRandomMove();
                break;
            case 3: // Hard - Gute Strategie
                move = Math.random() < 0.8 ? this.getBestMove(4) : this.getRandomMove();
                break;
            case 4: // Impossible - Unbesiegbar
                move = this.getBestMove(9);
                break;
            default:
                move = this.getRandomMove();
        }
        
        // Spielzug ausführen
        this.board[move] = 'O';
        this.updateBoardUI();
        
        // Prüfen, ob Spiel zu Ende
        if (this.checkWinner()) {
            return;
        }
        
        // Spieler wechseln
        this.currentPlayer = 'X';
        this.updateStatus();
    },
    
    getRandomMove: function() {
        // Freie Felder finden
        const availableMoves = [];
        this.board.forEach((cell, index) => {
            if (cell === '') {
                availableMoves.push(index);
            }
        });
        
        // Zufälliges Feld auswählen
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    },
    
    getBestMove: function(depth) {
        const result = this.minimax(this.board, depth, true);
        return result.index;
    },
    
    minimax: function(board, depth, isMaximizing, alpha = -Infinity, beta = Infinity) {
        // Verfügbare Züge
        const availableMoves = [];
        board.forEach((cell, index) => {
            if (cell === '') {
                availableMoves.push(index);
            }
        });
        
        // Prüfen, ob Spiel zu Ende
        if (this.checkWinCondition(board, 'X')) {
            return { score: -10 };
        } else if (this.checkWinCondition(board, 'O')) {
            return { score: 10 };
        } else if (availableMoves.length === 0) {
            return { score: 0 };
        }
        
        // Abbruch bei maximaler Tiefe
        if (depth === 0) {
            return { score: 0 };
        }
        
        // Zufällige Elemente für niedrigere Schwierigkeitsgrade
        if (this.currentDifficulty < 4 && Math.random() < 0.3 * (4 - this.currentDifficulty)) {
            return { 
                score: Math.random() * 2 - 1,
                index: availableMoves[Math.floor(Math.random() * availableMoves.length)]
            };
        }
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            let bestMove = null;
            
            for (let i = 0; i < availableMoves.length; i++) {
                const move = availableMoves[i];
                
                // Zug simulieren
                board[move] = 'O';
                
                // Rekursiver Aufruf
                const result = this.minimax(board, depth - 1, false, alpha, beta);
                
                // Zug rückgängig machen
                board[move] = '';
                
                // Besten Zug speichern
                if (result.score > bestScore) {
                    bestScore = result.score;
                    bestMove = move;
                }
                
                // Alpha-Beta Pruning
                alpha = Math.max(alpha, bestScore);
                if (beta <= alpha) {
                    break;
                }
            }
            
            return { score: bestScore, index: bestMove };
        } else {
            let bestScore = Infinity;
            let bestMove = null;
            
            for (let i = 0; i < availableMoves.length; i++) {
                const move = availableMoves[i];
                
                // Zug simulieren
                board[move] = 'X';
                
                // Rekursiver Aufruf
                const result = this.minimax(board, depth - 1, true, alpha, beta);
                
                // Zug rückgängig machen
                board[move] = '';
                
                // Besten Zug speichern
                if (result.score < bestScore) {
                    bestScore = result.score;
                    bestMove = move;
                }
                
                // Alpha-Beta Pruning
                beta = Math.min(beta, bestScore);
                if (beta <= alpha) {
                    break;
                }
            }
            
            return { score: bestScore, index: bestMove };
        }
    },
    
    checkWinner: function() {
        const status = document.getElementById('game-status');
        
        // Prüfen, ob ein Spieler gewonnen hat
        if (this.checkWinCondition(this.board, 'X')) {
            status.textContent = 'Du hast gewonnen!';
            status.classList.add('win-message');
            this.gameActive = false;
            this.updateStats('win');
            this.highlightWinningCells('X');
            this.createConfetti();
            this.showPlayAgainButton();
            return true;
        } else if (this.checkWinCondition(this.board, 'O')) {
            status.textContent = 'Der Computer hat gewonnen!';
            this.gameActive = false;
            this.updateStats('loss');
            this.highlightWinningCells('O');
            this.showPlayAgainButton();
            return true;
        }
        
        // Prüfen, ob Unentschieden
        if (!this.board.includes('')) {
            status.textContent = 'Unentschieden!';
            this.gameActive = false;
            this.updateStats('draw');
            this.showPlayAgainButton();
            return true;
        }
        
        return false;
    },
    
    showPlayAgainButton: function() {
        // "Neues Spiel" Button einblenden
        const playAgainButton = document.getElementById('play-again-button');
        playAgainButton.classList.remove('hidden');
    },
    
    checkWinCondition: function(board, player) {
        // Gewinnkombinationen
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Zeilen
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Spalten
            [0, 4, 8], [2, 4, 6]             // Diagonalen
        ];
        
        // Prüfen, ob eine Gewinnkombination erfüllt ist
        for (let i = 0; i < winConditions.length; i++) {
            const [a, b, c] = winConditions[i];
            if (board[a] === player && board[b] === player && board[c] === player) {
                this.winningCombination = [a, b, c];
                return true;
            }
        }
        
        return false;
    },
    
    highlightWinningCells: function(player) {
        if (!this.winningCombination) return;
        
        // Gewinnzellen hervorheben
        this.winningCombination.forEach(index => {
            const cell = document.querySelector(`.cell[data-index="${index}"]`);
            cell.classList.add('win-cell');
        });
    },
    
    createConfetti: function() {
        const container = document.getElementById('main-container');
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
        const confettiCount = 150;
        
        // Konfetti erstellen
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Zufällige Eigenschaften
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 10 + 5;
            const leftPosition = Math.random() * 100;
            const delay = Math.random() * 2;
            const duration = Math.random() * 3 + 3; // 3-6 Sekunden
            
            // Konfetti-Stil setzen
            confetti.style.backgroundColor = color;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.left = `${leftPosition}%`;
            confetti.style.animationDelay = `${delay}s`;
            confetti.style.animationDuration = `${duration}s`;
            
            // Zufällige Form (Kreis, Quadrat oder Rechteck)
            const shape = Math.floor(Math.random() * 3);
            if (shape === 0) {
                confetti.style.borderRadius = '50%';
            } else if (shape === 1) {
                confetti.style.width = `${size * 0.6}px`;
                confetti.style.height = `${size * 1.2}px`;
                confetti.style.transform = `rotate(${Math.random() * 90}deg)`;
            }
            
            // Zum Container hinzufügen
            container.appendChild(confetti);
            
            // Nach Animation entfernen
            setTimeout(() => {
                confetti.remove();
            }, duration * 1000 + delay * 1000);
        }
    },
    
    updateStats: function(result) {
        if (!this.currentUser) {
            return;
        }
        
        // Statistik aktualisieren
        switch (result) {
            case 'win':
                this.users[this.currentUser].stats.wins++;
                break;
            case 'loss':
                this.users[this.currentUser].stats.losses++;
                break;
            case 'draw':
                this.users[this.currentUser].stats.draws++;
                break;
        }
        
        // Speichern
        this.saveUsers();
    },
    
    resetStats: function() {
        if (!this.currentUser) {
            return;
        }
        
        // Bestätigung vom Benutzer einholen
        if (confirm('Möchtest du wirklich deine gesamte Spielstatistik zurücksetzen?')) {
            // Statistik zurücksetzen
            this.users[this.currentUser].stats = {
                wins: 0,
                losses: 0,
                draws: 0
            };
            
            // Speichern
            this.saveUsers();
            
            // Statistik aktualisieren
            this.showStats();
            
            // Erfolgsmeldung anzeigen
            this.showMessage('Statistik wurde erfolgreich zurückgesetzt!', 'success');
        }
    },
    
    showStats: function() {
        if (!this.currentUser) {
            return;
        }
        
        // Statistikbereich einblenden
        this.showSection('stats-section');
        
        // Statistiktabelle aktualisieren
        const stats = this.users[this.currentUser].stats;
        const statsBody = document.getElementById('stats-body');
        const total = stats.wins + stats.losses + stats.draws;
        
        statsBody.innerHTML = `
            <tr>
                <td>Siege</td>
                <td>${stats.wins}</td>
            </tr>
            <tr>
                <td>Niederlagen</td>
                <td>${stats.losses}</td>
            </tr>
            <tr>
                <td>Unentschieden</td>
                <td>${stats.draws}</td>
            </tr>
            <tr>
                <td><strong>Gesamt</strong></td>
                <td><strong>${total}</strong></td>
            </tr>
        `;
        
        // Gewinnrate berechnen
        const winrateElement = document.getElementById('winrate');
        if (stats.wins + stats.losses > 0) {
            const winrate = (stats.wins / (stats.wins + stats.losses) * 100).toFixed(2);
            winrateElement.textContent = `Gewinnrate: ${winrate}%`;
        } else {
            winrateElement.textContent = 'Noch keine Spiele gespielt.';
        }
    }
};

// App initialisieren
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
