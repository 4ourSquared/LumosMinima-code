import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import Footer from "./Footer";
import Header from "./Header";

interface EditUserFormProps {
    username: string;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ username }) => {
    axios.defaults.baseURL = "http://localhost:5000/accounting";
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState({
        email: "",
        privilege: "",
    });

    useEffect(() => {
        axios
            .get(`/user/${username}`)
            .then((response) => {
                setUser(response.data);
                setIsLoading(false);
            })
            .catch((err) => console.log(err));
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />
            <Formik
                initialValues={{
                    email: user.email || "",
                    privilege: user.privilege || 0,
                }}
                onSubmit={(values, { setSubmitting }) => {
                    const url = "/user";
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
                        <label htmlFor="email">Email</label>
                        <Field
                            type="text"
                            name="email"
                            className="form-control"
                        />
                        <ErrorMessage name="email" component="div" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="privilege">Privilege</label>
                        <Field
                            name="privilege"
                            as="select"
                            className="form-group"
                        >
                            <option value="1">Utente</option>
                            <option value="2">Manutentore</option>
                            <option value="3">Amministratore</option>
                        </Field>
                        <ErrorMessage name="privilege" component="div" />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Modifica
                    </button>
                    <button type="reset" className="btn btn-secondary">
                        Resetta
                    </button>
                    <Link
                        to={`/`}
                        type="button"
                        className="btn btn-outline-primary"
                    >
                        Indietro
                    </Link>
                </Form>
            </Formik>
        </>
    );
};
