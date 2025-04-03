/**
 * Account Management System
 * Für Tic Tac Toe Spiel
 */

// User-Datenstruktur im LocalStorage
// {
//   username: string,
//   password: string,
//   createdAt: Date,
//   lastLogin: Date
// }

document.addEventListener('DOMContentLoaded', () => {
    // DOM-Elemente
    const accountButton = document.getElementById('account-button');
    const accountSection = document.getElementById('account-section');
    const mainSection = document.getElementById('main-section');
    const returnFromAccountButton = document.getElementById('return-from-account');
    
    const changeUsernameButton = document.getElementById('change-username-button');
    const changePasswordButton = document.getElementById('change-password-button');
    const deleteAccountButton = document.getElementById('delete-account-button');
    
    const newUsernameInput = document.getElementById('new-username');
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmNewPasswordInput = document.getElementById('confirm-new-password');
    
    const accountMessage = document.getElementById('account-message');
    const accountUsername = document.getElementById('account-username');
    const userInitial = document.getElementById('user-initial');
    
    // Prüfen, ob localStorage verfügbar ist
    const isLocalStorageAvailable = (() => {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    })();
    
    if (!isLocalStorageAvailable) {
        console.error('LocalStorage ist nicht verfügbar. Die Anwendung funktioniert möglicherweise nicht korrekt.');
        // Hier könnte eine Benutzermeldung angezeigt werden
    }
    
    // Event-Listener hinzufügen
    if (accountButton) {
        accountButton.addEventListener('click', function() {
            console.log('Account-Button geklickt'); // Debugging
            showAccountSection();
        });
    }
    
    if (returnFromAccountButton) {
        returnFromAccountButton.addEventListener('click', returnToMainMenu);
    }
    
    if (changeUsernameButton) {
        changeUsernameButton.addEventListener('click', changeUsername);
    }
    
    if (changePasswordButton) {
        changePasswordButton.addEventListener('click', changePassword);
    }
    
    if (deleteAccountButton) {
        deleteAccountButton.addEventListener('click', confirmDeleteAccount);
    }
    
    /**
     * Account-Bereich anzeigen und mit aktuellen Nutzerdaten füllen
     */
    function showAccountSection() {
        // Aktuellen Benutzer abrufen
        const currentUser = getCurrentUser();
        
        if (!currentUser) {
            // Sollte nicht vorkommen, da man eingeloggt sein muss
            console.error('Kein Benutzer eingeloggt');
            return;
        }
        
        // Benutzername anzeigen
        if (accountUsername) {
            accountUsername.textContent = currentUser.username;
        }
        
        // Initial für das Profilbild setzen
        if (userInitial && currentUser.username) {
            userInitial.textContent = currentUser.username.charAt(0).toUpperCase();
        }
        
        // Felder leeren
        if (newUsernameInput) newUsernameInput.value = '';
        if (currentPasswordInput) currentPasswordInput.value = '';
        if (newPasswordInput) newPasswordInput.value = '';
        if (confirmNewPasswordInput) confirmNewPasswordInput.value = '';
        
        // Nachrichtenbereich zurücksetzen
        hideMessage();
        
        // Bereichswechsel
        if (mainSection) mainSection.classList.add('hidden');
        if (accountSection) accountSection.classList.remove('hidden');
    }
    
    /**
     * Zurück zum Hauptmenü
     */
    function returnToMainMenu() {
        if (accountSection) accountSection.classList.add('hidden');
        if (mainSection) mainSection.classList.remove('hidden');
    }
    
    /**
     * Benutzernamen ändern
     */
    function changeUsername() {
        if (!newUsernameInput) return;
        
        const newUsername = newUsernameInput.value.trim();
        
        // Validierung
        if (!newUsername) {
            showErrorMessage('Bitte gib einen neuen Benutzernamen ein.');
            return;
        }
        
        // Prüfen, ob Benutzername bereits vergeben ist
        const users = getAllUsers();
        const currentUser = getCurrentUser();
        
        if (!currentUser) {
            showErrorMessage('Kein Benutzer eingeloggt.');
            return;
        }
        
        if (newUsername === currentUser.username) {
            showErrorMessage('Der neue Benutzername entspricht dem aktuellen.');
            return;
        }
        
        const isUsernameTaken = Object.keys(users).some(username => 
            username.toLowerCase() === newUsername.toLowerCase() && username !== currentUser.username
        );
        
        if (isUsernameTaken) {
            showErrorMessage('Dieser Benutzername ist bereits vergeben.');
            return;
        }
        
        try {
            // Benutzerdaten kopieren und alten Benutzer löschen
            const userData = { ...users[currentUser.username] };
            delete users[currentUser.username];
            
            // Neuen Benutzer hinzufügen
            users[newUsername] = userData;
            
            // Aktuellen Benutzer aktualisieren
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', newUsername);
            
            // UI aktualisieren
            if (accountUsername) accountUsername.textContent = newUsername;
            if (userInitial) userInitial.textContent = newUsername.charAt(0).toUpperCase();
            
            // Spielstatistiken aktualisieren, falls vorhanden
            const statsKey = `stats_${currentUser.username}`;
            const statsData = localStorage.getItem(statsKey);
            if (statsData) {
                localStorage.setItem(`stats_${newUsername}`, statsData);
                localStorage.removeItem(statsKey);
            }
            
            // Erfolgssnachricht anzeigen
            showSuccessMessage('Benutzername erfolgreich geändert!');
            
            // Eingabefeld leeren
            newUsernameInput.value = '';
        } catch (error) {
            console.error('Fehler beim Ändern des Benutzernamens:', error);
            showErrorMessage('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
        }
    }
    
    /**
     * Passwort ändern
     */
    function changePassword() {
        if (!currentPasswordInput || !newPasswordInput || !confirmNewPasswordInput) return;
        
        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmNewPassword = confirmNewPasswordInput.value;
        
        // Validierung
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            showErrorMessage('Bitte fülle alle Passwortfelder aus.');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            showErrorMessage('Die neuen Passwörter stimmen nicht überein.');
            return;
        }
        
        // Aktuellen Benutzer abrufen
        const users = getAllUsers();
        const currentUser = getCurrentUser();
        
        if (!currentUser) {
            showErrorMessage('Kein Benutzer eingeloggt.');
            return;
        }
        
        // Prüfen, ob das aktuelle Passwort stimmt
        if (!users[currentUser.username] || users[currentUser.username].password !== currentPassword) {
            showErrorMessage('Das aktuelle Passwort ist nicht korrekt.');
            return;
        }
        
        try {
            // Passwort aktualisieren
            users[currentUser.username].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
            
            // Erfolgssnachricht anzeigen
            showSuccessMessage('Passwort erfolgreich geändert!');
            
            // Felder leeren
            currentPasswordInput.value = '';
            newPasswordInput.value = '';
            confirmNewPasswordInput.value = '';
        } catch (error) {
            console.error('Fehler beim Ändern des Passworts:', error);
            showErrorMessage('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
        }
    }
    
    /**
     * Account-Löschung bestätigen
     */
    function confirmDeleteAccount() {
        const confirmDelete = confirm('Möchtest du deinen Account wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.');
        
        if (confirmDelete) {
            deleteAccount();
        }
    }
    
    /**
     * Account löschen
     */
    function deleteAccount() {
        // Aktuellen Benutzer abrufen
        const users = getAllUsers();
        const currentUser = getCurrentUser();
        
        if (!currentUser) {
            showErrorMessage('Kein Benutzer eingeloggt.');
            return;
        }
        
        try {
            // Benutzer löschen
            delete users[currentUser.username];
            
            // Speichern und Benutzer ausloggen
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.removeItem('currentUser');
            
            // Statistik löschen
            localStorage.removeItem(`stats_${currentUser.username}`);
            
            // Zur Login-Seite zurückkehren
            const loginSection = document.getElementById('login-section');
            if (accountSection) accountSection.classList.add('hidden');
            if (loginSection) {
                loginSection.classList.remove('hidden');
                
                // Erfolgsmeldung im Login-Bereich anzeigen
                const messageElement = document.getElementById('message');
                if (messageElement) {
                    messageElement.textContent = 'Dein Account wurde erfolgreich gelöscht.';
                    messageElement.classList.remove('hidden', 'error');
                    messageElement.classList.add('success');
                }
            } else {
                // Fallback zur Login-Seite, falls das Element nicht gefunden wird
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error('Fehler beim Löschen des Accounts:', error);
            showErrorMessage('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
        }
    }
    
    // Hilfsfunktionen
    
    /**
     * Aktuellen Benutzer aus dem localStorage abrufen
     */
    function getCurrentUser() {
        try {
            const username = localStorage.getItem('currentUser');
            if (!username) return null;
            
            const users = getAllUsers();
            if (!users[username]) {
                // Falls der Benutzer nicht existiert, aufräumen
                localStorage.removeItem('currentUser');
                return null;
            }
            
            return {
                username,
                ...users[username]
            };
        } catch (error) {
            console.error('Fehler beim Abrufen des aktuellen Benutzers:', error);
            return null;
        }
    }
    
    /**
     * Alle Benutzer aus dem localStorage abrufen
     */
    function getAllUsers() {
        try {
            const usersJson = localStorage.getItem('users');
            return usersJson ? JSON.parse(usersJson) : {};
        } catch (error) {
            console.error('Fehler beim Abrufen aller Benutzer:', error);
            return {};
        }
    }
    
    /**
     * Fehlermeldung anzeigen
     */
    function showErrorMessage(message) {
        if (!accountMessage) return;
        
        accountMessage.textContent = message;
        accountMessage.classList.remove('hidden', 'success');
        accountMessage.classList.add('error');
        
        // Nachricht nach 5 Sekunden ausblenden
        setTimeout(hideMessage, 5000);
    }
    
    /**
     * Erfolgsmeldung anzeigen
     */
    function showSuccessMessage(message) {
        if (!accountMessage) return;
        
        accountMessage.textContent = message;
        accountMessage.classList.remove('hidden', 'error');
        accountMessage.classList.add('success');
        
        // Nachricht nach 5 Sekunden ausblenden
        setTimeout(hideMessage, 5000);
    }
    
    /**
     * Nachricht ausblenden
     */
    function hideMessage() {
        if (accountMessage) {
            accountMessage.classList.add('hidden');
        }
    }
});