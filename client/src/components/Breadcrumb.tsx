import React from "react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbProps {}

const breadcrumbMap: { [key: string]: string } = {
  "/": "Home",
  "/api/aree/add": "Aggiunta Area",
  "/api/aree/:id": "Info Area",
  "/api/aree/:areaId/lampioni/add": "Aggiunta Lampione",
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
