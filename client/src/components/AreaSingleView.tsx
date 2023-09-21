import axios from "axios";
import { ConfirmProvider } from "material-ui-confirm";
import React, { useEffect, useState } from "react";
import { Link, useParams, useOutletContext } from "react-router-dom";
import AreaItem from "../types/AreaItem";
import Breadcrumb from "./Breadcrumb";
import Footer from "./Footer";
import LampTable from "./LampTable";
import SensorTable from "./SensorTable";



const AreaSingleView: React.FC = () => {
  const [area, setArea] = useState<AreaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { areaId } = useParams<{ areaId: string }>();

    async function getValueAndSend(option : React.ChangeEvent<HTMLSelectElement>){
        // Recupero del valore
        const value = option.target.value;
        console.log(value);
    
        // Invio della richiesta
        axios.defaults.baseURL = "http://localhost:5000/api";
        const response = await axios.put(`/aree/${areaId}/lampioni/${value}`);

        if (response.status === 200) {
            window.location.reload();
        }
    
    }

  useEffect(() => {
    const fetchData = async () => {
      axios.defaults.baseURL = "http://localhost:5000/api";
      console.log("areaId: ", areaId);
      if (!areaId) {
        console.error("areaId is undefined");
        return;
      }
      let areaResponse;

      try {
        areaResponse = await axios.get<AreaItem>(`/aree/${areaId}`);
        console.log("Area Response:", areaResponse.data);
      } catch (error) {
        console.error("Error fetching area:", error);
      }

      if (areaResponse) {
        const areaData = areaResponse.data;
        setArea(areaData);
        setLoading(false);
      }
    };
    fetchData();
  }, [areaId]);

  return (
    <ConfirmProvider>
      <div>
        {loading ? (
          <p>Caricamento...</p>
        ) : area ? (
          <div key={area.id}>
            <h1>Info sull'area {area.id}</h1>
            <Breadcrumb />
            <h2>ID: {area.id}</h2>
            <ul>
              <li>Nome: {area.nome}</li>
              <li>Descrizione: {area.descrizione}</li>
              <li>Latitudine: {area.latitudine}</li>
              <li>Longitudine: {area.longitudine}</li>
              <li>Polling Time: {area.polling}</li>
            </ul>
            <label htmlFor="edit-lum">
              Modifica Luminosit&agrave; Area: <span> </span>
            </label>
            <select
              value={this}
              name="edit-lum"
              className="form-group"
              onChange={(e) => getValueAndSend(e)}
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
            <h2>Lampioni Collegati</h2>
            <div className="row">
              <LampTable areaId={area.id} />
            </div>
            <h2>Sensori Collegati</h2>
            <div className="row">
              <SensorTable areaId={area.id} />
            </div>
          </div>
        ) : (
          <p>Nessun dato disponibile</p>
        )}
        <Link to="/" type="button" className="btn btn-primary">
          Indietro
        </Link>
      </div>
      <Footer />
    </ConfirmProvider>
  );
};

export default AreaSingleView;
