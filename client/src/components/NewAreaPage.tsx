import React, {Component} from "react";
import NewAreaForm from "./NewAreaForm";
import Header from "./Header";
import Footer from "./Footer";

/*
  CLASS NEWAREAPAGE: classe che renderizza automaticamente l'intera pagina contenente il form per l'aggiunta di una nuova area illuminata.
*/
export default class NewAreaPage extends Component {
  render() {
    return (
      <>
        <Header />
        <NewAreaForm />
        <Footer />
      </>
    );
  }
};
