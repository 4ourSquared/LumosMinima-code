//INTERFACCIA: serve ad ottenere le info sul tipo di file che stiamo importando
//dalla richiesta GET al server

interface LampItem {
  id: number;
  stato: string;
  lum: number;
  luogo: string;
  area: number;
  guasto:boolean;
  mode: string;
}

export default LampItem;
