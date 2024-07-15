import pool from '../../../src/config/db.js'

export default async function Handler(req, res) {
    const queryBuilder = `
    CREATE TABLE IF NOT EXISTS studenti (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cognome VARCHAR(255) NOT NULL,
    mail VARCHAR(255) NOT NULL,
    data_nascita DATE NOT NULL,
    cellulare VARCHAR(10) NOT NULL

);
    `
    try {
        let client = await pool.connect();
        await client.query(queryBuilder)
        const result = await client.query('SELECT * FROM studenti')
        res.status(200).json(result.rows);



    } catch (error) {
        console.error('Errore nella comunicazione con il db:', error);
        res.status(500).json({ error: 'Errore interno del server' });
    }
}