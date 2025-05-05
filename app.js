const express = require("express")
const productsRouter = require("./routes/products.router")
const cartsRouter = require("./routes/carts.router")


const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)


app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente")
})


const PORT = 8080
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
})
