import AreaSchema from "../schemas/AreaSchema";

// GENERAZIONE ID INCREMENTALE PER LAMPIONI
export async function generateLampId(areaId: number): Promise<number> {
  try {
    const area = await AreaSchema.findOne({ id: areaId }).exec();

    if (!area) {
      throw new Error(`Area con ID ${areaId} non trovata.`);
    }

    const newLampId = area.lampioni.length + 1;

    return newLampId;
  } catch (error) {
    console.error("Errore durante la generazione dell'ID del lampione:", error);
    throw error;
  }
}

// GENERAZIONE ID INCREMENTALE PER SENSORI
export async function generateSensId(areaId: number): Promise<number> {
  try {
    const area = await AreaSchema.findOne({ id: areaId }).exec();

    if (!area) {
      throw new Error(`Area con ID ${areaId} non trovata.`);
    }

    const newSensId = area.sensori.length + 1;

    return newSensId;
  } catch (error) {
    console.error("Errore durante la generazione dell'ID del sensore:", error);
    throw error;
  }
}
