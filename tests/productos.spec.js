const request = require("supertest");
const app = require("../index");

describe("Operaciones CRUD", () => {
  // creo una variable para almacenar el id de cafe
  let cafeId;

  // punto 1
  it("Testea que la ruta GET /cafes devuelve un status code 200 y el tipo de dato recibido es un arreglo con por lo menos 1 objeto", async () => {
    const response = await request(app).get("/cafes");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Punto 2
  it("Comprueba que se obtiene un código 404 al intentar eliminar un café con un id que no existe o un código 400 cuando falta el token de autorización", async () => {
    const cafeIdNoExistente = "id_que_no_existe";
    const response = await request(app).delete(`/cafes/${cafeIdNoExistente}`);
    // esto se hizo para verificar si el codigo es 404 cuando no existe el cafe y 400 cuando se requiere de un token
    expect(response.status === 404 || response.status === 400).toBe(true);
  });

  // Punto 3
  it("Prueba que la ruta POST /cafes agrega un nuevo café y devuelve un código 201", async () => {
    const nuevoCafe = {
      id: "nuevo_id",
      nombre: "Nuevo Café",
      tipo: "Espresso",
      precio: 2.5,
    };

    const response = await request(app).post("/cafes").send(nuevoCafe);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining(nuevoCafe)]));

    // guardo id para futuros cambios
    cafeId = response.body[response.body.length - 1].id;
  });

  // Punto 4
  it("Prueba que la ruta PUT /cafes devuelve un status code 400 si intentas actualizar un café enviando un id en los parámetros que sea diferente al id dentro del payload", async () => {
    const cafeActualizado = {
      id: "id_existente",
      nombre: "Café Actualizado",
      tipo: "Latte",
      precio: 3.0,
    };

    const response = await request(app)
      .put(`/cafes/${cafeId}`)
      .send(cafeActualizado);

    expect(response.status).toBe(400);
  });
});