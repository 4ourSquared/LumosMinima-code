import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik"; //Metodo per creare i form in maniera più semplice e funzionale
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup"; //Libreria per la validazione del form: si può usare anche per il login

/*
  CLASSE NEWSENSFORM: classe che renderizza automaticamente la struttura HTML della pagina di aggiunta di un sensore, definendo anche il metodo per la trasmissione dei dati al server. Stile associato a Bootstrap.
*/
const NewSensorForm: React.FC<{ areaId: number }> = ({ areaId }) => {
  axios.defaults.baseURL = "http://localhost:5000/api"; //URL base, così una volta in produzione basta cambiare questo
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        id: 0,
        IP: "",
        luogo: "",
        raggio: 0,
        sig_time: 20,
        area: areaId,
      }}
      validationSchema={Yup.object({
        IP: Yup.string()
          .matches(
            /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/,
            "Deve essere un indirizzo IP valido"
          )
          .required("Campo obbligatorio")
          .trim(),
        luogo: Yup.string()
          .min(2, "Inserisci almeno 2 caratteri")
          .required("Campo obbligatorio")
          .trim(),
      })}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values);
        axios.post(`/aree/${values.area.toString()}/sensori`, values); // Solito invio dei dati al server
        setSubmitting(false); //Serve a resettare la submit del form e riportarla False
        navigate(`/api/aree/${areaId}`);
      }}
    >
      <Form>
        <div className="form-group">
          <label htmlFor="id">ID (Automatico)</label>
          <Field name="id" type="text" className="form-control" readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="IP">Indirizzo IP</label>
          <Field
            name="IP"
            type="text"
            className="form-control"
            id="IP"
            placeholder=""
          />
          <ErrorMessage name="IP" component="div" className="error-message" />
        </div>
        <div className="form-group">
          <label htmlFor="Locazione">Luogo di Installazione</label>
          <Field
            name="luogo"
            type="text"
            className="form-control"
            id="luogo"
            aria-describedby="luogoHelp"
            placeholder=""
          />
          <ErrorMessage
            name="luogo"
            component="div"
            className="error-message"
          />
          <small id="locazioneHelp" className="form-text text-muted">
            Indica il luogo in cui è situato il sensore.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="raggio">Raggio d'azione</label>
          <Field name="raggio" as="select" className="form-group">
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
            type="number"
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
            Indica la durata in secondi della segnalazione di movimento, utile
            qualora un lampione della zona interagisca in modalità pull.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="area">ID Area di Riferimento</label>
          <Field name="area" type="number" className="form-control" readOnly />
        </div>
        <button type="submit" className="btn btn-primary add">
          Crea
        </button>
        <button type="reset" className="btn btn-secondary reset">
          Resetta
        </button>
        <Link
          to={`/api/aree/${areaId}`}
          type="button"
          className="btn btn-outline-primary back"
        >
          Indietro
        </Link>
      </Form>
    </Formik>
  );
};
export default NewSensorForm;
