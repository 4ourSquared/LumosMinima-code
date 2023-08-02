//INTERFACCIA: serve ad ottenere le info sul tipo di file che stiamo importando
//dalla richiesta GET al server
import SensorItem from './SensorItem';
import LampItem from './LampItem';

interface AreaItem {
    id: number;
    nome: string;
    descrizione: string;
    latitudine: string;
    longitudine: string;
    sensori: SensorItem[];
    lampioni: LampItem[];
}

export default AreaItem;