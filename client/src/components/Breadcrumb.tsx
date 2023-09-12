import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useLogoutMechanism from "../auth/LogoutMechanism";

interface BreadcrumbProps {}

const breadcrumbMap: { [key: string]: string } = {
  "/": "",
  "/api/aree/add": "Aggiunta Area",
  "/api/aree/:id": "Info Area",
  "/api/aree/:areaId/lampioni/add": "Aggiunta Lampione",
  "/api/aree/:areaId/sensori/add": "Aggiunta Sensore",
  "/api/aree/:areaId/lampioni/edit/:id": "Modifica Lampione",
  "/api/aree/:areaId/lampioni/:id": "Info Lampione",
  "/api/aree/:areaId/sensori/:id": "Info Sensore",
  "/api/aree/edit/:id": "Modifica Area",
  "/api/aree/:areaId/sensori/edit/:id": "Modifica Sensore",
  "/api/aree/:areaId/lampioni/guasti": "Lista Lampioni Guasti",
};

/*
    CLASSE BREADCRUMB: renderizza automaticamente il breadcrumb della pagina. Stile associato a Bootstrap. 
*/

const Breadcrumb: React.FC<BreadcrumbProps> = () => {
  const location = useLocation();
  const path = location.pathname;
  const descrizione = Object.keys(breadcrumbMap).find((key) =>
    new RegExp(`^${key.replace(/:\w+/g, "\\w+")}$`).test(path)
  );

  const navigate = useNavigate();
  const logout = useLogoutMechanism();

  const prepareLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (await logout()) navigate("/login");
  };

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        <li className="breadcrumb-item">
          {descrizione ? breadcrumbMap[descrizione] : "Pagina Sconosciuta"}
        </li>
        <button
          onClick={(e) => {
            prepareLogout(e);
          }}
          className="btn btn-danger logout"
        >
          {" "}
          Esci{" "}
        </button>
      </ol>
    </nav>
  );
};
export default Breadcrumb;
