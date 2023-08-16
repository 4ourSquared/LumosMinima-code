import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import SensorItem from "../types/SensorItem";

interface SensorTableProps {
    sensori: SensorItem[];
    onSensoreDeleted: (id: number) => void; // Aggiunta di una nuova prop
    areaId: number; // Aggiunta dell'ID dell'area come prop
}
const SensorTable: React.FC<SensorTableProps> = ({
    sensori,
    onSensoreDeleted,
    areaId,
}) => {
    const navigate = useNavigate();

    const deleteSensore = async (id: number) => {
        const confirmed = window.confirm(
            "Sei sicuro di voler eliminare il sensore?"
        );
        try {
            if (confirmed) {
                await axios.delete(`http://localhost:5000/api/aree/${areaId}/sensori/${id}`);
                onSensoreDeleted(id); // Chiamata alla funzione di callback
            }
        } catch (error) {
            console.error("Errore nella cancellazione del sensore: ", error);
        }
    };

    return (
        <div className="row justify-content-center">
            <Link
                to={`/api/aree/${areaId}/sensori/add`}
                type="button"
                className="btn btn-primary"
            >
                Aggiungi Sensore
            </Link>
            <table
                className="table table-hover align-middle"
                style={{ width: "90%" }}
            >
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Indirizzo IP</th>
                        <th scope="col">Zona Illuminata</th>
                        <th scope="col">Raggio d'azione</th>
                        <th scope="col">Info</th>
                        <th scope="col">Modifica</th>
                        <th scope="col">Elimina</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    {sensori.map((sensore) => (
                        <tr key={sensore.id}>
                            <th scope="row">{sensore.id}</th>
                            <td>{sensore.IP}</td>
                            <td>{sensore.luogo}</td>
                            <td>{sensore.raggio}</td>
                            <td>
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() =>
                                        navigate(
                                            `/api/aree/${areaId}/sensori/${sensore.id}`
                                        )
                                    }
                                >
                                    Info
                                </button>
                            </td>
                            <td>
                                <button
                                    className="btn btn-outline-warning"
                                    onClick={() => {
                                        navigate(
                                            `/api/aree/${areaId}/sensori/edit/${sensore.id}`
                                        );
                                    }}
                                >
                                    Modifica
                                </button>
                            </td>
                            <td>
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={() => deleteSensore(sensore.id)}
                                >
                                    Elimina
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default SensorTable;
