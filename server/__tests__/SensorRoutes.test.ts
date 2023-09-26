import request from "supertest";
import areaschema from "../schemas/AreaSchema";
import userschema from "../schemas/UserSchema";
import { app } from "../server";
import * as idgeneration from "../utils/IdGeneration";
jest.mock("mongoose", () => ({
  ...jest.requireActual("mongoose"),
  connect: jest.fn(),
  connection: {
    on: jest.fn(),
    once: jest.fn(),
    close: jest.fn(),
  },
}));

let mockFindOne = jest.fn();
const area = {
  id: 1,
  nome: "Area 1",
  descrizione: "Descrizione area 1",
  latitudine: "45.123456",
  longitudine: "9.123456",
  polling: 60,
  lampioni: [],
  sensori: [
    {
      id: 1,
      stato: "attivo",
      lum: 5,
      luogo: "test",
      area: 1,
      guasto: false,
      mode: "manuale",
    },
    {
      id: 2,
      stato: "attivo",
      lum: 5,
      luogo: "test",
      area: 1,
      guasto: false,
      mode: "manuale",
    },
  ],
};

describe("Sensor Routes", () => {
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

    areaschema.findOne = mockFindOne;
    agent = request.agent(app);
    await agent.post("/accounting/login").send({
      username: "admin",
      password:
        "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
    });
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  describe("Test per il recupero dei sensori di un'area (GET)", () => {
    it("L'area esiste: ritorna 200 e la lista di tutti i sensori presenti", async () => {
      const response = await agent.get("/api/aree/test/sensori");
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: 1,
          stato: "attivo",
          lum: 5,
          luogo: "test",
          area: 1,
          guasto: false,
          mode: "manuale",
        },
        {
          id: 2,
          stato: "attivo",
          lum: 5,
          luogo: "test",
          area: 1,
          guasto: false,
          mode: "manuale",
        },
      ]);
    });

    it("Ritorna 404 se l'area non è presente", async () => {
      mockFindOne.mockResolvedValueOnce(false);
      const response = await agent.get("/api/aree/test/sensori");
      expect(response.status).toBe(404);
    });

    it("Ritorna 500 se non è possibile recuperare l'area specificata dall'id fornito", async () => {
      mockFindOne.mockRejectedValueOnce(new Error("Errore indotto"));
      const response = await agent.get("/api/aree/test/sensori");
      expect(response.status).toBe(500);
    });
  });

  describe("Test per il recupero di un singolo sensore (GET)", () => {
    it("L'area e il sensore richiesti esistono", async () => {
      const response = await agent.get("/api/aree/0/sensori/1");
      console.log(response.body);
      expect(response.status).toBe(200);
    });
    it("L'area esiste, ma non il sensore", async () => {
      const response = await agent.get("/api/aree/0/sensori/3");
      expect(response.status).toBe(404);
    });
    it("L'area non esiste", async () => {
      mockFindOne.mockResolvedValueOnce(false);
      const response = await agent.get("/api/aree/0/sensori/1");
      expect(response.status).toBe(404);
    });
  });

  describe("Test per l'aggiunta di un sensore ad un'area (POST)", () => {
    const mockSave = jest.fn();
    const mockExec = jest.fn().mockResolvedValue(3);
    mockFindOne.mockResolvedValue({ ...area, save: mockSave, exec: mockExec });
    it("Ritorna 200 ed effettua l'inserimento del nuovo sensore", async () => {
      const areaMock = {
        id: 1,
        nome: "Area 1",
        descrizione: "Descrizione area 1",
        latitudine: "45.123456",
        longitudine: "9.123456",
        polling: 60,
        lampioni: [
          {
            id: 1,
            stato: "Attivo",
            lum: 5,
            luogo: "Luogo Test",
            area: 1,
            guasto: false,
            mode: "manuale",
          },
        ],
        sensori: [],
        save: jest.fn(),
      };
      const mockSens = {
        id: 1,
        area: 1,
        IP: "12.223.211.220",
        luogo: "Luogo Test",
        raggio: 5,
        sig_time: 3,
      };
      jest.spyOn(areaschema, "findOne").mockResolvedValue(areaMock);
      jest.spyOn(idgeneration, "generateSensId").mockResolvedValue(2);

      areaMock.sensori.push();

      const response = await agent.post("/api/aree/0/sensori").send({
        id: 1,
        area: 1,
        IP: "12.223.211.220",
        luogo: "Luogo Test",
        raggio: 5,
        sig_time: 3,
      });
      expect(response.status).toBe(200);
    });
    it("Ritorna 400 se l'area non esiste", async () => {
      mockFindOne.mockResolvedValueOnce(null);
      const response = await agent.post("/api/aree/0/sensori").send({
        id: 1,
        area: 1,
        IP: "12.223.211.220",
        luogo: "Luogo Test",
        raggio: 5,
        sig_time: 3,
      });
      expect(response.status).toBe(400);
    });
    it("Ritorna 500 se avviene un errore nel processo di creazione del sensore", async () => {
      mockFindOne.mockRejectedValueOnce(new Error("Errore indotto"));
      const response = await agent.post("/api/aree/0/sensori").send({
        id: 1,
        area: 1,
        IP: "12.223.211.220",
        luogo: "Luogo Test",
        raggio: 5,
        sig_time: 3,
      });
      expect(response.status).toBe(500);
    });
  });

  describe("Test per la modifica di un sensore (PUT)", () => {
    const mockSave = jest.spyOn(areaschema.prototype, "save");
    mockSave.mockResolvedValue(true);
    it("Il sensore che si cerca di modificare esiste", async () => {
      const areaMock = {
        id: 1,
        nome: "Area 1",
        descrizione: "Descrizione area 1",
        latitudine: "45.123456",
        longitudine: "9.123456",
        polling: 60,
        lampioni: [
          {
            id: 1,
            stato: "Attivo",
            lum: 5,
            luogo: "Luogo Test",
            area: 1,
            guasto: false,
            mode: "manuale",
          },
        ],
        sensori: [
          {
            id: 1,
            area: 1,
            IP: "12.223.211.220",
            luogo: "Luogo Test",
            raggio: 5,
            sig_time: 3,
          },
        ],
        save: jest.fn(),
      };
      jest.spyOn(areaschema, "findOne").mockResolvedValue(areaMock);
      areaMock.sensori.find = jest.fn().mockResolvedValue({
        id: 1,
      });
      const response = await agent
        .put("/api/aree/test/sensori/edit/1")
        .send({ luogo: "Test Modifica" });
      expect(response.status).toBe(200);
    });
    it("Ritorna 500 in caso di errore", async () => {
      mockFindOne.mockRejectedValueOnce(new Error("Errore indotto"));
      const response = await agent
        .put("/api/aree/test/sensori/edit/2")
        .send({ luogo: "Test Modifica" });
      expect(response.status).toBe(500);
    });
  });
  describe("Test per la cancellazione di un sensore (DELETE)", () => {
    it("Il sensore che si cerca di cancellare esiste", async () => {
      const mockSave = jest.fn();
      mockSave.mockResolvedValue(true);
      mockFindOne.mockResolvedValue({ ...area, save: mockSave });
      const response = await agent.delete("/api/aree/test/sensori/1");
      expect(response.status).toBe(200);
      expect(mockSave).toHaveBeenCalledTimes(1);
    });
    it("Il sensore appartiene a un'area inesistente", async () => {
      mockFindOne.mockResolvedValueOnce(false);
      const response = await agent.delete("/api/aree/test/sensori/3");
      expect(response.status).toBe(404);
    });
    it("Ritorna un errore durante il processo", async () => {
      mockFindOne.mockRejectedValueOnce(new Error("Errore indotto"));
      const response = await agent.delete("/api/aree/test/sensori/1");
      expect(response.status).toBe(500);
    });
  });
});
