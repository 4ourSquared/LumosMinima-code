"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lampione = void 0;
/*
 *   CLASSE LAMPIONE: classe di base per il lampione, contiene le informazioni necessarie per il funzionamento minimo.
 */
class Lampione {
    // Costruttore
    constructor(id = 0, stato, lum, luogo, area) {
        this.id = id;
        this.stato = stato;
        this.lum = lum;
        this.luogo = luogo;
        this.area = area;
        this.isGuasto = false;
    }
    // Interfaccia
    getId() {
        return this.id;
    }
    getStato() {
        return this.stato;
    }
    getLum() {
        return this.lum;
    }
    getLuogo() {
        return this.luogo;
    }
    getArea() {
        return this.area;
    }
    getGuasto() {
        return this.isGuasto;
    }
    setStato(stato) {
        this.stato = stato;
    }
    setLum(lum) {
        this.lum = lum;
    }
    setLuogo(luogo) {
        this.luogo = luogo;
    }
    setArea(area) {
        this.area = area;
    }
    setGuasto(value) {
        this.isGuasto = value;
    }
}
exports.Lampione = Lampione;
