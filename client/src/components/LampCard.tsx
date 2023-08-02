import React, {Component} from 'react';

import lamp_on from '../img/lamp_on.png'

/*
    CLASSE LAMPIONECARD: classe che renderizza automaticamente la vista sotto forma di card di un lampione. Stile associato a Bootstrap.
    ATTENZIONE: classe in disuso per passaggio a stile tabellare. Da rimuovere appena possibile.
*/
export class LampCard extends Component{
    render(){
        return(
            <div className='col'>
                <div className="card" style={{width:'10em', textAlign:'center', border: '1px solid black', margin: '0.5em'}}>
                    <img className="card-img-top" src={lamp_on} alt="Card image cap"/>
                    <div className="card-body">
                        <p className="card-text">[Lamp Data]</p>
                    </div>
                </div>
            </div>
        )
    }
}