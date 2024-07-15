import pool from '../../../src/config/db.js'

export default async function Handler(req, res) {
    const querySelect = `
    SELECT 
    richieste_accettate.id,
    richieste.data_coll,
    richieste.ora_coll,
    richieste.studente_id,
    richieste.docente_id,
    richieste.descrizione,
    studenti.nome AS stud_nome,
    studenti.cognome AS stud_cognome,
    docenti.nome AS doc_nome,
    docenti.cognome AS doc_cognome,
    docenti.mod_ricevimento

    FROM
    richieste_accettate

    LEFT JOIN
    docenti ON richieste_accettate.docente_id = docenti.id
    LEFT JOIN
    studenti ON richieste_accettate.studente_id = studenti.id
    LEFT JOIN
    richieste ON richieste_accettate.richiesta_id = richieste.id
`
    const queryBuilder = `
    CREATE TABLE IF NOT EXISTS richieste_accettate (
    id SERIAL PRIMARY KEY,
    richiesta_id INTEGER NOT NULL REFERENCES richieste(id),
    studente_id INTEGER NOT NULL REFERENCES studenti(id),
    docente_id INTEGER NOT NULL REFERENCES docenti(id)
);
    `
    try {
        let client = await pool.connect();
        await client.query(queryBuilder)
        const result = await client.query(querySelect)
        if (result.rows === 0) {
            console.error('nessun dato trovato')
        } else {
            res.status(200).json(result.rows);

        }

    } catch (error) {
        console.error('Errore nella comunicazione con il db:', error);
        res.status(500).json({ error: 'Errore interno del server' });
    }

}