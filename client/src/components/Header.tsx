import { useConfirm } from "material-ui-confirm";
import { useNavigate } from "react-router-dom";
import useLogoutMechanism from "../auth/LogoutMechanism";
import Breadcrumb from "./Breadcrumb";

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
        className="btn btn-danger logout"
      >
        {" "}
        Esci{" "}
      </button>
      <Breadcrumb />
    </header>
  );
}
