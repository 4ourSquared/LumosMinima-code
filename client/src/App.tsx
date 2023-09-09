import './App.css';
import axios from "axios"

// Importazione Componenti
import RouterComponent from './routing/RouterComponent';

axios.defaults.withCredentials = true

export default function App(){
  return(
    <RouterComponent/>
  )
}

