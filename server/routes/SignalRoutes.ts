import axios from "axios";
import { Request, Response, Router } from "express";
import authByRole, { Role } from "../middleware/AuthByRole";
import verifyToken from "../middleware/VerifyToken";
import AreaSchema from "../schemas/AreaSchema";
import { ILampSchema } from "../schemas/LampSchema";
import TokenSchema from "../schemas/TokenSchema";
import { generateTokenId, turnOffLamps } from "../utils/LightManagement";
import { generateSchedule } from "../utils/Schedule";

const signalRoutes = Router();
/*
    RISORSE
*/

let startingLum: number[][] = [];

/*
    REDIRECT DELLE RICHIESTE
*/

// Visto che il segnale inviato dal sensore è unico, questo verrà gestito da questa route per inviarlo ai due endpoint corretti, ossia quello per i lampioni push e a quello per i lampioni pull

const baseURL = "http://localhost:5000/api/segnale/";

signalRoutes.post(
  "/area/:idA/sensore/:idS/new",
  async (req: Request, res: Response) => {
    const { idA, idS } = req.params;

    try {
      const token = await TokenSchema.findOne({ area: idA })
        .sort({ id: -1 })
        .exec();
      const area = await AreaSchema.findOne({ id: idA });
      let sensoreData = null;

      if (area) {
        sensoreData = area.sensori.find(
          (sens) => sens.id === parseInt(idS, 10)
        );
      }

      if (token && token.expiring > new Date() && sensoreData) {
        token.expiring = new Date(Date.now() + 1000 * sensoreData.sig_time);
        await token.save();
      } else {
        const area = await AreaSchema.findOne({ id: idA });
        if (area) {
          startingLum[area.id] = area.lampioni.map((lamp) => lamp.lum);
        }
        const urlPart1 = `area/${encodeURIComponent(
          idA
        )}/sensore/${encodeURIComponent(idS)}`;
        await axios.post(urlPart1, null, { baseURL });
        await axios.get(`area/${encodeURIComponent(idA)}`, { baseURL });
      }

      res.status(200).json("Successo");
    } catch (error) {
      console.log("Errore nel routing del segnale");
      console.error(error);
      res.status(500).json("Errore nel routing del segnale");
    }
  }
);

/*
    GESTIONE PULL
*/

// Generazione del token
signalRoutes.post(
  "/area/:idA/sensore/:idS",
  async (req: Request, res: Response) => {
    const { idA, idS } = req.params;

    console.log(
      `Richiesta POST ricevuto a api/segnale/area/${idA}/sensore/${idS}`
    );

    try {
      // Generazione del token
      const tokenId = await generateTokenId();
      console.log("Token generato:", tokenId);
      const area = await AreaSchema.findOne({ id: idA });
      console.log("Area:", area);

      if (area) {
        const sensoreData = area.sensori.find(
          (sens) => sens.id === parseInt(idS, 10)
        );

        if (sensoreData) {
          const token = new TokenSchema({
            id: tokenId,
            area: idA,
            expiring: new Date(Date.now() + 1000 * sensoreData.sig_time),
            used: false,
          });

          // Salvataggio del token
          await token.save();
        }
      }

      res.status(200).json("Token generato con successo");
    } catch (error) {
      res.status(500).json({
        error: "Errore nella generazione del token ",
      });
    }
  }
);

// Ricerca e verifica del token
signalRoutes.get("/area/:id/token", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const token = await TokenSchema.findOne({ area: id })
      .sort({ id: -1 })
      .exec();
    const areaMod = await AreaSchema.findOne({ id });
    if (!token) {
      return res.status(498).json({ error: "Errore nel recupero del token" });
    }
    if (!areaMod) {
      return res.status(400).json({ error: "Errore nel recupero dell'area" });
    }

    const now = new Date();
    console.log("Token:", token);
    console.log(token.expiring);
    console.log("now:", now);
    console.log(token.expiring < now);

    if (token.expiring < now) {
      if (token.used === false) {
        return res.status(218).json("This is fine");
      } else {
        token.used = false;
        console.log("Inizio Save spegnimento lampioni");
        await token.save();
        await turnOffLamps(startingLum[areaMod.id], areaMod, res);
        return res.status(200).json("Spegnimento lampioni");
      }
    } else {
      if (token.used === false) {
        token.used = true;
        await token.save();

        console.log("Inizio accensione lampioni");
        areaMod.lampioni.forEach((lamp) => {
          if (lamp.mode === "manuale" && lamp.stato === "Attivo") {
            console.log("Accensione Lampione:", lamp.id);
            lamp.lum = 10;
          }
        });
        console.log("Fine accensione lampioni");
        await areaMod.save();
        return res.status(200).json("Accensione lampioni");
      } else {
        return res.status(226).json("Token Utilizzato");
      }
    }
  } catch (error) {
    console.log("Errore:", error);
    return res
      .status(500)
      .json({ error: "Errore nell'esecuzione del processo" });
  }
});

/*
    GESTIONE PUSH
*/

// Accensione e spegnimento dei lampioni push
signalRoutes.get("/area/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(`Segnale ricevuto a /api/segnale/area/${id}`);

  try {
    console.log("Recupero area");
    const areaMod = await AreaSchema.findOne({ id: id });

    if (!areaMod) {
      console.log("Area non trovata");
      res.status(400).json({
        error: "Errore nel processo: errore nel recupero dell'area",
      });
    } else {
      // Accensione lampioni
      console.log("Inizio accensione lampioni");
      areaMod.lampioni.forEach((lamp: ILampSchema) => {
        if (lamp.mode == "automatico" && lamp.stato === "Attivo") lamp.lum = 10;
      });
      console.log("Fine accensione lampioni");
      await areaMod.save();

      setTimeout(async () => {
        await turnOffLamps(startingLum[areaMod.id], areaMod, res);
      }, 25000);

      res.status(200).json("Successo");
    }
  } catch (error) {
    console.log("Errore: ", error);
    res.status(500).json("Errore");
  }
});

// Generazione della Schedule
generateSchedule();

export default signalRoutes;
