const express = require("express")
const CartManager = require("../managers/CartManager")

const router = express.Router()
const cartManager = new CartManager()


router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart()
    res.status(201).json(newCart)
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" })
  }
})


router.get("/:cid", async (req, res) => {
  try {
    const cartId = Number.parseInt(req.params.cid)
    const cart = await cartManager.getCartById(cartId)

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" })
    }

    res.json(cart.products)
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" })
  }
})


router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = Number.parseInt(req.params.cid)
    const productId = Number.parseInt(req.params.pid)

    const updatedCart = await cartManager.addProductToCart(cartId, productId)

    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito no encontrado" })
    }

    res.json(updatedCart)
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto al carrito" })
  }
})

module.exports = router
