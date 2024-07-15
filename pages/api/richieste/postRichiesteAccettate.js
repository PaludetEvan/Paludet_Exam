import pool from '../../../src/config/db.js';

export default async function handler(req, res) {
    const { docente_id, studente_id, richiesta_id } = req.body;

    let client;
    try {
        client = await pool.connect();
        const queryString = `INSERT INTO richieste_accettate (docente_id, studente_id, richiesta_id) VALUES ($1, $2, $3) RETURNING *`;
        const values = [docente_id, studente_id, richiesta_id];
        const result = await client.query(queryString, values);

        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Errore nel comunicare con il db', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (client) {
            client.release();
        }
    }
}