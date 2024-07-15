import pool from '../../../src/config/db.js'

export default async function Handler(req, res) {
    const querySelect = `
    SELECT 
    richieste.id,
    richieste.data_coll,
    richieste.ora_coll,
    docenti.id AS doc_id,
    docenti.nome AS doc_nome,
    docenti.cognome AS doc_cognome,
    studenti.id AS stud_id,
    studenti.nome AS stud_nome,
    studenti.cognome AS stud_cognome,
    richieste.descrizione

    FROM
    richieste

    LEFT JOIN
    docenti ON richieste.docente_id = docenti.id
    LEFT JOIN
    studenti ON richieste.studente_id = studenti.id
`
    const queryBuilder = `
    CREATE TABLE IF NOT EXISTS richieste (
    id SERIAL PRIMARY KEY,
    descrizione VARCHAR(255) NOT NULL,
    data_coll DATE NOT NULL,
    ora_coll TIME NOT NULL,
    docente_id INTEGER NOT NULL REFERENCES docenti(id),
    studente_id INTEGER NOT NULL REFERENCES studenti(id)
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