import pool from '../../../src/config/db.js'

export default async function Handler (req,res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            let client = await pool.connect()
            const result = await client.query('SELECT * FROM studenti WHERE id = $1', [id])
            
            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Elemento non trovato' });
            } else {
                res.status(200).json(result.rows)
            }
        } catch (error) {
            console.error('errore nella comunicazione con il db : ' ,error)
            res.status(500).json({ error: 'Errore interno del server' });

        } finally {
            if (client) client.release();
        }
    } if (req.method === 'DELETE') {
        try {
            const result = await pool.query('DELETE FROM studenti WHERE id = $1 RETURNING *', [id]);

            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Elemento non trovato' });
            }

            return res.status(200).json({ message: 'Elemento eliminato con successo', item: result.rows[0] });
        } catch (error) {
            console.error('Errore nella richiesta DELETE:', error);
            return res.status(500).json({ error: 'Errore nel server' });
        }
    }
}