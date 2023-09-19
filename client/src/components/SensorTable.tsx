import axios from "axios";
import React, {useEffect, useState} from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import SensorItem from "../types/SensorItem";
import {UserData,Role} from "../auth/Authorization"
import { useConfirm } from "material-ui-confirm";

interface SensorTableProps {
    sens: SensorItem[];
    areaId: number; // Aggiunta dell'ID dell'area come prop
}

const SensorTable: React.FC<SensorTableProps> = ({areaId}) => {
    const [sensori, setSensori] = useState<SensorItem[]>([]);
    const userData = useOutletContext<UserData>();

    const navigate = useNavigate();
    const confirm = useConfirm();

    const deleteSensore = async (id: number) => {
        confirm({
            title:"Eliminazione sensore",
            description:"Sei sicuro di voler eliminare il sensore?",
            confirmationText:"OK",
            cancellationText:"Annulla",
        }).then(() => {
            try{
                axios.delete(`http://localhost:5000/api/aree/${areaId}/sensori/${id}`);
                setSensori((cur) => cur.filter((item) => item.id !== id));
            }catch(error){
                alert("Errore nella cancellazione del sensore.");
                console.error("Errore nella cancellazione del sensore: ", error);
            }
        }).catch(() => {
            console.error("Annullata cancellazione del sensore");
        })
    };

    return (
        <div className="row justify-content-center">
            {userData.role === Role.Amministratore &&
                <Link
                    to={`/api/aree/${areaId}/sensori/add`}
                    type="button"
                    className="btn btn-primary"
                >
                    Aggiungi Sensore
                </Link>
            }
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
                        {userData.role === Role.Amministratore &&
                            <>
                            <th scope="col">Modifica</th>

                            <th scope="col">Elimina</th>
                            </>
                        }
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
                            {userData.role === Role.Amministratore &&
                            <>
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
                            </>
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default SensorTable;
