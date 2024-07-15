import pool from '../../../src/config/db.js'

export default async function Handler(req, res) {
    const queryBuilder = `
    CREATE TABLE IF NOT EXISTS docenti (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cognome VARCHAR(255) NOT NULL,
    spec VARCHAR(255) NOT NULL,
    esperienza VARCHAR(255) NOT NULL,
    data_insegnamento VARCHAR(255) NOT NULL,
    mod_ricevimento VARCHAR(255) NOT NULL,
    disponibile BOOLEAN NOT NULL
);
    `
    try {
        let client = await pool.connect();
        await client.query(queryBuilder)
        const result = await client.query('SELECT * FROM docenti')
        res.status(200).json(result.rows);



    } catch (error) {
        console.error('Errore nella comunicazione con il db:', error);
        res.status(500).json({ error: 'Errore interno del server' });
    }
}