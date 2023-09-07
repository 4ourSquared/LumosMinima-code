import React from "react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbProps {}

const breadcrumbMap: { [key: string]: string } = {
  "/": "",
  "/api/aree/add": "Aggiunta Area",
  "/api/aree/:id": "Info Area",
  "/api/aree/:areaId/lampioni/add": "Aggiunta Lampione",
  "/api/aree/:areaId/sensori/add": "Aggiunta Sensore",
  "/api/aree/:areaId/lampioni/:id": "Info Lampione",
  "/api/aree/:areaId/sensori/:id": "Info Sensore",
  "/api/aree/edit/:id": "Modifica Area",
  "/api/aree/:areaId/sensori/edit/:id": "Modifica Sensore",
  "/api/aree/:areaId/lampioni/edit/:id": "Modifica Lampione",
  //Aggiungere qui gli altri path
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

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        <li className="breadcrumb-item">
          {descrizione ? breadcrumbMap[descrizione] : "Pagina Sconosciuta"}
        </li>
      </ol>
    </nav>
  );
};
export default Breadcrumb;
