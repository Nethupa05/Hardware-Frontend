import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productService, supplierService } from '../../services'

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProductId, setDeletingProductId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    minStock: '',
    sku: '',
    image: '',
    supplier: ''
  })

  useEffect(() => {
    fetchProducts()
    fetchSuppliers()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productService.getProducts()
      setProducts(response.products || response.data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSuppliers = async () => {
    try {
      const response = await supplierService.getSuppliers()
      console.log('Suppliers response:', response)
      setSuppliers(response.data || response.suppliers || [])
    } catch (error) {
      console.error('Error fetching suppliers:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      
      // Add all form fields
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', parseFloat(formData.price))
      formDataToSend.append('category', formData.category)
      formDataToSend.append('stock', parseInt(formData.stock))
      formDataToSend.append('minStock', parseInt(formData.minStock))
      formDataToSend.append('sku', formData.sku)
      if (formData.supplier) {
        formDataToSend.append('supplier', formData.supplier)
      }
      
      // Handle image upload - prioritize file upload over URL
      if (formData.imageFile) {
        // File upload
        formDataToSend.append('image', formData.imageFile)
        console.log('Uploading file:', formData.imageFile.name)
      } else if (formData.imageUrl && formData.imageUrl.trim() !== '') {
        // URL input
        formDataToSend.append('image', formData.imageUrl.trim())
        console.log('Using image URL:', formData.imageUrl)
      }

      console.log('FormData contents:')
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value)
      }

      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, formDataToSend)
      } else {
        await productService.createProduct(formDataToSend)
      }

      setShowAddForm(false)
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        minStock: '',
        sku: '',
        image: '',
        imageFile: null,
        imageUrl: ''
      })
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product: ' + error.message)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      sku: product.sku || '',
      image: product.image || '',
      supplier: product.supplier?._id || product.supplier || '',
      imageFile: null,
      imageUrl: ''
    })
    setShowAddForm(true)
  }

  const handleDelete = async (productId) => {
    const product = products.find(p => p._id === productId);
    const productName = product ? product.name : 'this product';
    
    if (window.confirm(`Are you sure you want to PERMANENTLY DELETE "${productName}"?\n\nThis action cannot be undone and the product will be completely removed from the database.`)) {
      try {
        setDeletingProductId(productId);
        await productService.deleteProduct(productId);
        alert(`Product "${productName}" has been permanently deleted successfully!`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert(`Error deleting product: ${error.response?.data?.message || error.message}`);
      } finally {
        setDeletingProductId(null);
      }
    }
  }

  const getStockStatus = (product) => {
    if (product.stock === 0) return { status: 'Out of Stock', color: 'text-red-600 bg-red-100' }
    if (product.stock <= product.minStock) return { status: 'Low Stock', color: 'text-yellow-600 bg-yellow-100' }
    return { status: 'In Stock', color: 'text-green-600 bg-green-100' }
  }

  const ProductForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rs.)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Stock</label>
              <input
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Select Category</option>
              <option value="Building">Building</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Painting">Painting</option>
              <option value="Safety">Safety</option>
              <option value="Gardening">Gardening</option>
              <option value="Hand Tools">Hand Tools</option>
              <option value="Power Tools">Power Tools</option>
              <option value="Roofing">Roofing</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
            <select
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="input-field"
            >
              <option value="">Select Supplier (Optional)</option>
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.name} - {supplier.company}
                </option>
              ))}
            </select>
            {suppliers.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                No suppliers available. <Link to="/admin/suppliers" className="text-primary-600 hover:text-primary-800">Add suppliers first</Link>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <div className="space-y-4">
              {/* Image Preview */}
              {formData.image && (
                <div className="flex items-center space-x-4">
                  <img 
                    src={formData.image.startsWith('http') ? formData.image : (formData.image.startsWith('/') ? `http://localhost:5000${formData.image}` : formData.image)} 
                    alt="Product preview" 
                    className="h-20 w-20 object-cover rounded-lg border border-gray-300"
                    onError={(e) => {
                      console.error('Image preview error:', e.target.src);
                      e.target.style.display = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '', imageFile: null, imageUrl: '' })}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove Image
                  </button>
                </div>
              )}
              
              {/* File Upload */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Create preview URL
                      const previewUrl = URL.createObjectURL(file);
                      setFormData({ ...formData, imageFile: file, image: previewUrl });
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                <p className="text-xs text-gray-500 mt-1">Upload JPG, PNG, or GIF (max 5MB)</p>
              </div>
              
              {/* Image URL Input (fallback) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Or Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (formData.imageUrl) {
                      setFormData({ ...formData, image: formData.imageUrl, imageFile: null });
                    }
                  }}
                  className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                >
                  Use URL
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false)
                setEditingProduct(null)
                setFormData({
                  name: '',
                  description: '',
                  price: '',
                  category: '',
                  stock: '',
                  minStock: '',
                  sku: '',
                  image: '',
                  supplier: ''
                })
              }}
              className="btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <div className="flex space-x-4">
          <Link to="/admin" className="btn-outline">
            ← Back to Admin
          </Link>
          <button onClick={() => setShowAddForm(true)} className="btn-primary">
            + Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => {
                const stockStatus = getStockStatus(product)
                return (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {product.image && product.image.trim() !== '' ? (
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} 
                              alt={product.name}
                              onError={(e) => {
                                console.error('Product image error:', e.target.src);
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center ${product.image && product.image.trim() !== '' ? 'hidden' : ''}`}>
                            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l-8 4v14h16V6l-8-4zM4 6l8-4 8 4v12H4V6z"/><path d="M8 8h2v2H8V8zm4 0h2v2h-2V8zm4 0h2v2h-2V8zM8 12h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"/></svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rs. {product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.supplier ? (
                        <div>
                          <div className="font-medium">{product.supplier.name}</div>
                          <div className="text-gray-500 text-xs">{product.supplier.company}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No supplier</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                        {stockStatus.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingProductId === product._id}
                          className="text-red-600 hover:text-red-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Permanently delete this product"
                        >
                          {deletingProductId === product._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAddForm && <ProductForm />}
    </div>
  )
}

export default ProductManagement
