import request from "supertest";
import userschema from "../schemas/UserSchema";
import { app } from "../server";

describe("Account Routes", () => {
  describe("Test sul login", () => {
    it("Effettua il login di un admin con successo", async () => {
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

    it;
  });

  describe("Test sul signup", () => {
    it("Crea un nuovo utente", async () => {
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
});
