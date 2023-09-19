import {Component} from 'react'

/*
    CLASSE FOOTER: classe che renderizza automaticamente il footer della pagina. Stile associato a Bootstrap.
*/
export default class Footer extends Component{
    render(){
        return(
            <footer>
                4ourSquared Team <br/>
                Università degli Studi di Padova <br/>
                Progetto Didattico di SWE
            </footer>
        )
    }
}