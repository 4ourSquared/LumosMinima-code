import request from "supertest";
import userschema from "../schemas/UserSchema";
import { app } from "../server";

describe("Account Routes", () => {
  let agentTest: request.SuperAgentTest;
  beforeAll(async () => {
    userschema.findOne = jest.fn().mockResolvedValue({
      username: "admin",
      email: "admin@azienda.com",
      password:
        "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
      privilege: 3,
    });

    agentTest = request.agent(app);
    await agentTest.post("/accounting/login").send({
      username: "admin",
      password:
        "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
    });
  });

  describe("Test sul login", () => {
    it("Effettua il login di un utente con successo", async () => {
      //Mock di un utente correttamente registrato: la password è "password" ma
      //con un hash sha512 che viene effettuato dal client. Questo viene
      //ripetuto ogni volta che è necessario avvalersi di un utente ben formato.
      userschema.findOne = jest.fn().mockResolvedValue({
        username: "admin",
        email: "admin@azienda.com",
        password:
          "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
        privilege: 3,
      });

      const response = await request(app).post("/accounting/login").send({
        username: "admin",
        password:
          "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
      });
      expect(response.status).toBe(200);
    });
  });

  describe("Test sul logout", () => {
    userschema.findOne = jest.fn().mockResolvedValue({
      username: "admin",
      email: "admin@azienda.com",
      password:
        "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
      privilege: 3,
    });

    it("Ritorna 403 se non è stato passato un token valido", async () => {
      const response = await request(app).post("/accounting/logout");
      expect(response.status).toBe(403);
    });
    it("Ritorna 200 se è stato passato un token valido", async () => {
      const agent = request.agent(app);
      await agent.post("/accounting/login").send({
        username: "admin",
        password:
          "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
      });
      const response = await agent.post("/accounting/logout");
      expect(response.status).toBe(200);
    });
  });

  describe("Test sul signup", () => {
    it("Ritorna 200 e crea un nuovo utente con successo", async () => {
      const mockSave = jest.spyOn(userschema.prototype, "save");
      mockSave.mockResolvedValue(true);
      userschema.findOne = jest.fn().mockResolvedValue(false);

      const response = await request(app).post("/accounting/signup").send({
        username: "newuser",
        email: "newuser@example.com",
        password: "newpassword",
        privilege: 2,
      });

      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });

    it("Ritorna errore 409 se l'username esiste già", async () => {
      userschema.findOne = jest.fn().mockResolvedValue(true);
      const response = await request(app).post("/accounting/signup").send({
        username: "admin",
        email: "admin23@azienda.com",
        password: "password2",
        privilege: 3,
      });
      expect(response.status).toBe(409);
    });

    it("Ritorna errore 409 se la mail esiste già", async () => {
      userschema.findOne = jest
        .fn()
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);
      const response = await request(app).post("/accounting/signup").send({
        username: "admin2344",
        email: "admin@azienda.com",
        password: "password3",
        privilege: 3,
      });
      expect(response.status).toBe(409);
    });
  });

  describe("Test sulla verifica del token", () => {
    userschema.findOne = jest.fn().mockResolvedValue({
      username: "admin",
      email: "admin@azienda.com",
      password:
        "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
      privilege: 3,
    });

    it("Ritorna 403 se non è stato passato un token valido", async () => {
      const response = await request(app).get("/accounting/verify");
      expect(response.status).toBe(403);
    });
    it("Ritorna 200 se è stato passato un token valido", async () => {
      const response = await agentTest.get("/accounting/verify");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ role: 3 });
    });
  });

  describe("Test per recuperare gli utenti", () => {
    userschema.find = jest.fn().mockResolvedValueOnce({
      username: "testuser",
      password: "testpassword",
      email: "testemail@example.com",
      privilege: 2,
    });

    userschema.findOne = jest.fn().mockResolvedValue({
      username: "admin",
      email: "admin@azienda.com",
      password:
        "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
      privilege: 3,
    });

    it("Recupera la lista completa degli utenti se l'utente è admin", async () => {
      const agent = request.agent(app);
      await agent.post("/accounting/login").send({
        username: "admin",
        password:
          "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
      });
      agent
        .get("/accounting/userList")
        .expect(200)
        .expect("Content-Type", /json/);
    });
    it("Ritorna 500 se l'utente non è autorizzato", async () => {
      userschema.findOne = jest.fn().mockResolvedValue({
        username: "manutentore1",
        email: "manutentore1@azienda.com",
        password:
          "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
        privilege: 2,
      });
      const agent = request.agent(app);
      await agent.post("/accounting/login").send({
        username: "manutentore1",
        password:
          "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
      });
      agent
        .get("/accounting/userList")
        .expect(500)
        .expect("Content-Type", /json/);
    });
    it("Ritorna un utente specifico se l'utente è admin", async () => {
      const agent = request.agent(app);
      await agent.post("/accounting/login").send({
        username: "admin",
        password:
          "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
      });
      agent.get("/accounting/user/admin").expect(200);
    });
  });

  describe("Test per aggiornare un utente", () => {
    userschema.findOne = jest.fn().mockResolvedValue({
      username: "admin",
      email: "admin@azienda.com",
      password:
        "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
      privilege: 3,
    });
    const mockSave = jest.spyOn(userschema.prototype, "save");
    mockSave.mockResolvedValue(true);
    userschema.findOne = jest.fn().mockResolvedValue(false);

    it("Ritorna 404 se l'utente non è presente", async () => {
      const agent = request.agent(app);
      await agent.post("/accounting/login").send({
        username: "admin",
        password:
          "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
      });
      agent
        .put("/accounting/user/test")
        .expect(404)
        .expect("Content-Type", /json/)
        .expect({ message: "Utente non trovato" });
    });

    it("Ritorna 200 se l'utente è stato aggiornato correttamente", async () => {
      const agent = request.agent(app);
      await agent.post("/accounting/login").send({
        username: "admin",
        password:
          "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
      });
      agent
        .put("/accounting/user/test")
        .expect(200)
        .expect("Content-Type", /json/)
        .expect({ message: "Utente modificato correttamente" });

      expect(mockSave).toHaveBeenCalledTimes(1);
    });
  });
});
