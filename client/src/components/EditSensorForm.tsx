import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import SensorItem from "../types/SensorItem";

interface EditSensorFormProps {
    areaId: number;
    sensoreId: number;
}

const EditSensorForm: React.FC<EditSensorFormProps> = ({
    areaId,
    sensoreId,
}) => {
    axios.defaults.baseURL = "http://localhost:5000/api";
    const navigate = useNavigate();
    const { id: paramId } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [sens, setSens] = useState<SensorItem>({
        id: Number(paramId),
        IP: "",
        luogo: "",
        raggio: 0,
        sig_time: 20,
        area: 0,
    });

    useEffect(() => {
        if (sensoreId !== 0) {
            axios
                .get<SensorItem>(`/aree/${areaId}/sensori/${sensoreId}`)
                .then((response) => {
                    setSens(response.data);
                    setIsLoading(false);
                })
                .catch((err) => console.log(err));
        }
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Formik
            initialValues={{
                id: sens.id || 0,
                IP: sens.IP || "",
                luogo: sens.luogo || "",
                raggio: sens.raggio || 0,
                sig_time: sens.sig_time || 20,
                area: sens.area || 0,
            }}
            validationSchema={Yup.object({
                IP: Yup.string()
                    .matches(
                        /^(?:\d{1,3}\.){3}\d{1,3}$/,
                        "Deve essre un indirizzo IP valido"
                    )
                    .required("Campo obbligatorio")
                    .trim(),
                luogo: Yup.string()
                    .min(2, "Inserisci almeno 2 caratteri")
                    .required("Campo obbligatorio")
                    .trim(),
            })}
            onSubmit={(values, { setSubmitting }) => {
                const url = `aree/${areaId}/sensori/edit/${sensoreId}`;
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
                    <label htmlFor="IP">Indirizzo IP</label>
                    <Field name="IP" type="text" className="form-control" />
                    <small id="IPHelp" className="form-text text-muted">
                        Indica l'indirizzo IP del sensore.
                    </small>
                    <ErrorMessage name="IP" />
                </div>

                <div className="form-group">
                    <label htmlFor="luogo">Luogo di Installazione</label>
                    <Field name="luogo" type="text" className="form-control" />
                    <small id="locazioneHelp" className="form-text text-muted">
                        Indica il luogo in cui è situato il sensore.
                    </small>
                    <ErrorMessage name="luogo" />
                </div>

                <div className="form-group">
                    <label htmlFor="raggio">Raggio d'azione</label>
                    <Field name="raggio" as="select" className="form-control">
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
                        Indica il raggio d'azione (in metri) del sensore.
                    </small>
                </div>
                <div className="form-group">
                    <label htmlFor="sig_time">Durata della Segnalazione</label>
                    <Field
                        name="sig_time"
                        type="text"
                        className="form-control"
                        id="sig_time"
                        aria-describedby="sig_timeHelp"
                        placeholder=""
                    />
                    <ErrorMessage
                        name="sig_time"
                        component="div"
                        className="error-message"
                    />
                    <small id="sig_timeHelp" className="form-text text-muted">
                        Indica la durata in secondi della segnalazione di
                        movimento, utile qualora un lampione della
                        zona interagisca in modalità pull.
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

export default EditSensorForm;
