import pool from '../../../src/config/db.js'

export default async function Handler(req, res) {
    const querySelect = `
    SELECT 
    richieste_accettate.id,
    richieste_accettate.data_coll,
    richieste_accettate.ora_coll,
    richieste_accettate.descrizione,
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
`
    const queryBuilder = `
    CREATE TABLE IF NOT EXISTS richieste_accettate (
    id SERIAL PRIMARY KEY,
    studente_id INTEGER NOT NULL REFERENCES studenti(id),
    docente_id INTEGER NOT NULL REFERENCES docenti(id),
    descrizione VARCHAR(255) NOT NULL,
    data_coll DATE NOT NULL,
    ora_coll TIME NOT NULL,
    mod_ricevimento VARCHAR(255) NOT NULL
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
    } finally {

        if (client) {
            client.release();
            console.log("DB connection released");
        }
    }

}