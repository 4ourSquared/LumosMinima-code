import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import LampItem from "../types/LampItem";
import Footer from "./Footer";
import Header from "./Header";

interface EditLampFormProps {
    areaId: number;
    lampioneId: number;
}

const EditLampForm: React.FC<EditLampFormProps> = ({ areaId, lampioneId }) => {
    axios.defaults.baseURL = "http://localhost:5000/api";
    const navigate = useNavigate();
    const { id: paramId } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [lampioneData, setLampioneData] = useState<LampItem>({
        id: Number(paramId),
        stato: "",
        lum: 0,
        luogo: "",
        area: 0,
        guasto: false,
        mode: "manuale",
    });

    useEffect(() => {
        if (lampioneId !== 0) {
            axios
                .get<LampItem>(`/aree/${areaId}/lampioni/${lampioneId}`)
                .then((response) => {
                    setLampioneData(response.data);
                    setIsLoading(false);
                })
                .catch((err) => console.log(err));
        }
    }, []); //Dipendenze vuote significa che viene eseguito solo al montaggio

    if (isLoading) {
        return <div>Loading...</div>; // Banner per ingannare l'attesa del caricamento
    }

    return (
        <Formik
            initialValues={{
                id: lampioneData.id || 0,
                stato: lampioneData.stato || "",
                lum: lampioneData.lum || 0,
                luogo: lampioneData.luogo || "",
                mode: lampioneData.mode || "manuale",
                area: lampioneData.area || 0,
            }}
            validationSchema={Yup.object({
                luogo: Yup.string()
                    .min(2, "Inserisci almeno 2 caratteri")
                    .required("Campo obbligatorio")
                    .trim(),
            })}
            onSubmit={(values, { setSubmitting }) => {
                const url = `aree/${areaId}/lampioni/edit/${lampioneId}`;
                axios
                    .put(url, values)
                    .then(() => {
                        navigate(`/api/aree/${areaId}`);
                    })
                    .catch((err) => console.log(err))
                    .finally(() => {
                        setSubmitting(false);
                    });
            }}
        >
            <Form>
                <div className="form-group">
                    <label htmlFor="id">ID (Automatico)</label>
                    <Field
                        name="id"
                        type="text"
                        className="form-control"
                        readOnly
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="stato">Stato</label>
                    <Field name="stato" as="select">
                        <option value="Attivo">Attivo</option>
                        <option value="Disattivo">Disattivo</option>
                    </Field>
                </div>

                <div className="form-group">
                    <label htmlFor="lum">Intensit&agrave;</label>
                    <Field name="lum" as="select" className="form-group">
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
                    </Field>
                    <small id="intensityHelp" className="form-text text-muted">
                        Indica l'intensit&agrave; luminosa del lampione qualora
                        fosse importato lo stato di attivazione.
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="luogo">Luogo di Installazione</label>
                    <Field
                        name="luogo"
                        type="text"
                        className="form-control"
                        id="luogo"
                        aria-describedby="luogoHelp"
                        placeholder=""
                    />
                    <small id="luogoHelp" className="form-text text-muted">
                        Indica il luogo in cui è situato il lampione.
                    </small>
                    <ErrorMessage name="luogo" />
                </div>
                <div className="form-group">
                    <label htmlFor="mode">Interazione</label>
                    <Field name="mode" as="select" className="form-control">
                        <option value="manuale">Manuale</option>
                        <option value="automatico">Automatico</option>
                    </Field>
                    <small id="statusHelp" className="form-text text-muted">
                        Indica se il sensore ha un controllo sui lampioni
                        (automatico) o se i lampioni saranno modificati
                        manualmente da un utente.
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="area">ID Area di Riferimento</label>
                    <Field
                        name="area"
                        type="text"
                        className="form-control"
                        readOnly
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Modifica
                </button>
                <button type="reset" className="btn btn-secondary">
                    Resetta
                </button>
                <Link
                    to={`/api/aree/${areaId}`}
                    type="button"
                    className="btn btn-outline-primary"
                >
                    Indietro
                </Link>
            </Form>
        </Formik>
    );
};

export default EditLampForm;
