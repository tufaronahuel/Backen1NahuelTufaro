const fs = require("fs")
const path = require("path")

class ProductManager {
  constructor() {
    this.path = path.join(__dirname, "../data/products.json")
    this.initializeFile()
  }

  
  initializeFile() {
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]))
    }
  }

  
  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8")
      return JSON.parse(data)
    } catch (error) {
      console.error("Error al leer productos:", error)
      return []
    }
  }

  
  async getProductById(id) {
    try {
      const products = await this.getProducts()
      return products.find((product) => product.id === id)
    } catch (error) {
      console.error("Error al buscar producto:", error)
      return null
    }
  }

  
  async addProduct(productData) {
    try {
      const products = await this.getProducts()

      
      const id = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1

      const newProduct = {
        id,
        ...productData,
        status: productData.status !== undefined ? productData.status : true,
        thumbnails: productData.thumbnails || [],
      }

      products.push(newProduct)
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))
      return newProduct
    } catch (error) {
      console.error("Error al agregar producto:", error)
      throw error
    }
  }

  
  async updateProduct(id, updatedFields) {
    try {
      const products = await this.getProducts()
      const index = products.findIndex((product) => product.id === id)

      if (index === -1) return null

      
      const { id: _, ...fieldsToUpdate } = updatedFields

     
      products[index] = {
        ...products[index],
        ...fieldsToUpdate,
      }

      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))
      return products[index]
    } catch (error) {
      console.error("Error al actualizar producto:", error)
      throw error
    }
  }

  
  async deleteProduct(id) {
    try {
      const products = await this.getProducts()
      const filteredProducts = products.filter((product) => product.id !== id)

      if (filteredProducts.length === products.length) return false

      await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, 2))
      return true
    } catch (error) {
      console.error("Error al eliminar producto:", error)
      throw error
    }
  }
}

module.exports = ProductManager
