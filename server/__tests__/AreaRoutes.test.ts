import request, { agent } from "supertest";
import areaschema from "../schemas/AreaSchema";
import userschema from "../schemas/UserSchema";
import { app, server } from "../server";
import * as schedule from "../utils/Schedule";
import { updateSchedule } from "../utils/Schedule";

describe("Area Routes", () => {
  let agent: request.SuperAgentTest;

  beforeAll(async () => {
    //Mock di un utente correttamente registrato: la password è "password" ma
    //con un hash sha512 che viene effettuato dal client.
    userschema.findOne = jest.fn().mockResolvedValue({
      username: "admin",
      email: "admin@azienda.com",
      password:
        "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
      privilege: 3,
    });

    const area1 = {
      id: 1,
      nome: "Area 1",
      descrizione: "Descrizione area 1",
      latitudine: "45.123456",
      longitudine: "9.123456",
      polling: 60,
      lampioni: [],
      sensori: [],
    };
    const area2 = {
      id: 2,
      nome: "Area 2",
      descrizione: "Descrizione area 2",
      latitudine: "50.123456",
      longitudine: "13.123456",
      polling: 30,
      lampioni: [],
      sensori: [],
    };

    //Mock della funzione che individua tutte le aree
    areaschema.find = jest.fn().mockResolvedValue(area1);

    areaschema.findOne = jest.fn().mockResolvedValue(area2);

    agent = request.agent(app);
    await agent.post("/accounting/login").send({
      username: "admin",
      password:
        "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
    });
  });

  afterAll(async () => {
    server.close();
  });

  describe("Test per il recupero delle aree (GET)", () => {
    it("Ritorna 200 e la lista di tutte le aree presenti", async () => {
      const response = await agent.get("/api/aree/");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        nome: "Area 1",
        descrizione: "Descrizione area 1",
        latitudine: "45.123456",
        longitudine: "9.123456",
        polling: 60,
        lampioni: [],
        sensori: [],
      });
    });

    it("Ritorna 200 e l'area in base all'id fornito", async () => {
      const response = await agent.get("/api/aree/1");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 2,
        nome: "Area 2",
        descrizione: "Descrizione area 2",
        latitudine: "50.123456",
        longitudine: "13.123456",
        polling: 30,
        lampioni: [],
        sensori: [],
      });
    });
  });
  /* Test della POST di un'area in pausa, causa: capire esattamente che cosa si
    deve mockare

  describe("Test per la creazione di un'area (POST)", () => {
    const mockSave = jest.spyOn(areaschema.prototype, "save");
    mockSave.mockResolvedValue(true);
    

    it("Ritorna 200 se l'area viene creata correttamente", async () => {
      const response = await agent.post("/api/aree/").send({
        nome: "Area 3",
        descrizione: "Descrizione area 3",
        latitudine: "45.123456",
        longitudine: "9.123456",
        polling: 60,
        lampioni: [],
        sensori: [],
      });
      expect(response.status).toBe(200);
      expect(mockSave).toHaveBeenCalledTimes(1);
    });
  });
  */

  describe("Test per l'aggiornamento di un'area (PUT)", () => {
    const mockSave = jest.spyOn(areaschema.prototype, "save");
    const mockSchedule = jest.spyOn(schedule, "updateSchedule");

    it("Ritorna 404 se l'area non viene trovata", async () => {
      areaschema.findOne = jest.fn().mockResolvedValue(false);
      const response = await agent.put("/api/aree/edit/3").send({});
      expect(response.status).toBe(404);
      areaschema.findOne = jest.fn().mockReset();
    });
    /*
    it("Ritorna 200 se l'area viene aggiornata correttamente", async () => {
      areaschema.findById = jest.fn().mockResolvedValue(1);
      const response = await agent.put("/api/aree/edit/1").send({
        nome: "Area 1",
        descrizione: "Descrizione area 1",
        latitudine: "45.123456",
        longitudine: "3.123456",
        polling: 10,
        lampioni: [],
        sensori: [],
      });
      mockSchedule.mockResolvedValueOnce();
      mockSave.mockResolvedValue(true);
      expect(response.status).toBe(200);
      expect(mockSave).toHaveBeenCalledTimes(1);
    });*/
  });

  describe("Test per l'eliminazione di un'area (DELETE)", () => {
    areaschema.deleteOne = jest.fn().mockResolvedValue(true);
    const mockSchedule = jest.spyOn(schedule, "updateSchedule");

    it("Ritorna 404 se l'area non viene trovata", async () => {
      areaschema.findOne = jest.fn().mockResolvedValue(false);
      const response = await agent.delete("/api/aree/delete/3");
      expect(response.status).toBe(404);
      areaschema.findOne = jest.fn().mockReset();
    });

    it("Ritorna 200 se l'area viene eliminata correttamente", async () => {
      areaschema.findById = jest.fn().mockResolvedValue(1);
      const response = await agent.delete("/api/aree/delete/1");
      mockSchedule.mockResolvedValueOnce();
      expect(response.status).toBe(200);
    });
  });
});
