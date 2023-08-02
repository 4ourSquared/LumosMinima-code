const areas = db.aree.find().toArray();
const lamps = db.lampioni.find().toArray();
const sensors = db.sensori.find().toArray();

// Per ogni area
areas.forEach((area) => {
    const areaLamps = lamps.filter((lamp) => lamp.area === area.id);
    const areaSensors = sensors.filter((sensor) => sensor.area === area.id);

/*
    TO-DO: da capire se passare l'id del lampione che abbiamo definito noi o quello creato tramite hashmap dal db
*/

  // Aggiungi i riferimenti ai lampioni e ai sensori nell'area corrispondente
    db.aree.updateOne(
        { _id: area._id },
        { $set: { lampioni: areaLamps.map((lamp) => lamp._id.toString()), sensori: areaSensors.map((sensor) => sensor._id.toString()) } }
    );
});
