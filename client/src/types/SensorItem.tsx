//INTERFACCIA: serve ad ottenere le info sul tipo di file che stiamo importando
//dalla richiesta GET al server

interface SensorItem {
  id: number;
  iter: string;
  IP: string;
  luogo: string;
  raggio: number;
  area: number;
}

export default SensorItem;