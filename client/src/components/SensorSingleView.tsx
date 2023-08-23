import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SensorItem from "../types/SensorItem";

interface SensorSingleViewProps{
  areaId: number;
  sensoreId: number;
}

const SensorSingleView: React.FC<SensorSingleViewProps> = ({areaId, sensoreId}) => {
  const [sens, setSens] = useState<SensorItem | null>(null);
  const { id } = useParams<{ id: string }>(); // Accesso al parametro id passandolo a useParams()

  useEffect(() => {
    fetchData();
  }, [areaId, sensoreId]); //Anche se il compilatore da warning, mantenere l'array vuoto per evitare loop infiniti, dato che
  //effettua la richiesta ad ogni render della pagina

  const fetchData = async () => {
    axios.defaults.baseURL = "http://localhost:5000/api";
    try {
      const response = await axios.get<SensorItem>(`/aree/${areaId}/sensori/${sensoreId}`);
      setSens(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //È presente una funzione con operatore ternario, che permette la
  //visualizzazione dei dati solo se sens non è null, inoltre identifica il
  //sensore in base all'id passato come parametro dalla richiesta GET
  return (
    <div>
      {sens ? (
        <div key={sens.id}>
          <h1>Info sul sensore {sens.id}</h1>
          <h3>Id: {sens.id}</h3>
          <ul>
            <li>Indirizzo IP: {sens.IP}</li>
            <li>Luogo: {sens.luogo}</li>
            <li>Raggio d'azione: {sens.raggio}</li>
            <li>Durata: {sens.sig_time} secondi</li>
            <li>ID Area di Riferimento: {sens.area}</li>
          </ul>
        </div>
      ) : (
        <p>Nessun dato disponibile</p>
      )}
      <Link to={`/api/aree/${areaId}`} type="button" className="btn btn-primary">
        Indietro
      </Link>
      <button onClick={() => sendSignal(areaId)} className="btn btn-warning">
        Invia Segnale
      </button>
    </div>
  );
};

function sendSignal(idA: number) : void{
  axios.defaults.baseURL = "http://localhost:5000/api/movimento/aree/";
  axios.get(`/${idA}`);
  
}



export default SensorSingleView;
