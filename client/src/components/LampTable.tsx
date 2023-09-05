import axios from "axios";

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import LampItem from "../types/LampItem";
import {UserData,Role} from "../auth/Authorization"
import { useConfirm } from "material-ui-confirm";


interface LampTableProps {
  areaId: number; // Aggiunta dell'ID dell'area come prop
}

const LampTable: React.FC<LampTableProps> = ({areaId}) => {
  const [lampioni, setLampioni] = useState<LampItem[]>([]);
  const navigate = useNavigate();
  const [isAdmin] = useState(isAmministratore());
  const [isManut] = useState(isManutentore());
  const confirm = useConfirm();

  useEffect(() => {
    const loadLampioni = async () => {
        try {
            const response = await axios.get<LampItem[]>(
              `http://localhost:5000/api/aree/${areaId}/lampioni`
            );
            setLampioni(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    loadLampioni();
  }, []);

  const deleteLampione = async (id: number) => {
    confirm({
      title:"Eliminazione lampione",
      description:"Sei sicuro di voler eliminare il lampione?",
      confirmationText:"OK",
      cancellationText:"Annulla",
    }).then(() => {
      try{
        axios.delete(`http://localhost:5000/api/aree/${areaId}/lampioni/${id}`);
        setLampioni((cur) => cur.filter((item) => item.id !== id));
      }catch(error){
        alert("Errore nella cancellazione del lampione.");
        console.error("Errore nella cancellazione del lampione: ", error);
      }
    }).catch(() => {
      console.log("Annulata cancellazione del lampione.")
    })
  };

  const markGuasto = async (id: number) => {
    confirm({
      title:"Segnalzione lampione guasto",
      description:"Sei sicuro di voler segnare il seguente lampione come guasto?",
      confirmationText:"OK",
      cancellationText:"Annulla",
    }).then(() => {
      try{
        axios.put(`http://localhost:5000/api/aree/${areaId}/lampioni/guasti/${id}`);
        setLampioni((cur) => cur.map((item) => item.id===id?{...item,guasto:true}:item));
      }catch(error){
        console.error("Errore nella segnalazione del lampione come guasto: ", error);
      }
    }).catch(() => {
      console.log("Annullata la segnalazione del lampione come guasto.")
    });
  };

  const showListaGuasti = async () => {
    navigate(`/api/aree/${areaId}/lampioni/guasti`);
  };

  const userData = useOutletContext<UserData>()
  
  return (
    <div className="row justify-content-center">
      <Link
        to={`/api/aree/${areaId}/lampioni/add`}
        type="button"
        className="btn btn-primary"
      >
        Aggiungi Lampione
      </Link>
      <table
        className="table table-hover align-middle"
        style={{ width: "90%" }}
      >
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Stato</th>
            <th scope="col">Intensità</th>
            <th scope="col">Zona Illuminata</th>
            <th scope="col">Info</th>
            <th scope="col">Modifica</th>
            <th scope="col">Elimina</th>
            {userData.role === Role.Amministratore && <th scope="col">Guasto</th>}
          </tr>
        </thead>
        <tbody id="tableBody">
          {lampioni.map((lampione) => (
            <tr key={lampione.id}>
              <th scope="row">{lampione.id}</th>
              <td>{lampione.stato === "Attivo" ? "ON" : "OFF"}</td>
              <td>{lampione.lum}</td>
              <td>{lampione.luogo}</td>
              <td>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    navigate(`/api/aree/${areaId}/lampioni/${lampione.id}`);
                  }}
                >
                  Info
                </button>
              </td>
              <td>
                <button
                  className="btn btn-outline-warning"
                  onClick={() => {
                    navigate(
                      `/api/aree/${areaId}/lampioni/edit/${lampione.id}`
                    );
                  }}
                >
                  Modifica
                </button>
              </td>
              <td>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => deleteLampione(lampione.id)}
                >
                  Elimina
                </button>
              </td>
              {userData.role === Role.Amministratore && (
                <td>
                  {lampione.guasto ? (
                    <>
                      <span
                        style={{ cursor: "default" }}
                        data-tooltip-id={`x${lampione.id}`}
                        data-tooltip-content="Già marcato come guasto"
                      >
                        {"\u274c"}
                      </span>
                      <Tooltip id={`x${lampione.id}`} />
                    </>
                  ) : (
                    <button
                      className="btn btn-dark"
                      onClick={() => markGuasto(lampione.id)}
                    >
                      Segnala guasto
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {userData.role === Role.Manutentore && (
        <button className="btn btn-secondary" onClick={() => showListaGuasti()}>
          Vai alla lista guasti
        </button>
      )}
    </div>
  );
};

export default LampTable;
