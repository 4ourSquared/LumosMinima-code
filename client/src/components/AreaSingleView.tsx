import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AreaItem from "../types/AreaItem";
import LampItem from "../types/LampItem";
import SensorItem from "../types/SensorItem";
import LampTable from "./LampTable";
import SensorTable from "./SensorTable";
import { Field } from "formik";

const AreaSingleView: React.FC = () => {
    const [area, setArea] = useState<AreaItem | null>(null);
    const [loading, setLoading] = useState(true);
    const { areaId } = useParams<{ areaId: string }>();

    useEffect(() => {
        const fetchData = async () => {
            axios.defaults.baseURL = "http://localhost:5000/api";
            console.log("areaId: ", areaId);
            if (!areaId) {
                console.error("areaId is undefined");
                return;
            }
            let areaResponse, lampioniResponse, sensoriResponse;

            try {
                areaResponse = await axios.get<AreaItem>(`/aree/${areaId}`);
                console.log("Area Response:", areaResponse.data);
            } catch (error) {
                console.error("Error fetching area:", error);
            }

            try {
                lampioniResponse = await axios.get<LampItem[]>(
                    `/aree/${areaId}/lampioni`
                );
                console.log("Lampioni Response:", lampioniResponse.data);
            } catch (error) {
                console.error("Error fetching lampioni:", error);
            }

            try {
                sensoriResponse = await axios.get<SensorItem[]>(
                    `/aree/${areaId}/sensori`
                );
                console.log("Sensori Response:", sensoriResponse.data);
            } catch (error) {
                console.error("Error fetching sensori:", error);
            }

            if (areaResponse && lampioniResponse && sensoriResponse) {
                const areaData = areaResponse.data;
                areaData.lampioni = lampioniResponse.data;
                areaData.sensori = sensoriResponse.data;
                setArea(areaData);
                setLoading(false);
            }
        };
        fetchData();
    }, [areaId]);

    return (
        <div>
            {loading ? (
                <p>Caricamento...</p>
            ) : area ? (
                <div key={area.id}>
                    <h1>Info sull'area {area.id}</h1>
                    <h2>ID: {area.id}</h2>
                    <ul>
                        <li>Nome: {area.nome}</li>
                        <li>Descrizione: {area.descrizione}</li>
                        <li>Latitudine: {area.latitudine}</li>
                        <li>Longitudine: {area.longitudine}</li>
                        <li>Polling Time: {area.polling}</li>
                        <li>
                            Modifica Luminosit&agrave; Area: <span>  </span>  
                                <select
                                    name="lum"
                                    className="form-group"
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
                        </li>
                    </ul>
                    <h2>Lampioni Collegati</h2>
                    <div className="row">
                        <LampTable
                            lampioni={area.lampioni}
                            areaId={area.id}
                            onLampioneDeleted={(id) => {
                                setArea((currentArea) => {
                                    if (currentArea) {
                                        return {
                                            ...currentArea,
                                            lampioni:
                                                currentArea.lampioni.filter(
                                                    (lampione) =>
                                                        lampione.id !== id
                                                ),
                                        };
                                    } else {
                                        return null;
                                    }
                                });
                            }}
                        />
                    </div>
                    <h2>Sensori Collegati</h2>
                    <div className="row">
                        <SensorTable
                            sensori={area.sensori}
                            areaId={area.id}
                            onSensoreDeleted={(id) => {
                                setArea((currentArea) => {
                                    if (currentArea) {
                                        return {
                                            ...currentArea,
                                            sensori: currentArea.sensori.filter(
                                                (sensore) => sensore.id !== id
                                            ),
                                        };
                                    } else {
                                        return null;
                                    }
                                });
                            }}
                        />
                    </div>
                </div>
            ) : (
                <p>Nessun dato disponibile</p>
            )}
            <Link to="/" type="button" className="btn btn-primary">
                Indietro
            </Link>
        </div>
    );
};

export default AreaSingleView;
