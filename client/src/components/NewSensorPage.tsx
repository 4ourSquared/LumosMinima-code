import React, { Component } from "react";
import NewSensorForm from "./NewSensorForm";
import Header from "./Header";
import Footer from "./Footer";

/*
  CLASS NEWSENSPAGE: classe che renderizza automaticamente l'intera pagina contenente il form per l'aggiunta di un nuovo sensore.
*/
export default class NewSensorPage extends Component<{ areaId: number }> {
  render() {
    const { areaId } = this.props;
    return (
      <>
        <Header />
        <NewSensorForm areaId={areaId} />
        <Footer />
      </>
    );
  }
}
