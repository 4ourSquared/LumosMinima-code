import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik"; //Metodo per creare i form in maniera più semplice e funzionale
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup"; //Libreria per la validazione del form: si può usare anche per il login

/*
  CLASSE NEWLAMPFORM: classe che renderizza automaticamente la struttura HTML della pagina di aggiunta di un lampione, definendo anche il metodo per la trasmissione dei dati al server. Stile associato a Bootstrap.
*/

const NewLampForm: React.FC<{ areaId: number }> = ({ areaId }) => {
    axios.defaults.baseURL = "http://localhost:5000/api"; //URL base, così una volta in produzione basta cambiare questo
    const navigate = useNavigate();

    return (
        <Formik
            initialValues={{
                id: 0,
                mode: "manuale",
                stato: "Attivo",
                lum: 0,
                luogo: "",
                area: areaId,
            }}
            validationSchema={Yup.object({
                luogo: Yup.string()
                    .min(2, "Inserisci almeno 2 caratteri")
                    .required("Campo obbligatorio")
                    .trim(), //Grazie a questo pulisce il campo da spazi bianchi ed evito che il campo sia vuoto
                //Inoltre il form non si completa fino a che il campo non viene
                //riempito correttamente
            })}
            onSubmit={(values, { setSubmitting }) => {
                axios.post(`/aree/${values.area.toString()}/lampioni`, values);
                setSubmitting(false); //Serve a resettare la submit del form e riportarla False
                navigate(`/api/aree/${areaId}`);
            }}
        >
            <Form>
                <div className="form-group">
                    <label htmlFor="stato">Stato</label>
                    <br/>
                    <Field name="stato" as="select">
                        <option value="Attivo">Attivo</option>
                        <option value="Disattivo">Disattivo</option>
                    </Field>
                </div>

                <div className="form-group">
                    <label htmlFor="lum">Intensit&agrave;</label>
                    <br/>
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
                    <br/>
                    <small id="intensityHelp" className="form-text text-muted">
                        Indica l'intensit&agrave; luminosa del lampione qualora
                        fosse importato lo stato di attivazione.
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="luogo">Luogo di Installazione</label>
                    <Field
                        data-testid="luogo"
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
                    <br/>
                    <Field name="mode" as="select">
                        <option value="manuale">Manuale</option>
                        <option value="automatico">Automatico</option>
                    </Field>
                    <br/>
                    <small id="statusHelp" className="form-text text-muted">
                        Indica se il sensore ha un controllo sui lampioni
                        (automatico) o se i lampioni saranno modificati
                        manualmente da un utente
                    </small>
                </div>
                <button type="submit" className="btn btn-primary">
                    Crea
                </button>
                <button type="reset" className="btn btn-secondary">
                    Resetta
                </button>
                <Link to={`/api/aree/${areaId}`} type="button" className="btn btn-outline-primary">
                    Indietro
                </Link>
            </Form>
        </Formik>
    );
};
export default NewLampForm;
