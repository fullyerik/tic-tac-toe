// Globale Variablen für die Benutzerverwaltung
let currentUser = null;
let users = {};

// Standard-Profilbild (Base64-kodiertes Bild)
const DEFAULT_PROFILE_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS11c2VyIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIvPjwvc3ZnPg==';

// Prüfen, ob bereits Benutzerdaten im Local Storage vorhanden sind
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    setupEventListeners();
    
    // Prüfen, ob ein Benutzer im Local Storage gespeichert ist
    const storedUser = localStorage.getItem('tictactoe_current_user');
    if (storedUser) {
        currentUser = storedUser;
        // Zeige Hauptmenü
        hideAllSections();
        document.getElementById('main-section').classList.remove('hidden');
        
        // Username-Display sofort aktualisieren
        const usernameDisplay = document.getElementById('username-display');
        const usernameText = document.getElementById('current-username-display');
        
        if (usernameDisplay && usernameText) {
            // Profilbild einfügen falls noch nicht vorhanden
            if (!document.getElementById('header-profile-image')) {
                const profileImg = document.createElement('img');
                profileImg.id = 'header-profile-image';
                profileImg.alt = 'Profilbild';
                profileImg.className = 'header-profile-image';
                profileImg.src = users[currentUser]?.profileImage || DEFAULT_PROFILE_IMAGE;
                
                usernameDisplay.insertBefore(profileImg, usernameText);
            }
            
            usernameText.textContent = currentUser;
            usernameDisplay.classList.remove('hidden');
        }
    }
});

// Benutzer aus dem Local Storage laden
function loadUsers() {
    const storedUsers = localStorage.getItem('tictactoe_users');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
        initializeUserDisplay(); // Hier hinzufügen
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

// Neue Funktion in account.js
function initializeUserDisplay() {
    if (currentUser && users[currentUser]) {
        const usernameDisplay = document.getElementById('username-display');
        const usernameText = document.getElementById('current-username-display');
        const headerProfileImage = document.getElementById('header-profile-image');
        
        if (headerProfileImage) {
            headerProfileImage.src = users[currentUser].profileImage || DEFAULT_PROFILE_IMAGE;
        }
        
        if (usernameText) {
            usernameText.textContent = currentUser;
        }
        
        if (usernameDisplay) {
            usernameDisplay.classList.remove('hidden');
        }
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

// Update createAccountSection function with profile image functionality
function createAccountSection() {
    if (!document.getElementById('account-section')) {
        const accountSection = document.createElement('div');
        accountSection.id = 'account-section';
        accountSection.className = 'hidden container';
        
        accountSection.innerHTML = `
            <h2>Account Einstellungen</h2>
            <div class="account-container">
                <div class="account-card">
                    <div class="account-header">
                        <div class="profile-image-container">
                            <img id="profile-image" src="${DEFAULT_PROFILE_IMAGE}" alt="Profilbild">
                            <div class="profile-image-overlay">
                                <span>Ändern</span>
                            </div>
                        </div>
                        <h3 id="account-username"></h3>
                    </div>
                    
                    <div class="account-body">
                        <div id="account-message" class="hidden message"></div>
                        
                        <div class="account-form">
                            <h4>Benutzername ändern</h4>
                            <div class="input-group">
                                <input type="text" id="new-username" placeholder="Neuer Benutzername">
                            </div>
                            <button class="account-button" id="change-username-button">
                                Benutzername ändern
                            </button>
                        </div>
                        
                        <div class="account-form">
                            <h4>Profilbild ändern</h4>
                            <div class="input-group profile-upload">
                                <input type="file" id="profile-image-upload" accept="image/*">
                                <button class="account-button" id="upload-image-button">
                                    Bild hochladen
                                </button>
                            </div>
                            <button class="account-button secondary-button" id="reset-image-button">
                                Standardbild verwenden
                            </button>
                        </div>
                    </div>
                </div>
                
                <button id="return-from-account" class="menu-button">
                    Zurück zum Menü
                </button>
            </div>
        `;
        
        document.getElementById('main-container').appendChild(accountSection);
        
        // Add event listeners
        document.getElementById('change-username-button').addEventListener('click', changeUsername);
        document.getElementById('return-from-account').addEventListener('click', () => {
            hideAllSections();
            document.getElementById('main-section').classList.remove('hidden');
        });
        
        // Add profile image related event listeners
        document.getElementById('upload-image-button').addEventListener('click', uploadProfileImage);
        document.getElementById('reset-image-button').addEventListener('click', resetProfileImage);
        
        // Optional: Allow clicking on the profile image to trigger file upload
        document.querySelector('.profile-image-container').addEventListener('click', function() {
            document.getElementById('profile-image-upload').click();
        });
    }
}

// Funktion zum Hochladen eines neuen Profilbilds
function uploadProfileImage() {
    const fileInput = document.getElementById('profile-image-upload');
    const file = fileInput.files[0];
    
    if (!file) {
        showAccountMessage('Bitte wähle ein Bild aus.', 'error');
        return;
    }
    
    // Überprüfung des Dateityps
    if (!file.type.match('image.*')) {
        showAccountMessage('Bitte wähle eine gültige Bilddatei.', 'error');
        return;
    }
    
    // Größenbeschränkung (max. 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showAccountMessage('Das Bild ist zu groß. Maximale Größe: 2MB.', 'error');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // Speichern des Bildes für den aktuellen Benutzer
        if (currentUser && users[currentUser]) {
            users[currentUser].profileImage = imageData;
            saveUsers();
            
            // Aktualisieren des angezeigten Bildes
            updateProfileImage();
            
            showAccountMessage('Profilbild erfolgreich aktualisiert!', 'success');
        }
    };
    
    reader.onerror = function() {
        showAccountMessage('Fehler beim Lesen der Datei.', 'error');
    };
    
    // Lesen der Datei als Data-URL
    reader.readAsDataURL(file);
    
    // Zurücksetzen des Datei-Inputs
    fileInput.value = '';
}

// Funktion zum Zurücksetzen des Profilbilds auf das Standardbild
function resetProfileImage() {
    if (currentUser && users[currentUser]) {
        users[currentUser].profileImage = DEFAULT_PROFILE_IMAGE;
        saveUsers();
        
        // Aktualisieren des angezeigten Bildes
        updateProfileImage();
        
        showAccountMessage('Profilbild zurückgesetzt.', 'success');
    }
}

// Funktion zum Aktualisieren des angezeigten Profilbilds
function updateProfileImage() {
    const profileImageElement = document.getElementById('profile-image');
    const headerProfileElement = document.getElementById('header-profile-image');
    
    if (currentUser && users[currentUser] && users[currentUser].profileImage) {
        const imageData = users[currentUser].profileImage;
        
        if (profileImageElement) {
            profileImageElement.src = imageData;
        }
        
        if (headerProfileElement) {
            headerProfileElement.src = imageData;
        }
    } else {
        if (profileImageElement) {
            profileImageElement.src = DEFAULT_PROFILE_IMAGE;
        }
        
        if (headerProfileElement) {
            headerProfileElement.src = DEFAULT_PROFILE_IMAGE;
        }
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
        profileImage: DEFAULT_PROFILE_IMAGE, // Standard-Profilbild hinzufügen
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
    
    // Profilbild aktualisieren
    updateProfileImage();
}

// Aktualisiere den angezeigten Benutzernamen im Account-Bereich
function updateAccountUsername() {
    const accountUsernameDisplay = document.getElementById('account-username');
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
    
    // Füge Profilbild zur Benutzeranzeige hinzu, falls noch nicht vorhanden
    if (!document.getElementById('header-profile-image')) {
        const profileImg = document.createElement('img');
        profileImg.id = 'header-profile-image';
        profileImg.alt = 'Profilbild';
        profileImg.className = 'header-profile-image';
        
        // Einfügen vor dem Benutzernamen
        usernameDisplay.insertBefore(profileImg, usernameText);
    }
    
    if (currentUser) {
        usernameText.textContent = currentUser;
        usernameDisplay.classList.remove('hidden');
        
        // Profilbild aktualisieren
        updateProfileImage();
        
        // Stelle sicher, dass das Display sichtbar ist, auch nach dem Seitenwechsel
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden && currentUser) {
                usernameDisplay.classList.remove('hidden');
            }
        });
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

// Prüfen, ob ein Benutzer eingeloggt ist (für die tic-tac-toe.js)
function isUserLoggedIn() {
    return currentUser !== null;
}

// Funktion zum Anzeigen der Statistik
function showStats() {
    if (!currentUser) {
        showMessage('Bitte logge dich ein, um deine Statistiken zu sehen.', 'error');
        return;
    }
    
    hideAllSections();
    document.getElementById('stats-section').classList.remove('hidden');
    
    // Statistiken aktualisieren
    updateStatsDisplay();
}

// Funktion zum Aktualisieren der Statistikanzeige
function updateStatsDisplay() {
    if (!currentUser || !users[currentUser]) return;
    
    const stats = users[currentUser].stats;
    const statsDisplay = document.getElementById('stats-display');
    
    if (statsDisplay) {
        statsDisplay.innerHTML = `
            <h3>Statistiken für ${currentUser}</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${stats.gamesPlayed}</div>
                    <div class="stat-label">Spiele</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.wins}</div>
                    <div class="stat-label">Siege</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.losses}</div>
                    <div class="stat-label">Niederlagen</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.draws}</div>
                    <div class="stat-label">Unentschieden</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0}%</div>
                    <div class="stat-label">Siegquote</div>
                </div>
            </div>
        `;
    }
}

// Stats-Button Event-Listener hinzufügen
document.addEventListener('DOMContentLoaded', function() {
    const statsButton = document.getElementById('stats-button');
    if (statsButton) {
        statsButton.addEventListener('click', showStats);
    }
    
    // Zurück-Button aus dem Statistikbereich
    const returnFromStatsButton = document.getElementById('return-from-stats');
    if (returnFromStatsButton) {
        returnFromStatsButton.addEventListener('click', function() {
            hideAllSections();
            document.getElementById('main-section').classList.remove('hidden');
        });
    }
});

// Funktion zum Zurücksetzen der Statistiken
function resetStats() {
    if (!currentUser || !users[currentUser]) return;
    
    // Bestätigung vom Benutzer einholen
    const confirmed = confirm('Möchtest du wirklich alle deine Statistiken zurücksetzen?');
    
    if (confirmed) {
        users[currentUser].stats = {
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            draws: 0
        };
        
        saveUsers();
        updateStatsDisplay();
        
        showMessage('Statistiken wurden zurückgesetzt.', 'success');
    }
}

// Reset-Stats-Button Event-Listener hinzufügen
document.addEventListener('DOMContentLoaded', function() {
    const resetStatsButton = document.getElementById('reset-stats-button');
    if (resetStatsButton) {
        resetStatsButton.addEventListener('click', resetStats);
    }
});

// Exportieren der Funktionen für die tic-tac-toe.js
// Dies ist nur notwendig, wenn die Dateien getrennt sind und über Module importiert werden
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isUserLoggedIn,
        getCurrentUserStats,
        updateUserStats,
        showMessage
    };
}

// Am Ende von account.js hinzufügen
window.addEventListener('load', initializeUserDisplay);
