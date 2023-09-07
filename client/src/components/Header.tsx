import Breadcrumb from "./Breadcrumb";

/*
    CLASSE HEADER: renderizza automaticamente l'header della pagina (breadcrumb incluso). Stile associato a Bootstrap.
*/
interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header>
      <h1>Lumos Minima</h1>
      <Breadcrumb />
    </header>
  );
};
export default Header;
