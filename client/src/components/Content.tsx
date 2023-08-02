import React, {Component} from 'react'
import AreaTable from './AreaTable'

/*
    CLASSE CONTENT: classe che renderizza automaticamente il content. Stile associato a Bootstrap.
    ATTENZIONE: attualmente questa classe renderizza solamente la table del lampione e del sensore. Probabilmente in futuro verrà rimossa a favore del routing base
*/ 
export default class Content extends Component{
    render(){
        return(
            <main>
                <h2>Aree illuminate</h2>
                <div className='row'>
                    <AreaTable/>
                </div>
            </main>
        )
    }
}