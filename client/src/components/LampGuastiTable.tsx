import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LampItem from "../types/LampItem";

const LampGuastiTable: React.FC<{ areaId: number }> = ({ areaId }) => {
  const [lampioni, setLampioni] = useState<LampItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadLampioni();
  }, []);

    const loadLampioni = async () => {
        try {
            const response = await axios.get<LampItem[]>(
        `http://localhost:5000/api/aree/${areaId}/lampioni/guasti/`
            );
            setLampioni(response.data);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const removeLampione = async (id: Number) => {
      
        try {
            const response = await axios.put<LampItem[]>(
        `http://localhost:5000/api/aree/${areaId}/lampioni/guasti/remove/${id}`
            );
            window.alert(response.data)
            loadLampioni()
        } catch (error: any) {
            window.alert(error.response.data);
            console.error("Error fetching data:", error);
        }

    };

  return (
    <div>
    <table
      className="table table-hover align-middle"
      style={{ width: "90%" }} // Da spostare in un file CSS dedicato
    >
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Zona Illuminata</th>
          <th scope="col">Informazioni</th>
          <th scope="col">Marca come Riparato</th>
        </tr>
      </thead>
      <tbody id="tableBody">
        {lampioni.map((lampione) => (
          <tr key={lampione.id}>
            <th scope="row">{lampione.id}</th>
            <td>{lampione.luogo}</td>
            <td>
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate(`/api/aree/${areaId}/lampioni/${lampione.id}`)}
              >
                Info
              </button>
            </td>
            <td>
              <button
                className="btn btn-dark"
                onClick={() => {removeLampione(lampione.id);}}
              >
                Marca come riparato
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <Link to={`/api/aree/${areaId}`} type="button" className="btn btn-primary">
      Indietro
    </Link>
    </div>
  );
};

export default LampGuastiTable;
