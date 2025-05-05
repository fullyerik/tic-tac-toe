// Globale Variablen für die Benutzerverwaltung
let currentUser = null;
let users = {};

// Prüfen, ob bereits Benutzerdaten im Local Storage vorhanden sind
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    setupEventListeners();
    
    // Prüfen, ob ein Benutzer im Local Storage gespeichert ist
    const storedUser = localStorage.getItem('tictactoe_current_user');
    if (storedUser) {
        currentUser = storedUser;
        updateUsernameDisplay();
        hideAllSections();
        document.getElementById('main-section').classList.remove('hidden');
    }
});

// Benutzer aus dem Local Storage laden
function loadUsers() {
    const storedUsers = localStorage.getItem('tictactoe_users');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    }
}

// Benutzer im Local Storage speichern
function saveUsers() {
    localStorage.setItem('tictactoe_users', JSON.stringify(users));
    // Aktuellen Benutzer auch speichern
    if (currentUser) {
        localStorage.setItem('tictactoe_current_user', currentUser);
    } else {
        localStorage.removeItem('tictactoe_current_user');
    }
}

// Event-Listener für die Account-Verwaltung einrichten
function setupEventListeners() {
    // Login- und Registrierungsbuttons
    document.getElementById('login-button').addEventListener('click', loginUser);
    document.getElementById('register-button').addEventListener('click', registerUser);
    document.getElementById('logout-button').addEventListener('click', logoutUser);
    
    // Account-Button zum Öffnen der Account-Einstellungen
    document.getElementById('account-button').addEventListener('click', showAccountSettings);
    
    // Überprüfen, ob ein Account-Einstellungen-Bereich bereits existiert
    // Falls nicht, erstellen wir diesen dynamisch
    createAccountSection();
}

// Erstellen des Account-Einstellungen-Bereichs
function createAccountSection() {
    if (!document.getElementById('account-section')) {
        // Container erstellen
        const accountSection = document.createElement('div');
        accountSection.id = 'account-section';
        accountSection.className = 'hidden';
        
        // Inhalt für Account-Bereich
        accountSection.innerHTML = `
            <h2>Account Einstellungen</h2>
            
            <div id="account-message" class="message hidden"></div>
            
            <div class="account-form">
                <h3>Benutzername ändern</h3>
                <p>Aktueller Benutzername: <span id="current-account-username" class="highlight-username"></span></p>
                <input type="text" id="new-username" placeholder="Neuer Benutzername">
                <button id="change-username-button">Benutzername ändern</button>
            </div>
            
            <button id="return-from-account">Zurück zum Menü</button>
        `;
        
        // Abschnitt zum Container hinzufügen
        document.getElementById('main-container').appendChild(accountSection);
        
        // Event-Listener für die neuen Buttons einrichten
        document.getElementById('change-username-button').addEventListener('click', changeUsername);
        // Der folgende Code-Abschnitt war fehlerhaft und wurde korrigiert
        document.getElementById('return-from-account').addEventListener('click', function() {
            hideAllSections();
            document.getElementById('main-section').classList.remove('hidden');
        });
    }
}

// Benutzer einloggen
function loginUser() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!username || !password) {
        showMessage('Bitte gib Benutzername und Passwort ein.', 'error');
        return;
    }
    
    if (users[username] && users[username].password === password) {
        currentUser = username;
        hideAllSections();
        document.getElementById('main-section').classList.remove('hidden');
        showMessage('Erfolgreich eingeloggt!', 'success');
        
        // Benutzernamen oben links anzeigen
        updateUsernameDisplay();
        
        // Aktuellen Benutzer im Local Storage speichern
        saveUsers();
        
        // Formularfelder zurücksetzen
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
    } else {
        showMessage('Falscher Benutzername oder Passwort.', 'error');
    }
}

// Neuen Benutzer registrieren
function registerUser() {
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    
    if (!username || !password) {
        showMessage('Bitte gib Benutzername und Passwort ein.', 'error');
        return;
    }
    
    if (username in users) {
        showMessage('Dieser Benutzername ist bereits vergeben.', 'error');
        return;
    }
    
    // Neuen Benutzer erstellen und speichern
    users[username] = {
        password: password,
        stats: {
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            draws: 0
        }
    };
    
    saveUsers();
    showMessage('Registrierung erfolgreich! Du kannst dich jetzt einloggen.', 'success');
    
    // Formularfelder zurücksetzen
    document.getElementById('register-username').value = '';
    document.getElementById('register-password').value = '';
}

// Benutzer ausloggen
function logoutUser() {
    currentUser = null;
    hideAllSections();
    document.getElementById('login-section').classList.remove('hidden');
    
    // Benutzernamenanzeige ausblenden
    document.getElementById('username-display').classList.add('hidden');
    
    // Aktuellen Benutzer aus Local Storage entfernen
    localStorage.removeItem('tictactoe_current_user');
    
    showMessage('Erfolgreich ausgeloggt.', 'success');
}

// Benutzernamen ändern
function changeUsername() {
    const newUsername = document.getElementById('new-username').value.trim();
    
    if (!newUsername) {
        showAccountMessage('Bitte gib einen neuen Benutzernamen ein.', 'error');
        return;
    }
    
    if (newUsername in users && newUsername !== currentUser) {
        showAccountMessage('Dieser Benutzername ist bereits vergeben.', 'error');
        return;
    }
    
    // Speichere die Benutzerdaten
    const userData = users[currentUser];
    
    // Lösche den alten Benutzernamen und speichere unter dem neuen
    delete users[currentUser];
    users[newUsername] = userData;
    
    // Aktualisiere den aktuellen Benutzer
    currentUser = newUsername;
    
    // Benutzernamenanzeige aktualisieren
    updateUsernameDisplay();
    
    // Aktuellen Benutzernamen im Account-Bereich aktualisieren
    updateAccountUsername();
    
    // Speichere die Änderungen
    saveUsers();
    
    // Formularfeld zurücksetzen
    document.getElementById('new-username').value = '';
    
    showAccountMessage('Benutzername erfolgreich geändert!', 'success');
}

// Account-Einstellungen anzeigen
function showAccountSettings() {
    hideAllSections();
    document.getElementById('account-section').classList.remove('hidden');
    
    // Aktuellen Benutzernamen im Account-Bereich anzeigen
    updateAccountUsername();
}

// Aktualisiere den angezeigten Benutzernamen im Account-Bereich
function updateAccountUsername() {
    const accountUsernameDisplay = document.getElementById('current-account-username');
    if (accountUsernameDisplay) {
        accountUsernameDisplay.textContent = currentUser;
    }
}

// Hilfsfunktion zum Ausblenden aller Abschnitte
function hideAllSections() {
    const sections = ['login-section', 'main-section', 'difficulty-section', 'game-section', 'stats-section', 'account-section'];
    
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.classList.add('hidden');
        }
    });
}

// Funktion zur Anzeige von Nachrichten im Login-Bereich
function showMessage(text, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = text;
    messageElement.className = `message ${type}`;
    messageElement.classList.remove('hidden');
    
    // Nachricht nach einigen Sekunden ausblenden
    setTimeout(() => {
        messageElement.classList.add('hidden');
    }, 3000);
}

// Funktion zur Anzeige von Nachrichten im Account-Bereich
function showAccountMessage(text, type) {
    const messageElement = document.getElementById('account-message');
    messageElement.textContent = text;
    messageElement.className = `message ${type}`;
    messageElement.classList.remove('hidden');
    
    // Nachricht nach einigen Sekunden ausblenden
    setTimeout(() => {
        messageElement.classList.add('hidden');
    }, 3000);
}

// Funktion zum Aktualisieren der Benutzernamenanzeige
function updateUsernameDisplay() {
    const usernameDisplay = document.getElementById('username-display');
    const usernameText = document.getElementById('current-username-display');
    
    if (currentUser) {
        usernameText.textContent = currentUser;
        usernameDisplay.classList.remove('hidden');
    } else {
        usernameDisplay.classList.add('hidden');
    }
}

// Funktion zum Abrufen der Statistikdaten des aktuellen Benutzers
// Diese Funktion kann von der tic-tac-toe.js verwendet werden
function getCurrentUserStats() {
    if (currentUser && users[currentUser]) {
        return users[currentUser].stats;
    }
    return null;
}

// Funktion zum Aktualisieren der Statistikdaten des aktuellen Benutzers
// Diese Funktion kann von der tic-tac-toe.js verwendet werden
function updateUserStats(statsUpdate) {
    if (currentUser && users[currentUser]) {
        Object.assign(users[currentUser].stats, statsUpdate);
        saveUsers();
    }
}

// Prüfen, ob ein Benutzer eingeloggt ist
function isUserLoggedIn() {
    return currentUser !== null;
}

// Funktion zum Abrufen des aktuellen Benutzernamens
function getCurrentUsername() {
    return currentUser;
}

// Funktionen exportieren, die von anderen Skripten verwendet werden können
window.accountManager = {
    isUserLoggedIn,
    getCurrentUsername,
    getCurrentUserStats,
    updateUserStats
};