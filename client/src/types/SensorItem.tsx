//INTERFACCIA: serve ad ottenere le info sul tipo di file che stiamo importando
//dalla richiesta GET al server

interface SensorItem {
  id: number;
  IP: string;
  luogo: string;
  raggio: number;
  area: number;
  sig_time: number;
}

export default SensorItem;