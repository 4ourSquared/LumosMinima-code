import React, { Component } from "react";
import Footer from "./Footer";
import Header from "./Header";
import LampGuastiTable from "./LampGuastiTable";

export default class LampGuastiPage extends Component<{ areaId: number }> {
  render() {
    const { areaId } = this.props;
    return (
      <>
        
        <Header />
        <h2>Lista degli impianti luminosi guasti</h2>
        <LampGuastiTable areaId={areaId} />
        <Footer />
        
      </>
    );
  }
}
