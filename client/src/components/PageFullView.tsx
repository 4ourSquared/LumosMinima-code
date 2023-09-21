import { Component } from 'react';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';

export default class PageFullView extends Component{
render(){
    return (
            <>
                <Header />
                <Content />
                <Footer />
            </>
    )
}
}