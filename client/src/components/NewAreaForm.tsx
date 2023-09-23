import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import AreaItem from "../types/AreaItem";

const NewAreaForm: React.FC = () => {
  axios.defaults.baseURL = "http://localhost:5000/api";
  const navigate = useNavigate();

  const initialValues: AreaItem = {
    id: 0,
    nome: "",
    descrizione: "",
    latitudine: "",
    longitudine: "",
    polling: 10,
    sensori: [], // Aggiunto
    lampioni: [] // Aggiunto
  };

  const validationSchema = Yup.object({
    nome: Yup.string().required("Campo obbligatorio").trim(),
    descrizione: Yup.string().required("Campo obbligatorio").trim(),
    latitudine: Yup.string().required("Campo obbligatorio").trim(),
    longitudine: Yup.string().required("Campo obbligatorio").trim(),
  });

  /*
  const handleSubmit = async (values: AreaItem, { setSubmitting }: any) => {
    try {
      await axios.post("/aree", values);
      navigate("/");
    } catch (error) {
      console.error("Error adding area:", error);
    } finally {
      setSubmitting(false);
    }
  };
  */

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        axios.post("/aree", values); // Solito invio dei dati al server
        setSubmitting(false); //Serve a resettare la submit del form e riportarla False
        navigate("/");
      }}
    >
      <Form>
        <div className="form-group">
          <label htmlFor="nome">Nome</label>
          <Field data-testid="nome" name="nome" type="text" className="form-control" />
          <ErrorMessage name="nome" component="div" className="text-danger" />
        </div>

        <div className="form-group">
          <label htmlFor="descrizione">Descrizione</label>
          <Field data-testid="descrizione" name="descrizione" type="text" className="form-control" />
          <ErrorMessage
            name="descrizione"
            component="div"
            className="text-danger"
          />
        </div>

        <div className="form-group">
          <label htmlFor="latitudine">Latitudine</label>
          <Field data-testid="latitudine" name="latitudine" type="text" className="form-control" />
          <ErrorMessage
            name="latitudine"
            component="div"
            className="text-danger"
          />
        </div>

        <div className="form-group">
          <label htmlFor="longitudine">Longitudine</label>
          <Field data-testid="longitudine" name="longitudine" type="text" className="form-control" />
          <ErrorMessage
            name="longitudine"
            component="div"
            className="text-danger"
          />
        </div>
        <div className="form-group">
          <label htmlFor="polling">Polling Time</label>
          <Field data-testid="polling" name="polling" type="text" className="form-control" />
          <ErrorMessage
            name="polling"
            component="div"
            className="text-danger"
          />
          <small id="intensityHelp" className="form-text text-muted">
            Indica il tempo in secondi che deve intercorrere tra una verifica e l'altra per rendere possibile l'interazione dei lampioni in modalit&agrave; pull.
          </small>
        </div>

        <button type="submit" className="btn btn-primary">
          Aggiungi
        </button>
        <Link to="/" type="button" className="btn btn-outline-primary">
          Indietro
        </Link>
      </Form>
    </Formik>
  );
};

export default NewAreaForm;
