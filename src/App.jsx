import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Shop from './pages/Shop'
import CustomerProfile from './pages/CustomerProfile'
import AdminProfile from './pages/admin/AdminProfile'
import AdminPanel from './pages/AdminPanel'
import ProductManagement from './pages/admin/ProductManagement'
import UserManagement from './pages/admin/UserManagement'
import QuotationManagement from './pages/admin/QuotationManagement'
import ReservationManagement from './pages/admin/ReservationManagement'
import SupplierManagement from './pages/admin/SupplierManagement'
import GetQuotation from './pages/GetQuotation'
import BookReservation from './pages/BookReservation'
import MyReservations from './pages/MyReservations'
import MyQuotations from './pages/MyQuotations'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/get-quotation" element={<GetQuotation />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <CustomerProfile />
              </ProtectedRoute>
            } />
            <Route path="/book-reservation" element={
              <ProtectedRoute>
                <BookReservation />
              </ProtectedRoute>
            } />
            <Route path="/my-reservations" element={
              <ProtectedRoute>
                <MyReservations />
              </ProtectedRoute>
            } />
            <Route path="/my-quotations" element={
              <ProtectedRoute>
                <MyQuotations />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="/admin/profile" element={
              <ProtectedRoute adminOnly>
                <AdminProfile />
              </ProtectedRoute>
            } />
            <Route path="/admin/products" element={
              <ProtectedRoute adminOnly>
                <ProductManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute adminOnly>
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/quotations" element={
              <ProtectedRoute adminOnly>
                <QuotationManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/reservations" element={
              <ProtectedRoute adminOnly>
                <ReservationManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/suppliers" element={
              <ProtectedRoute adminOnly>
                <SupplierManagement />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
    </AuthProvider>
  )
}

export default App

