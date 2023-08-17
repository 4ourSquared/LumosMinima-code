import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LampItem from "../types/LampItem";

interface LampSingleViewProps{
  areaId: number;
  lampioneId: number;
}

const LampSingleView: React.FC<LampSingleViewProps> = ({areaId, lampioneId}) => {
  const [lamp, setLamp] = useState<LampItem | null>(null);
  const { id } = useParams<{ id: string }>(); // Accesso al parametro id passandolo a useParams()
  

  useEffect(() => {
    fetchData();
  }, []); //Anche se il compilatore da warning, mantenere l'array vuoto per evitare loop infiniti, dato che
  //effettua la richiesta ad ogni render della pagina

  const fetchData = async () => {
    axios.defaults.baseURL = "http://localhost:5000/api/";
    try {
      const response = await axios.get<LampItem>(`aree/${areaId}/lampioni/${lampioneId}`);
      setLamp(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //È presente una funzione con operatore ternario, che permette la
  //visualizzazione dei dati solo se lamp non è null, inoltre identifica il
  //lampione in base all'id passato come parametro dalla richiesta GET
  return (
    <div>
      {lamp ? (
        <div key={lamp.id}>
          <h1>Info sul lampione {lamp.id}</h1>
          <h3>Id: {lamp.id}</h3>
          <ul>
            <li>Stato: {lamp.stato}</li>
            <li>Luminosit&agrave;: {lamp.lum}</li>
            <li>Luogo: {lamp.luogo}</li>
            <li>Interazione: {lamp.mode}</li>
            <li>ID Area di Riferimento: {lamp.area}</li>
          </ul>
        </div>
      ) : (
        <div>
        <p>Nessun dato disponibile</p>
        <p>{areaId}</p>
        <p>{lamp}</p>
        </div>
      )}
      <Link to={`/api/aree/${areaId}`} type="button" className="btn btn-primary">
        Indietro
      </Link>
    </div>
  );
};

export default LampSingleView;
