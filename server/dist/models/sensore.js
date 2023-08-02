"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sensore = void 0;
/*
 *   CLASSE SENSORE: classe di base per il sensore, contiene le informazioni necessarie per il funzionamento minimo.
 */
class Sensore {
    // Costruttore
    constructor(id = 0, iter = "manuale", IP, luogo, raggio, area) {
        this.id = id;
        this.iter = iter;
        this.IP = IP;
        this.luogo = luogo;
        this.raggio = raggio;
        this.area = area;
    }
    // Interfaccia
    getId() {
        return this.id;
    }
    getIter() {
        return this.iter;
    }
    getIP() {
        return this.IP;
    }
    getLuogo() {
        return this.luogo;
    }
    getRaggio() {
        return this.raggio;
    }
    getArea() {
        return this.area;
    }
    setIter(iter) {
        this.iter = iter;
    }
    setIP(IP) {
        this.IP = IP;
    }
    setLuogo(luogo) {
        this.luogo = luogo;
    }
    setRaggio(raggio) {
        this.raggio = raggio;
    }
    setArea(area) {
        this.area = area;
    }
}
exports.Sensore = Sensore;
