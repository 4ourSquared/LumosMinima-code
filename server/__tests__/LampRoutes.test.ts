import request, { agent } from "supertest";
import areaschema from "../schemas/AreaSchema";
import lampschema from "../schemas/LampSchema";
import userschema from "../schemas/UserSchema";
import { app, server } from "../server";

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
      lampioni: [],
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

  afterAll(async () => {
    server.close();
  });

  describe("Test per il recupero dei lampioni (GET)", () => {});
});
