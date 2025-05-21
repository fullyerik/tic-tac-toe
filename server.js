const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('.'));

// Statistiken lesen
app.get('/stats', (req, res) => {
    try {
        const stats = fs.readFileSync('stats.txt', 'utf8');
        res.json(JSON.parse(stats));
    } catch (error) {
        // Wenn Datei nicht existiert, sende leere Statistik
        res.json({ wins: 0, losses: 0, draws: 0 });
    }
});

// Statistiken speichern
app.post('/stats', (req, res) => {
    try {
        fs.writeFileSync('stats.txt', JSON.stringify(req.body));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Speichern' });
    }
});

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});