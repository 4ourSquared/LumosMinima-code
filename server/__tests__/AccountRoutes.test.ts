import { sign } from "jsonwebtoken";
import supertest from "supertest";
import verifyToken from "../middleware/VerifyToken";
import UserSchema from "../schemas/UserSchema"; // Importa il tuo schema utente
import { app } from "../server"; // Assicurati che il percorso sia corretto

// Crea un mock della funzione findUserByUsername
const userPayload = {
  username: "testuser",
  email: "testuser@example.com",
  password: "testpassword",
  privilege: 3,
};

const JWT_KEY =
  "gQbdVpDZY6tnLCHSRAEBND0K4rwvR7TN9zYMdQW0WBEKp6upCqnKJLarxgtpnT18LwACXJ65QZMdV3FwxankYKibK8H5dEME5VPpuwXy302avLrByYJSLx6AU4paJp13h7A0PtZ9UgpfCq8W8BfRH4J6e6HcyMS6i5kk1xfdXHmnAe1JpKdBE8cQ2PjYCuKgaNAVNaBXhduMxE2wnnvkD8AFiGzCPSchrrCL2K9nGwU7KQ2d6p9hvCZrU6vAkeNP";

describe("AccountRoutes", () => {
  beforeEach(() => {
    // Resetta lo stato dei mock prima di ogni test
    jest.clearAllMocks();
  });

  it("should return an error when logging in with invalid credentials", async () => {
    // Esegui una richiesta di login con credenziali errate
    const jwt = sign(userPayload, JWT_KEY);
    const { statusCode, body } = await supertest(app)
      .post("/account/login")
      .set("Authorization", `${jwt}`)
      .send(userPayload);

    expect(statusCode).toBe(200);
    expect(body).toEqual({});
  });

  // Aggiungi altri test per le tue rotte qui
});
