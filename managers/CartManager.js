const fs = require("fs")
const path = require("path")

class CartManager {
  constructor() {
    this.path = path.join(__dirname, "../data/carts.json")
    this.initializeFile()
  }

  
  initializeFile() {
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]))
    }
  }

  
  async getCarts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8")
      return JSON.parse(data)
    } catch (error) {
      console.error("Error al leer carritos:", error)
      return []
    }
  }

  
  async getCartById(id) {
    try {
      const carts = await this.getCarts()
      return carts.find((cart) => cart.id === id)
    } catch (error) {
      console.error("Error al buscar carrito:", error)
      return null
    }
  }

  
  async createCart() {
    try {
      const carts = await this.getCarts()

      
      const id = carts.length > 0 ? Math.max(...carts.map((c) => c.id)) + 1 : 1

      const newCart = {
        id,
        products: [],
      }

      carts.push(newCart)
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
      return newCart
    } catch (error) {
      console.error("Error al crear carrito:", error)
      throw error
    }
  }

  
  async addProductToCart(cartId, productId) {
    try {
      const carts = await this.getCarts()
      const cartIndex = carts.findIndex((cart) => cart.id === cartId)

      if (cartIndex === -1) return null

      
      const productIndex = carts[cartIndex].products.findIndex((item) => item.product === productId)

      if (productIndex !== -1) {
        
        carts[cartIndex].products[productIndex].quantity += 1
      } else {
        
        carts[cartIndex].products.push({
          product: productId,
          quantity: 1,
        })
      }

      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
      return carts[cartIndex]
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error)
      throw error
    }
  }
}

module.exports = CartManager
