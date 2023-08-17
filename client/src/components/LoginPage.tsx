import React from "react";
import { useNavigate } from "react-router-dom";
import UseLoginMechanism from "../auth/LoginMechanism";

export default async function LoginPage() {
    const navigate = useNavigate();

    const prepareLogin = async (e: React.MouseEvent) => {
        e.preventDefault();
        
        const username: String = (
            document.getElementById("username") as HTMLInputElement
        ).value;

        const password: String = (
            document.getElementById("password") as HTMLInputElement
        ).value;

        if (await UseLoginMechanism(username, password)) {
            navigate("/");

        }
    };
    return (
        <div>
            <h1>Lumos Minima</h1>
            <h2>Login</h2>
            <form className="container">
                <fieldset>
                    <legend>Inserisci le credenziali</legend>
                    <div className="form-group">
                        <label htmlFor="username">Nome utente</label>
                        <input
                            className="form-control"
                            id="username"
                            type="text"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            className="form-control"
                            id="password"
                            type="password"
                        />
                    </div>

                    <div>
                        <button
                            className="btn btn-primary"
                            onClick={(e) => {
                                prepareLogin(e);
                            }}
                        >
                            Entra
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
}
