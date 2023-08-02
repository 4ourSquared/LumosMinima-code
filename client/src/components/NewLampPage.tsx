import React, { Component } from "react";
import NewLampForm from "./NewLampForm";
import Header from "./Header";
import Footer from "./Footer";

/*
  CLASS NEWLAMPPAGE: classe che renderizza automaticamente l'intera pagina contenente il form per l'aggiunta di un nuovo lampione.
*/
export default class NewLampPage extends Component<{ areaId: number }> {
  render() {
    const { areaId } = this.props;
    return (
      <>
        <Header />
        <NewLampForm areaId={areaId} />
        <Footer />
      </>
    );
  }
}
