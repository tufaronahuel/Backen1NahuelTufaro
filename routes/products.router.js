const express = require("express")
const ProductManager = require("../managers/ProductManager")

const router = express.Router()
const productManager = new ProductManager()


router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts()
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" })
  }
})


router.get("/:pid", async (req, res) => {
  try {
    const productId = Number.parseInt(req.params.pid)
    const product = await productManager.getProductById(productId)

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" })
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" })
  }
})


router.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body

    
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: "Todos los campos son obligatorios excepto thumbnails" })
    }

    const newProduct = await productManager.addProduct({
      title,
      description,
      code,
      price: Number(price),
      status: true,
      stock: Number(stock),
      category,
      thumbnails: thumbnails || [],
    })

    res.status(201).json(newProduct)
  } catch (error) {
    res.status(500).json({ error: "Error al crear el producto" })
  }
})


router.put("/:pid", async (req, res) => {
  try {
    const productId = Number.parseInt(req.params.pid)
    const updatedFields = req.body

    const updatedProduct = await productManager.updateProduct(productId, updatedFields)

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" })
    }

    res.json(updatedProduct)
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" })
  }
})


router.delete("/:pid", async (req, res) => {
  try {
    const productId = Number.parseInt(req.params.pid)
    const result = await productManager.deleteProduct(productId)

    if (!result) {
      return res.status(404).json({ error: "Producto no encontrado" })
    }

    res.json({ message: "Producto eliminado correctamente" })
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" })
  }
})

module.exports = router
