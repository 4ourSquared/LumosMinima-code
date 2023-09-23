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
    //Mock della funzione che individua un'area singola
    areaschema.findOne = jest.fn().mockResolvedValue(area2);

    agent = request.agent(app);
    await agent.post("/accounting/login").send({
      username: "admin",
      password:
        "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
    });
  });

  afterAll(async () => {
    jest.restoreAllMocks();
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

    it("Ritorna 500 se non è possibile recuperare le aree", async () => {
      areaschema.find = jest
        .fn()
        .mockRejectedValue(new Error("Errore indotto"));
      const response = await agent.get("/api/aree/");
      expect(response.status).toBe(500);
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

    it("Ritorna 404 se l'area non è presente", async () => {
      areaschema.findOne = jest.fn().mockResolvedValue(false);
      const response = await agent.get("/api/aree/1");
      expect(response.status).toBe(404);
    });

    it("Ritorna 500 se non è possibile recuperare l'area specificata dall'id fornito", async () => {
      areaschema.findOne = jest
        .fn()
        .mockRejectedValue(new Error("Errore indotto"));
      const response = await agent.get("/api/aree/1");
      expect(response.status).toBe(500);
    });
  });

  describe("Test per la creazione di un'area (POST)", () => {
    const mockSave = jest.spyOn(areaschema.prototype, "save");
    mockSave.mockResolvedValue(true);

    it("Ritorna 200 se l'area viene creata correttamente", async () => {
      const mockSort = jest.fn();
      const mockSelect = jest.fn();
      const mockExec = jest.fn().mockResolvedValue(1);
      (areaschema.findOne as jest.Mock).mockReturnValueOnce({
        sort: mockSort.mockReturnThis(),
        select: mockSelect.mockReturnThis(),
        exec: mockExec,
      });
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
      expect(mockSort).toHaveBeenCalledTimes(1);
      expect(mockSelect).toHaveBeenCalledTimes(1);
      expect(mockExec).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it("Ritorna 500 se l'area non viene creata correttamente", async () => {
      mockSave.mockRejectedValueOnce(new Error("Errore indotto"));
      const mockSort = jest.fn();
      const mockSelect = jest.fn();
      const mockExec = jest.fn().mockResolvedValue(1);
      (areaschema.findOne as jest.Mock).mockReturnValueOnce({
        sort: mockSort.mockReturnThis(),
        select: mockSelect.mockReturnThis(),
        exec: mockExec,
      });
      const response = await agent.post("/api/aree/").send({
        nome: "Area 3",
        descrizione: "Descrizione area 3",
        latitudine: "45.123456",
        longitudine: "9.123456",
        polling: 60,
        lampioni: [],
        sensori: [],
      });
      expect(response.status).toBe(500);
      expect(mockSave).toHaveBeenCalledTimes(2);
    });
  });

  describe("Test per l'aggiornamento di un'area (PUT)", () => {
    it("Ritorna 200 se l'area viene aggiornata correttamente", async () => {
      const mockSaveArea = jest.spyOn(areaschema.prototype, "save");
      (areaschema.findOne as jest.Mock).mockReturnValueOnce({
        id: 2,
        nome: "Area 2",
        descrizione: "Descrizione area 2",
        latitudine: "50.123456",
        longitudine: "13.123456",
        polling: 30,
        lampioni: [],
        sensori: [],
        save: mockSaveArea,
      });
      const response = await agent.put("/api/aree/edit/2").send({
        nome: "Area 3",
        descrizione: "Descrizione area 3",
        latitudine: "45.123456",
        longitudine: "9.123456",
        polling: 60,
      });
      expect(response.status).toBe(200);
      expect(mockSaveArea).toHaveBeenCalledTimes(3);
    });

    it("Ritorna 404 se l'area non viene trovata", async () => {
      const response = await agent.put("/api/aree/edit/").send({});
      expect(response.status).toBe(404);
    });

    it("Ritorna 500 se l'area non viene aggiornata correttamente", async () => {
      const mockSaveErr = jest.spyOn(areaschema.prototype, "save");
      mockSaveErr.mockRejectedValueOnce(new Error("Errore indotto"));
      const response = await agent.put("/api/aree/edit/2").send({});
      expect(response.status).toBe(500);
      expect(mockSaveErr).toHaveBeenCalledTimes(3);
    });
  });

  describe("Test per l'eliminazione di un'area (DELETE)", () => {
    it("Ritorna 200 se l'area viene eliminata correttamente", async () => {
      const mockArea = {
        id: 2,
        nome: "Area 2",
        descrizione: "Descrizione area 2",
        latitudine: "50.123456",
        longitudine: "13.123456",
        polling: 30,
        lampioni: [],
        sensori: [],
      };
      const mockFindOne = jest.spyOn(areaschema, "findOne");
      mockFindOne.mockResolvedValue(mockArea);

      const mockDeleteOne = jest.spyOn(areaschema, "deleteOne");
      mockDeleteOne.mockResolvedValue({ acknowledged: true, deletedCount: 1 });

      const response = await agent.delete("/api/aree/2");
      expect(response.status).toBe(200);
      expect(mockFindOne).toHaveBeenCalledWith({ id: 2 });
      expect(mockDeleteOne).toHaveBeenCalledWith({ id: 2 });

      mockFindOne.mockRestore();
      mockDeleteOne.mockRestore();
    });

    it("Ritorna 404 l'area da eliminare non viene trovata", async () => {
      const mockFindOne = jest.spyOn(areaschema, "findOne");
      mockFindOne.mockResolvedValue(null);
      const mockDeleteOne = jest.spyOn(areaschema, "deleteOne");
      mockDeleteOne.mockResolvedValue({ acknowledged: true, deletedCount: 0 });

      const response = await agent.delete("/api/aree/2");
      expect(response.status).toBe(404);
      expect(mockFindOne).toHaveBeenCalledWith({ id: 2 });

      mockFindOne.mockRestore();
    });

    it("Ritorna 500 se avviene un errore nel processo di eliminazione dell'area", async () => {
      const mockFindOne = jest.spyOn(areaschema, "findOne");
      mockFindOne.mockRejectedValue(new Error("Errore indotto"));
      const mockDeleteOne = jest.spyOn(areaschema, "deleteOne");
      mockDeleteOne.mockResolvedValue({ acknowledged: true, deletedCount: 0 });

      const response = await agent.delete("/api/aree/2");
      expect(response.status).toBe(500);
      expect(mockFindOne).toHaveBeenCalledWith({ id: 2 });

      mockFindOne.mockRestore();
    });
  });
});
