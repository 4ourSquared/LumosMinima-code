import axios from "axios";
import { advanceTo, clear } from "jest-date-mock";
import request from "supertest";
import areaschema from "../schemas/AreaSchema";
import tokenschema from "../schemas/TokenSchema";
import * as generatetokenid from "../utils/LightManagement";

import { app } from "../server";
jest.mock("mongoose", () => ({
  ...jest.requireActual("mongoose"),
  connect: jest.fn(),
  connection: {
    on: jest.fn(),
    once: jest.fn(),
    close: jest.fn(),
  },
}));
let agent: request.SuperAgentTest;
describe("Area Routes", () => {
  beforeAll(async () => {
    agent = request.agent(app);
  });
  afterAll(async () => {
    jest.restoreAllMocks();
  });

  describe("Test di accensione e spegnimento in push", () => {
    it("Ritorna 400 se l'area non è stata trovata", async () => {
      areaschema.findOne = jest.fn().mockResolvedValue(false);
      const res = await agent.get("/api/segnale/area/1");
      expect(res.status).toBe(400);
    });
    it("Ritorna 200 se esiste l'area e i lampioni vengono accesi", async () => {
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
            mode: "automatico",
          },
        ],
        sensori: [],
        save: jest.fn(),
      };
      jest.spyOn(areaschema, "findOne").mockResolvedValue(areaMock);
      areaMock.lampioni[0].lum = 10;

      const res = await agent.get("/api/segnale/area/1");
      expect(res.status).toBe(200);
      expect(areaMock.lampioni[0].lum).toBe(10);
    });
    it("Ritorna 500 in caso di errore", async () => {
      jest
        .spyOn(areaschema, "findOne")
        .mockRejectedValue(new Error("Errore Indotto"));
      const res = await agent.get("/api/segnale/area/1");
      expect(res.status).toBe(500);
    });
  });
  describe("Test della post di un segnale", () => {
    it("Ritorna 200 ed aggiunge il segnale", async () => {
      const tokenMock = {
        id: 1,
        area: 1,
        expiring: new Date(),
        used: false,
      };
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
            mode: "automatico",
          },
        ],
        sensori: [],
      };

      jest.spyOn(areaschema, "findOne").mockResolvedValue(areaMock);

      const tokenFindOneMock = jest.fn();

      (tokenFindOneMock as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([tokenMock]),
      });

      (tokenschema.findOne as jest.Mock) = tokenFindOneMock;

      const postSpy = jest.spyOn(axios, "post");

      postSpy.mockResolvedValue({ data: "Dati risposta post" });

      const getSpy = jest.spyOn(axios, "get");

      getSpy.mockResolvedValue({ data: "Dati di risposta get" });

      const urlPart1 = `area/${encodeURIComponent(
        1
      )}/sensore/${encodeURIComponent(1)}`;

      const baseURL = "http://localhost:5000/api/segnale/";

      await axios.post(urlPart1, null, { baseURL });
      await axios.get(`area/${encodeURIComponent(1)}`, { baseURL });

      const res = await agent.post("/api/segnale/area/1/sensore/1/new");
      expect(res.status).toBe(200);
      expect(res.body).toBe("Successo");
    });
    it("Ritorna 500 in caso di errore", async () => {
      jest
        .spyOn(areaschema, "findOne")
        .mockRejectedValue(new Error("Errore Indotto"));
      const res = await agent.post("/api/segnale/area/1/sensore/1/new");
      expect(res.status).toBe(500);
    });
  });

  describe("Test per la generazione di un token", () => {
    it("Ritorna 200 se il token viene generato correttamente", async () => {
      const tokenMock = {
        id: 1,
        area: 1,
        expiring: new Date(),
        used: false,
      };
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
            mode: "automatico",
          },
        ],
        sensori: [],
      };

      const countDocumentsMock = jest.spyOn(tokenschema, "countDocuments");
      countDocumentsMock.mockResolvedValue(1);

      const tokenIdMock = jest.fn();
      tokenIdMock.mockResolvedValue(1);

      jest
        .spyOn(generatetokenid, "generateTokenId")
        .mockImplementation(async () => {
          const tokenId = await tokenIdMock();
          return tokenId + 1;
        });

      jest.spyOn(areaschema, "findOne").mockResolvedValue(areaMock);

      const tokenFindOneMock = jest.fn();
      (tokenFindOneMock as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([tokenMock]),
      });

      (tokenschema.findOne as jest.Mock) = tokenFindOneMock;

      const res = await agent.post("/api/segnale/area/1/sensore/1");
      expect(res.status).toBe(200);
    });
    it("Ritorna 500 in caso di errore", async () => {
      jest
        .spyOn(areaschema, "findOne")
        .mockRejectedValue(new Error("Errore Indotto"));
      const res = await agent.post("/api/segnale/area/1/sensore/1");
      expect(res.status).toBe(500);
    });
  });

  describe("Test per la verifica di un token", () => {
    it("Ritorna 500 in caso di errore", async () => {
      jest
        .spyOn(areaschema, "findOne")
        .mockRejectedValue(new Error("Errore Indotto"));
      const res = await agent.get("/api/segnale/area/1/token");
      expect(res.status).toBe(500);
    });
    it("Ritorna 226 se il token è stato utilizzato", async () => {
      const tokenMock = {
        id: 1,
        area: 1,
        expiring: new Date(),
        used: false,
      };

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
            mode: "automatico",
          },
        ],
        sensori: [],
      };

      jest.spyOn(areaschema, "findOne").mockResolvedValue(areaMock);

      const tokenFindOneMock = jest.fn();
      (tokenFindOneMock as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([tokenMock]),
      });

      (tokenschema.findOne as jest.Mock) = tokenFindOneMock;

      const res = await agent.get("/api/segnale/area/1/token");
      expect(res.status).toBe(226);
    });
    it("Ritorna 218 se il token è valido e non è stato utilizzato", async () => {
      const tokenMock1 = {
        id: 3,
        area: 1,
        expiring: new Date(),
        used: false,
      };

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
            mode: "automatico",
          },
        ],
        sensori: [],
      };

      jest.spyOn(areaschema, "findOne").mockResolvedValue(areaMock);

      const tokenSchemaMock = {
        sort: jest.fn(() => ({
          exec: jest.fn().mockResolvedValue(tokenMock1),
        })),
      };

      jest
        .spyOn(tokenschema, "findOne")
        .mockReturnValue(tokenSchemaMock as any);

      const res = await agent.get("/api/segnale/area/1/token");
      expect(res.status).toBe(218);
    });

    it.only("Ritorna 200 se il token è valido ed è stato utilizzato ma vanno spenti i lampioni", async () => {
      const tokenMock1 = {
        id: 3,
        area: 1,
        expiring: new Date(),
        used: true,
      };

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
            mode: "automatico",
          },
        ],
        sensori: [],
      };

      jest.spyOn(areaschema, "findOne").mockResolvedValue(areaMock);

      const tokenSchemaMock = {
        sort: jest.fn(() => ({
          exec: jest.fn().mockResolvedValue(tokenMock1),
        })),
      };

      jest
        .spyOn(tokenschema, "findOne")
        .mockReturnValue(tokenSchemaMock as any);

      const res = await agent.get("/api/segnale/area/1/token");
      expect(res.status).toBe(200);
    });
    it("Ritorna 498 se il token non è stato trovato", async () => {
      const tokenFindOneMock = jest.fn();
      (tokenFindOneMock as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      (tokenschema.findOne as jest.Mock) = tokenFindOneMock;

      const res = await agent.get("/api/segnale/area/1/token");
      expect(res.status).toBe(498);
    });
    it("Ritorna 400 se l'area non è stata trovata", async () => {
      const tokenMock = {
        id: 3,
        area: 1,
        expiring: new Date(),
        used: false,
      };
      const tokenFindOneMock = jest.fn();
      (tokenFindOneMock as jest.Mock).mockReturnValue(tokenMock);

      (tokenschema.findOne as jest.Mock).mockImplementation(() => {
        return {
          sort: () => ({
            exec: () => [tokenMock],
          }),
        };
      });
      jest.spyOn(areaschema, "findOne").mockResolvedValue(null);

      const res = await agent.get("/api/segnale/area/1/token");
      expect(res.status).toBe(400);
    });
  });
});
