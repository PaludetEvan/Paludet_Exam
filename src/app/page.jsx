'use client'

import { error } from "next/error";
require('dotenv').config();

import React, { useEffect, useState } from "react";

export default function Home() {
  const [docenti, setDocenti] = useState([{}]);
  const [studenti, setStudenti] = useState([{}]);

  const [richieste, setRichieste] = useState([{}]);
  const [richiesteAccettate, setRichiesteAccettate] = useState([{}]);

  const [docente_id_num, setDocenteId] = useState();
  const [studente_id_num, setStudenteId] = useState();
  const [descrizione, setDescrizione] = useState();
  const [data_coll, setDataColl] = useState();
  const [ora_coll, setOraColl] = useState();
  const [mod_ricevimento, setRicevimento] = useState();
  const [richiesta_id, setRichiestaId] = useState()





  useEffect(() => {
    getDocenti();
    getStudenti();
    getRichieste();
    getRichiesteAccettate();
  }, []);

  const getDocenti = async () => {
    try {
      const response = await fetch(`https://master.dq13sw6xoch1y.amplifyapp.com/api/docenti/getDocenti`);
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
      const response = await fetch(`https://master.dq13sw6xoch1y.amplifyapp.com/api/studenti/getStudenti`);
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
      const response = await fetch(`https://master.dq13sw6xoch1y.amplifyapp.com/api/richieste/getRichieste`);
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
      const response = await fetch(`https://master.dq13sw6xoch1y.amplifyapp.com/api/richieste/getRichiesteAccettate`);
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

    const data = { studente_id,docente_id,descrizione,data_coll,ora_coll,mod_ricevimento };

    console.log(data);
    try {
      const response = await fetch(`https://master.dq13sw6xoch1y.amplifyapp.com/api/richieste/postRichiesteAccettate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        console.log("Richiesta accettata con successo");
        await getRichiesteAccettate();
        await eliminaRichiesta(richiesta_id);
        await getRichieste();
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
      const response = await fetch(`https://master.dq13sw6xoch1y.amplifyapp.com/api/richieste/${id}`, {
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
  const eliminaRichiestaAssegnata = async (id) => {
    try {
      const response = await fetch(`https://master.dq13sw6xoch1y.amplifyapp.com/api/richieste/assegnate/${id}`, {
        method: 'DELETE',
      });

      console.log('Response:', response);
      if (response.ok){
        getRichiesteAccettate()
      }

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
                <button className="btn normal" onClick={() => {
                  setDocenteId(item.doc_id);
                  setStudenteId(item.stud_id);
                  setDescrizione(item.descrizione);
                  setDataColl(item.data_coll);
                  setOraColl(item.ora_coll);
                  setRicevimento(item.mod_ricevimento);
                  setRichiestaId(item.id)
                  accettaRichiesta()
                }}>
                  Accetta
                </button>
                <button className="btn alert" onClick={() => eliminaRichiesta(item.id)}>
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
                  <p>Modalità di ricevimento : {item.mod_ricevimento}</p>
                  <p>Studente : <strong>{item.stud_nome} {item.stud_cognome}</strong></p>
                  <p>Docente : <strong>{item.doc_nome} {item.doc_cognome}</strong></p>
                </div>
              </div>
              <div>
                <button className="btn alert" onClick={() => eliminaRichiestaAssegnata(item.id)}>
                  Elimina
                </button>
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
