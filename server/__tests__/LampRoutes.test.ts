import request, { agent } from "supertest";
import * as lamproutes from "../routes/LampRoutes";
import areaschema from "../schemas/AreaSchema";
import userschema from "../schemas/UserSchema";
import { app, server } from "../server";
import * as idgeneration from "../utils/IdGeneration";

describe("Lampione Routes", () => {
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
    };

    areaschema.findOne = jest.fn().mockResolvedValue(area1);
    agent = request.agent(app);
    await agent.post("/accounting/login").send({
      username: "admin",
      password:
        "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    server.close();
  });

  describe("Test per il recupero dei lampioni (GET)", () => {
    describe("Test per il ritorno di un singolo lampione", () => {
      it("Ritorna 200 nel recupero del singolo lampione", async () => {
        const response = await agent.get("/api/aree/1/lampioni/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          area: 1,
          guasto: false,
          id: 1,
          lum: 5,
          luogo: "Luogo Test",
          mode: "manuale",
          stato: "Attivo",
        });
      });
      it("Ritorna 404 nel recupero di un lampione non esistente", async () => {
        const response = await agent.get("/api/aree/1/lampioni/2");
        expect(response.status).toBe(404);
      });
      it("Ritorna 404 nel recupero di un lampione di un'area non esistente", async () => {
        areaschema.findOne = jest.fn().mockResolvedValue(null);
        const response = await agent.get("/api/aree/1/lampioni/2");
        expect(response.status).toBe(404);
      });
      it("Ritorna 500 nel caso di un errore durante il recupero del lampione", async () => {
        areaschema.findOne = jest
          .fn()
          .mockRejectedValue(new Error("Errore indotto"));
        const response = await agent.get("/api/aree/1/lampioni/2");
        expect(response.status).toBe(500);
      });
    });
    describe("Test per il recupero di tutti i lampioni", () => {
      it("Ritorna 200 se recupera correttamente tutti i lampioni", async () => {
        areaschema.findOne = jest.fn().mockResolvedValue({
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
        });
        const response = await agent.get("/api/aree/1/lampioni");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
          {
            id: 1,
            stato: "Attivo",
            lum: 5,
            luogo: "Luogo Test",
            area: 1,
            guasto: false,
            mode: "manuale",
          },
        ]);
      });
      it("Ritorna 404 se non viene trovata l'area specificata", async () => {
        areaschema.findOne = jest.fn().mockResolvedValue(null);
        const response = await agent.get("/api/aree/1/lampioni");
        expect(response.status).toBe(404);
      });
      it("Ritorna 500 se avviene un errore durante il recupero", async () => {
        areaschema.findOne = jest
          .fn()
          .mockRejectedValue(new Error("Errore indotto"));
        const response = await agent.get("/api/aree/1/lampioni");
        expect(response.status).toBe(500);
        jest.resetAllMocks();
      });
    });
  });
  describe("Test per l'inserimento di un lampione (POST)", () => {
    it("Ritorna 200 se il lampione viene aggiunto correttamente", async () => {
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
      const lampMock = {
        id: 2,
        stato: "Attivo",
        lum: 9,
        luogo: "TestPost",
        area: 1,
        guasto: false,
        mode: "manuale",
      };

      jest.spyOn(areaschema, "findOne").mockResolvedValue(areaMock);
      jest.spyOn(idgeneration, "generateLampId").mockResolvedValue(2);

      areaMock.lampioni.push(lampMock);

      const response = await agent.post("/api/aree/1/lampioni").send({
        id: 2,
        stato: "Attivo",
        lum: 9,
        luogo: "TestPost",
        area: 1,
        mode: "manuale",
      });
      expect(response.status).toBe(200);
    });
    it("Ritorna 500 in caso di errore durante l'inserimento", async () => {
      jest
        .spyOn(areaschema, "findOne")
        .mockRejectedValue(new Error("Errore indotto"));
      const response = await agent.post("/api/aree/1/lampioni").send({
        id: 2,
        stato: "Attivo",
        lum: 9,
        luogo: "TestPost",
        area: 1,
        mode: "manuale",
      });
      expect(response.status).toBe(500);
    });
  });
  describe("Test per la modifica di un lampione (PUT)", () => {
    describe("Test per inserire un lampione guasto", () => {
      it("Ritorna 200 se il lampione non guasto viene segnalato come guasto", async () => {
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

        jest.spyOn(areaschema, "findOne").mockResolvedValue(areaMock);
        areaMock.lampioni.find = jest.fn().mockReturnValue({
          id: 1,
        });

        const response = await agent
          .put("/api/aree/1/lampioni/guasti/1")
          .send({ guasto: true });
        expect(response.status).toBe(200);
      });
      it("Ritorna 404 se non è presente il lampione", async () => {
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

        jest.spyOn(areaschema, "findOne").mockResolvedValue(areaMock);
        areaMock.lampioni.find = jest.fn().mockReturnValue(undefined);

        const response = await agent
          .put("/api/aree/1/lampioni/guasti/2")
          .send({ guasto: true });
        expect(response.status).toBe(404);
      });
      it("Ritorna 500 se avviene un errore durante la modifica", async () => {
        jest
          .spyOn(areaschema, "findOne")
          .mockRejectedValue(new Error("Errore indotto"));
        const response = await agent
          .put("/api/aree/1/lampioni/guasti/2")
          .send({ guasto: true });
        expect(response.status).toBe(500);
      });
    });
    describe("Test per la modifica di un lampione", () => {
      it("Ritorna 200 se il lampione viene modificato correttamente", async () => {
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

        jest.spyOn(areaschema, "findOne").mockResolvedValue(areaMock);
        areaMock.lampioni.find = jest.fn().mockReturnValue({
          id: 1,
        });

        const response = await agent.put("/api/aree/1/lampioni/edit/1").send({
          stato: "Attivo",
          lum: 9,
          luogo: "Test Modifica",
          mode: "manuale",
        });
        expect(response.status).toBe(200);
      });
      it("Ritorna 404 se non è presente il lampione", async () => {
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

        jest.spyOn(areaschema, "findOne").mockResolvedValue(areaMock);
        areaMock.lampioni.find = jest.fn().mockReturnValue(undefined);

        const response = await agent.put("/api/aree/1/lampioni/edit/2").send({
          stato: "Attivo",
          lum: 9,
          luogo: "Test Modifica",
          mode: "manuale",
        });
        expect(response.status).toBe(404);
      });
      it("Ritorna 404 se non esiste l'area", async () => {
        jest.spyOn(areaschema, "findOne").mockResolvedValue(null);
        const response = await agent.put("/api/aree/1/lampioni/edit/2").send({
          stato: "Attivo",
          lum: 9,
          luogo: "Test Modifica",
          mode: "manuale",
        });
        expect(response.status).toBe(404);
      });
      it("Ritorna 500 se avviene un errore durante la modifica", async () => {
        jest
          .spyOn(areaschema, "findOne")
          .mockRejectedValue(new Error("Errore indotto"));
        const response = await agent.put("/api/aree/1/lampioni/edit/2").send({
          stato: "Attivo",
          lum: 9,
          luogo: "Test Modifica",
          mode: "manuale",
        });
        expect(response.status).toBe(500);
      });
    });
  });
  describe("Test per la richiesta di supporto alla modifica della luminosità dei lampioni", () => {
    it("Ritorna 200 se la richiesta di supporto è stata effettuata correttamente", async () => {
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

      jest.spyOn(areaschema, "findOne").mockResolvedValue(areaMock);
      areaMock.lampioni.find = jest.fn().mockReturnValue({
        id: 1,
      });
      areaMock.lampioni.forEach = jest.fn().mockReturnValue({
        lum: 5,
      });

      const response = await agent
        .put("/api/aree/1/lampioni/lum")
        .send({ lum: 5 });
      expect(response.status).toBe(200);
    });
    it("Ritorna 404 se non è presente l'area", async () => {
      jest.spyOn(areaschema, "findOne").mockResolvedValue(null);
      const response = await agent
        .put("/api/aree/1/lampioni/lum")
        .send({ lum: 5 });
      expect(response.status).toBe(404);
    });
    it("Ritorna 500 se avviene un errore durante la modifica", async () => {
      jest
        .spyOn(areaschema, "findOne")
        .mockRejectedValue(new Error("Errore indotto"));
      const response = await agent
        .put("/api/aree/1/lampioni/lum")
        .send({ lum: 5 });
      expect(response.status).toBe(500);
    });
  });
  describe("Test per la cancellazione di un lampione (DELETE)", () => {
    it("Ritorna 200 se il lampione viene cancellato correttamente", async () => {
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

      jest.spyOn(areaschema, "findOne").mockResolvedValue(areaMock);
      areaMock.lampioni.find = jest.fn().mockReturnValue({
        id: 1,
      });

      const response = await agent.delete("/api/aree/1/lampioni/1");
      expect(response.status).toBe(200);
    });
    it("Ritorna 404 se non è presente l'area con il lampione da rimuovere", async () => {
      jest.spyOn(areaschema, "findOne").mockResolvedValue(null);
      const response = await agent.delete("/api/aree/1/lampioni/1");
      expect(response.status).toBe(404);
    });
    it("Ritorna 500 in caso di errore durante la cancellazione", async () => {
      jest
        .spyOn(areaschema, "findOne")
        .mockRejectedValue(new Error("Errore indotto"));
      const response = await agent.delete("/api/aree/1/lampioni/1");
      expect(response.status).toBe(500);
    });
  });
});

describe("Test per i lampioni guasti con utente manutentore", () => {
  let agent: request.SuperAgentTest;
  beforeAll(async () => {
    userschema.findOne = jest.fn().mockResolvedValue({
      username: "manutentore",
      email: "manutentore@azienda.com",
      password:
        "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
      privilege: 2,
    });
    const area1 = {
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
          guasto: true,
          mode: "manuale",
        },
      ],
      sensori: [],
    };

    areaschema.findOne = jest.fn().mockResolvedValue(area1);
    agent = request.agent(app);
    await agent.post("/accounting/login").send({
      username: "manutentore",
      password:
        "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
    });
  });

  it("Ritorna 200 se il lampione viene tolto dai guasti", async () => {
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
          guasto: true,
          mode: "manuale",
        },
      ],
      sensori: [],
      save: jest.fn(),
    };

    jest.spyOn(areaschema, "findOne").mockResolvedValue(areaMock);
    const response = await agent
      .put("/api/aree/1/lampioni/guasti/remove/1")
      .send();
    expect(response.status).toBe(200);
  });
  it("Ritorna 409 se il lampione non è presente", async () => {
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

    jest.spyOn(areaschema, "findOne").mockResolvedValue(areaMock);
    areaMock.lampioni.find = jest.fn().mockReturnValue({ id: 1 });
    const response = await agent
      .put("/api/aree/1/lampioni/guasti/remove/1")
      .send();
    expect(response.status).toBe(409);
  });
  it("Ritorna 500 se avviene un errore durante la modifica", async () => {
    jest
      .spyOn(areaschema, "findOne")
      .mockRejectedValue(new Error("Errore indotto"));
    const response = await agent
      .put("/api/aree/1/lampioni/guasti/remove/1")
      .send();
    expect(response.status).toBe(500);
  });
  describe("Test per il recupero dei lampioni guasti", () => {
    it("Ritorna 200 se recupera correttamente tutti i lampioni guasti", async () => {
      areaschema.findOne = jest.fn().mockResolvedValue({
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
            guasto: true,
            mode: "manuale",
          },
        ],
        sensori: [],
      });
      const response = await agent.get("/api/aree/1/lampioni/guasti");
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: 1,
          stato: "Attivo",
          lum: 5,
          luogo: "Luogo Test",
          area: 1,
          guasto: true,
          mode: "manuale",
        },
      ]);
    });
    it("Ritorna 404 se non viene trovata l'area specificata", async () => {
      areaschema.findOne = jest.fn().mockResolvedValue(null);
      const response = await agent.get("/api/aree/1/lampioni/guasti");
      expect(response.status).toBe(404);
    });
  });
});
