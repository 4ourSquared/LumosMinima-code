import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import useLogoutMechanism from "../auth/LogoutMechanism";

/*
    CLASSE BREADCRUMB: renderizza automaticamente il breadcrumb della pagina. Stile associato a Bootstrap. 
    ATTENZIONE: non esportare questo componente, viene richiamato solamente dalla classe Header sotto descritta
*/
class Breadcrumb extends Component {
    render() {
        return (
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item active" aria-current="page">
                        Home
                    </li>
                </ol>
            </nav>
        );
    }
}

/*
    CLASSE HEADER: renderizza automaticamente l'header della pagina (breadcrumb incluso). Stile associato a Bootstrap.
*/
export default function Header() {
    const navigate = useNavigate();
    const logout = useLogoutMechanism();

    const prepareLogout = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (await logout()) navigate("/login");
    };

    return (
        <header>
            <h1>Lumos Minima</h1>
            <button
                onClick={(e) => {
                    prepareLogout(e);
                }}
                className="btn btn-primary"
                style={{ float: "right" }}
            >
                {" "}
                Esci{" "}
            </button>
            <Breadcrumb />
        </header>
    );
}
