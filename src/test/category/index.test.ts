import app from "../../server"
import  request  from "supertest"
describe("POST /users", () => {

  describe("when passed a username and password", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(app).get("/categories/test").send()
      expect(response.statusCode).toBe(200)
    })
  })

})