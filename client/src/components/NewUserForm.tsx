import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import UserItem from "../types/UserItem";

const NewUserForm: React.FC = () => {
    axios.defaults.baseURL = "http://localhost:5000/accounting";
    const navigate = useNavigate();

    const initialValues: UserItem = {
        username: "",
        email: "",
        password: "",
        privilege: 0,
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting }) => {
                axios.post("/signup", values);
                setSubmitting(false);
                navigate("/");
            }}
        >
            <Form>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <Field
                        name="username"
                        type="text"
                        className="form-control"
                    />
                    <ErrorMessage
                        name="username"
                        component="div"
                        className="text-danger"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <Field name="email" type="text" className="form-control" />
                    <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <Field
                        name="password"
                        type="text"
                        className="form-control"
                    />
                    <ErrorMessage
                        name="password"
                        component="div"
                        className="text-danger"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="privilege">Privilege</label>
                    <br />
                    <Field name="privilege" as="select" className="form-group">
                        <option value="1">Utente</option>
                        <option value="2">Manutentore</option>
                        <option value="3">Amministratore</option>
                    </Field>
                    <ErrorMessage name="privilege" component="div" />
                </div>

                <div className="form-group">
                    <button type="submit" className="btn btn-primary mr-2">
                        Aggiungi
                    </button>
                    <Link to="/" className="btn btn-secondary">
                        Annulla
                    </Link>
                </div>
            </Form>
        </Formik>
    );
};

export default NewUserForm;
