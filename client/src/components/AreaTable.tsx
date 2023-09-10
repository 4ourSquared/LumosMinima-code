import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AreaItem from "../types/AreaItem";
import { useConfirm } from "material-ui-confirm";

export const AreaTable: React.FC = () => {
  const [aree, setAree] = useState<AreaItem[]>([]);
  const navigate = useNavigate();
  const confirm = useConfirm();

  useEffect(() => {
    const loadAree = async () => {
      try {
        const response = await axios.get<AreaItem[]>(
          "http://localhost:5000/api/aree"
        );
        setAree(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    loadAree();
  }, []);

  const deleteArea = async (id: Number) => {
    confirm({
      title:"Eliminazione area",
      description: "Sei sicuro di voler eliminare l'area?",
      confirmationText: "OK",
      cancellationText: "Annulla",
    }).then(async () => {
      try{
        await axios.delete(`http://localhost:5000/api/aree/${id}`);
        setAree((cur) => cur.filter((item) => item.id !== id));
      }catch(error){
        alert("Errore nella cancellazione dell'area.");
        console.error("Errore nella cancellazione dell'area.");
      }
    }).catch(() => {
      console.log("Annullata cancellazione dell'area.")
    });
  };

  return (
    <>
      <div className="table-responsive row justify-content-center">
        <Link to="/api/aree/add" type="button" className="btn btn-primary">
          Aggiungi Area
        </Link>
        <table className="table table-hover align-middle caption-top">
          <caption>Lista delle aree</caption>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nome</th>
              <th scope="col">Descrizione</th>
              <th scope="col">Latitudine</th>
              <th scope="col">Longitudine</th>
              <th scope="col">Informazioni</th>
              <th scope="col">Modifica</th>
              <th scope="col">Elimina</th>
            </tr>
          </thead>
          <tbody id="tableBody">
            {aree.map((area) => (
              <tr key={area.id}>
                <th scope="row">{area.id}</th>
                <td>{area.nome}</td>
                <td>{area.descrizione}</td>
                <td>{area.latitudine}</td>
                <td>{area.longitudine}</td>
                <td>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate(`/api/aree/${area.id}`)}
                  >
                    Informazioni
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate(`/api/aree/edit/${area.id}`)}
                  >
                    Modifica
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => deleteArea(area.id)}
                  >
                    Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AreaTable;
