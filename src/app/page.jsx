'use client'

import { error } from "next/error";
require('dotenv').config();

import React, { useEffect, useState } from "react";

export default function Home() {
  const [docenti, setDocenti] = useState([{}]);
  const [studenti, setStudenti] = useState([{}]);

  const [richieste, setRichieste] = useState([{}]);
  const [richiesteAccettate, setRichiesteAccettate] = useState([{}]);

  const [richiesta_id_num, setRichiestaId] = useState();
  const [docente_id_num, setDocenteId] = useState();
  const [studente_id_num, setStudenteId] = useState();

  useEffect(() => {
    getDocenti();
    getStudenti();
    getRichieste();
    getRichiesteAccettate();
  }, []);

  const getDocenti = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/docenti/getDocenti`);
      console.log('Response:', response);

      if (response.ok) {
        const data = await response.json();
        setDocenti(data);
        console.log('Data:', data);
      } else if (response.status === 500) {
        console.log("internal server error", error);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getStudenti = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/studenti/getStudenti`);
      console.log('Response:', response);

      if (response.ok) {
        const data = await response.json();
        setStudenti(data);
        console.log('Data:', data);
      } else if (response.status === 500) {
        console.log("internal server error", error);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getRichieste = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/richieste/getRichieste`);
      console.log('Response:', response);

      if (response.ok) {
        const data = await response.json();
        const reverseData = [...data].reverse();
        setRichieste(reverseData);
        console.log('Data:', data);
      } else if (response.status === 500) {
        console.log("errore quiiiii", error);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getRichiesteAccettate = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/richieste/getRichiesteAccettate`);
      console.log('Response:', response);

      if (response.ok) {
        const data = await response.json();
        const reverseData = [...data].reverse();
        setRichiesteAccettate(reverseData);
        console.log('Data:', data);
      } else if (response.status === 500) {
        console.log("errore quiiiii", error);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const accettaRichiesta = async () => {
    //e.preventDefault();
    const docente_id = parseInt(docente_id_num);
    const studente_id = parseInt(studente_id_num);
    const richiesta_id = parseInt(richiesta_id_num);

    const data = { richiesta_id, docente_id, studente_id };

    console.log(data);
    try {
      const response = await fetch(`http://localhost:3000/api/richieste/postRichiesteAccettate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        console.log("Richiesta accettata con successo");
        await getRichiesteAccettate();
        eliminaRichiesta(richiesta_id)
      } else {
        console.error("Errore durante l'assegnazione dell'intervento", error);
      }
    } catch (error) {
      console.error('error', error);
      console.log("Errore durante il caricamento");
    }
  };

  const eliminaRichiesta = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/richieste/${id}`, {
        method: 'DELETE',
      });
  
      console.log('Response:', response);
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Errore nella richiesta DELETE: ${response.status} ${response.statusText} - ${errorText}`);
      }
  
      const data = await response.json();
      console.log('Data:', data);
      return data;
  
    } catch (error) {
      console.error('Errore nella richiesta fetch:', error);
      throw error;
    }
  }
  

  return (
    <main>
      <div className="cont">
        <h1 style={{ fontSize: '1.7rem' }}>Richieste in sospeso</h1>
        <div id="open_int">
          {richieste.map((item) => (
            <div key={item.id} style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: '#FFFDFD', marginBottom: '0.5rem', padding: '0.4rem', fontSize: 'small', borderRadius: '0.3rem' }}>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <div style={{ marginRight: '0.6rem', fontSize: '0.9rem' }}>
                  {item.id}
                </div>
                <div>
                  <p><strong>{item.descrizione}</strong></p>
                  <p>Data : {item.data_coll}</p>
                  <p>Ora : {item.ora_coll}</p>
                  <p>Docente : {item.doc_nome} {item.doc_cognome}</p>
                  <p>Studente : {item.stud_nome} {item.stud_cognome}</p>
                </div>
              </div>
              <div>
                <button className="btn normal" onClick={() => { setRichiestaId(item.id); setDocenteId(item.doc_id); setStudenteId(item.stud_id); accettaRichiesta() }}>
                  Assegna
                </button>
                <button className="btn" style={{backgroundColor:'red',marginLeft:'0.3rem'}} onClick={() => eliminaRichiesta(item.id)}>
                  Elimina
                </button>
              </div>
            </div>
          ))}
        </div>

        <h1 style={{ fontSize: '1.7rem' }}>Richieste accettate</h1>
        <div id="closed_int">
          {richiesteAccettate.map((item) => (
            <div key={item.id} style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: '#FFFDFD', marginBottom: '0.5rem', padding: '0.4rem', fontSize: 'small', borderRadius: '0.3rem' }}>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <div style={{ marginRight: '0.6rem', fontSize: '0.9rem' }}>
                  {item.id}
                </div>
                <div>
                  <p><strong>{item.descrizione}</strong></p>
                  <p>Data : {item.data_coll}</p>
                  <p>Orario : {item.ora_coll}</p>
                  <p>Docente : <strong>{item.doc_nome} {item.doc_cognome}</strong></p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <strong>{item.ora_intervento}</strong>
                <strong>{item.data_intervento}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="tec_cont">
        <div id="tec_list">
          {docenti.map((item) => (
            <div key={item.id} style={{ backgroundColor: '#FFFDFD', marginBottom: '0.5rem', padding: '0.4rem', fontSize: 'small', borderRadius: '0.3rem' }}>
              <p><strong>{item.nome} {item.cognome}</strong></p>
              <p>Esperienza: {item.esperienza}</p>
              <p>Spec: {item.spec}</p>
              <p>{item.disponibile}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
