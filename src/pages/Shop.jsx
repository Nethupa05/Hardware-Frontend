import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../services'

const Shop = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState([])
  const [sortBy, setSortBy] = useState('name')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showProductModal, setShowProductModal] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  // Add keyboard support for modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showProductModal) {
        closeProductModal()
      }
    }
    
    if (showProductModal) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [showProductModal])

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

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories()
      console.log('Categories response:', response)
      // Use predefined categories as fallback and merge with API response
      const predefinedCategories = ['Building', 'Plumbing', 'Electrical', 'Painting', 'Safety', 'Gardening', 'Hand Tools', 'Power Tools', 'Roofing', 'Others']
      const apiCategories = response.categories || response.data || response || []
      const allCategories = [...new Set([...predefinedCategories, ...apiCategories])]
      setCategories(allCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      // Fallback to predefined categories if API fails
      setCategories(['Building', 'Plumbing', 'Electrical', 'Painting', 'Safety', 'Gardening', 'Hand Tools', 'Power Tools', 'Roofing', 'Others'])
    }
  }

  const handleViewDetails = (product) => {
    setSelectedProduct(product)
    setShowProductModal(true)
  }

  const closeProductModal = () => {
    setShowProductModal(false)
    setSelectedProduct(null)
  }

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      return matchesSearch && matchesCategory && product.isActive
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        case 'stock':
          return b.stock - a.stock
        default:
          return 0
      }
    })

  const ProductCard = ({ product }) => (
    <div className="card overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-w-16 aspect-h-12 bg-gray-200">
        {product.image && product.image.trim() !== '' ? (
          <img
            src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`}
            alt={product.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              console.error('Shop image error:', e.target.src);
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`w-full h-48 bg-gray-200 flex items-center justify-center ${product.image && product.image.trim() !== '' ? 'hidden' : ''}`}>
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
          <div className="flex flex-col items-end space-y-1">
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.sku}
            </span>
            <span className="text-xs text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-primary-600">Rs. {product.price}</span>
          <span className={`text-sm px-2 py-1 rounded ${
            product.stock > product.minStock 
              ? 'text-green-600 bg-green-100' 
              : product.stock > 0 
                ? 'text-yellow-600 bg-yellow-100'
                : 'text-red-600 bg-red-100'
          }`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
        
        
        <div className="flex justify-end">
          <button 
            onClick={() => handleViewDetails(product)}
            className="btn-primary px-6"
          >
            View Details
          </button>
        </div>
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
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Hardware Store</h1>
        <p className="text-gray-600 text-lg">Find the perfect tools and materials for your projects</p>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="all">All Categories</option>
              {categories.sort().map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="name">Name A-Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="stock">Stock: High to Low</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              {selectedCategory === 'all' ? (
                <>Showing {filteredProducts.length} of {products.length} products</>
              ) : (
                <>Showing {filteredProducts.length} products in <span className="font-semibold text-primary-600">{selectedCategory}</span></>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Product Details Modal */}
      {showProductModal && selectedProduct && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeProductModal()
            }
          }}
        >
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                  <p className="text-gray-600">Product Details</p>
                </div>
                <button
                  onClick={closeProductModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="space-y-4">
                  <div className="aspect-w-16 aspect-h-12 bg-gray-200 rounded-lg overflow-hidden">
                    {selectedProduct.image && selectedProduct.image.trim() !== '' ? (
                      <img
                        src={selectedProduct.image.startsWith('http') ? selectedProduct.image : `http://localhost:5000${selectedProduct.image}`}
                        alt={selectedProduct.name}
                        className="w-full h-96 object-cover"
                        onError={(e) => {
                          console.error('Product detail image error:', e.target.src);
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-96 bg-gray-200 flex items-center justify-center ${selectedProduct.image && selectedProduct.image.trim() !== '' ? 'hidden' : ''}`}>
                      <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Product Information */}
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">SKU:</span>
                          <span className="font-medium">{selectedProduct.sku}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm">
                            {selectedProduct.category}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-bold text-2xl text-primary-600">Rs. {selectedProduct.price}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stock Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Stock Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Stock:</span>
                          <span className={`font-medium px-3 py-1 rounded-full text-sm ${
                            selectedProduct.stock > selectedProduct.minStock 
                              ? 'text-green-600 bg-green-100' 
                              : selectedProduct.stock > 0 
                                ? 'text-yellow-600 bg-yellow-100'
                                : 'text-red-600 bg-red-100'
                          }`}>
                            {selectedProduct.stock} units
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Minimum Stock:</span>
                          <span className="font-medium">{selectedProduct.minStock} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-medium px-3 py-1 rounded-full text-sm ${
                            selectedProduct.stock > selectedProduct.minStock 
                              ? 'text-green-600 bg-green-100' 
                              : selectedProduct.stock > 0 
                                ? 'text-yellow-600 bg-yellow-100'
                                : 'text-red-600 bg-red-100'
                          }`}>
                            {selectedProduct.stock > selectedProduct.minStock ? 'In Stock' : selectedProduct.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedProduct.description}</p>
                  </div>

                  {/* Supplier Information */}
                  {selectedProduct.supplier && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Supplier Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Supplier:</span>
                          <span className="font-medium">{selectedProduct.supplier.name}</span>
                        </div>
                        {selectedProduct.supplier.email && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium">{selectedProduct.supplier.email}</span>
                          </div>
                        )}
                        {selectedProduct.supplier.phone && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Phone:</span>
                            <span className="font-medium">{selectedProduct.supplier.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4 border-t">
                    <button
                      onClick={closeProductModal}
                      className="btn-outline flex-1"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        // You can add "Add to Quote" or "Contact Supplier" functionality here
                        alert('Contact supplier or add to quote functionality can be added here')
                      }}
                      className="btn-primary flex-1"
                    >
                      Contact Supplier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Shop