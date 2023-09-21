import { Component } from "react";
import NewUserForm from "./NewUserForm";
import Header from "./Header";
import Footer from "./Footer";

export default class NewUserPage extends Component {
    render() {
        return (
            <>
                <Header />
                <NewUserForm />
                <Footer />
            </>
        );
    }
}