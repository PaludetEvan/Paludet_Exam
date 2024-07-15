import pool from '../../../src/config/db.js';

export default async function handler(req, res) {
    const { descrizione, data_coll, ora_coll, docente_id, studente_id } = req.body;

    let client;
    try {
        client = await pool.connect();
        const queryString = 'INSERT INTO richieste (descrizione, data_coll, ora_coll, docente_id, studente_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [descrizione, data_coll, ora_coll, docente_id, studente_id];
        const result = await client.query(queryString, values);

        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Errore nel comunicare con il db', error);
        res.status(500).json({ error: 'Internal server error' });
    }finally {

        if (client) {
            client.release();
            console.log("DB connection released");
        }
    }
}