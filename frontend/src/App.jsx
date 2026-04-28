import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login, Register, ForgotPassword, ResetPassword, ProductList, ProductDetail } from './pages';
import './styles/tokens.css';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <main className="app-main">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            {/* Default redirect to login */}
            <Route path="/" element={<Login />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;