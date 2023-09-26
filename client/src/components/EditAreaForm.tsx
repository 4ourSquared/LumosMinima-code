import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import AreaItem from "../types/AreaItem";
import Lampione from "../types/LampItem";
import Sensore from "../types/SensorItem";
import Footer from "./Footer";
import Header from "./Header";

interface EditAreaFormProps {
    areaId: number;
}

const EditAreaForm: React.FC<EditAreaFormProps> = ({ areaId }) => {
    axios.defaults.baseURL = "http://localhost:5000/api";
    const navigate = useNavigate();
    const { id: paramId } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [area, setArea] = useState<AreaItem>({
        id: Number(paramId),
        nome: "",
        descrizione: "",
        latitudine: "",
        longitudine: "",
        polling: 15,
        sensori: [],
        lampioni: [],
    });

    const [availableSensori, setAvailableSensori] = useState<Sensore[]>([]);
    const [availableLampioni, setAvailableLampioni] = useState<Lampione[]>([]);

    useEffect(() => {
        axios
            .get(`aree/${areaId}/sensori`)
            .then((response) => setAvailableSensori(response.data));
        axios
            .get(`aree/${areaId}/lampioni`)
            .then((response) => setAvailableLampioni(response.data));

        if (area.id !== 0) {
            axios
                .get<AreaItem>(`/aree/${areaId}`)
                .then((response) => {
                    setArea(response.data);
                    setIsLoading(false);
                })
                .catch((err) => console.log(err));
        }
    }, [area.id]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <Header/>
            <Formik
                initialValues={{
                    id: area.id || 0,
                    nome: area.nome || "",
                    descrizione: area.descrizione || "",
                    latitudine: area.latitudine || "",
                    longitudine: area.longitudine || "",
                    polling: area.polling || 15,
                    sensori: area.sensori || [], // Aggiunto
                    lampioni: area.lampioni || [], // Aggiunto
                }}
                validationSchema={Yup.object({
                    nome: Yup.string()
                        .min(2, "Inserisci almeno 2 caratteri")
                        .required("Campo obbligatorio")
                        .trim(),
                    descrizione: Yup.string()
                        .min(2, "Inserisci almeno 2 caratteri")
                        .required("Campo obbligatorio")
                        .trim(),
                    latitudine: Yup.string()
                        .required("Campo obbligatorio")
                        .matches(
                            /^-?([0-8]?[0-9]|90)\.[0-9]{1,6}$/,
                            "Inserisci una latitudine valida"
                        ),
                    longitudine: Yup.string()
                        .required("Campo obbligatorio")
                        .matches(
                            /^-?((1?[0-7]?|[0-9]?)[0-9]|180)\.[0-9]{1,6}$/,
                            "Inserisci una longitudine valida"
                        ),
                })}
                onSubmit={(values, { setSubmitting }) => {
                    const url = `/aree/edit/${area.id}`;
                    axios
                        .put(url, values)
                        .then(() => {
                            navigate("/");
                        })
                        .catch((err) => console.log(err))
                        .finally(() => {
                            setSubmitting(false);
                        });
                }}
            >
                <Form>
                    <div className="form-group">
                        <label htmlFor="nome">Nome</label>
                        <Field
                            data-testid="nome"
                            name="nome"
                            type="text"
                            className="form-control"
                        />
                        <ErrorMessage name="nome" data-testid="erroreNome"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="descrizione">Descrizione</label>
                        <Field
                            name="descrizione"
                            as="textarea"
                            className="form-control"
                        />
                        <ErrorMessage name="descrizione" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="latitudine">Latitudine</label>
                        <Field
                            name="latitudine"
                            type="text"
                            className="form-control"
                        />
                        <ErrorMessage name="latitudine" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="longitudine">Longitudine</label>
                        <Field
                            name="longitudine"
                            type="text"
                            className="form-control"
                        />
                        <ErrorMessage name="longitudine" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="polling">Polling Time</label>
                        <Field
                            name="polling"
                            type="text"
                            className="form-control"
                        />
                        <ErrorMessage
                            name="polling"
                            component="div"
                            className="text-danger"
                        />
                        <small
                            id="intensityHelp"
                            className="form-text text-muted"
                        >
                            Indica il tempo in secondi che deve intercorrere tra
                            una verifica e l'altra per rendere possibile
                            l'interazione dei lampioni in modalit&agrave; pull.
                        </small>
                    </div>

                    <button type="submit" className="btn btn-primary add">
                        Modifica
                    </button>
                    <Link
                        to="/"
                        type="button"
                        className="btn btn-outline-primary back"
                    >
                        Indietro
                    </Link>
                </Form>
            </Formik>
            <Footer />
        </>
    );
};
export default EditAreaForm;
