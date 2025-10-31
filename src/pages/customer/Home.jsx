import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import all images
import cylinder3kg from '../../assets/3kg.png';
import cylinder4kg from '../../assets/4kg.png';
import cylinder5kg from '../../assets/5kg.png';
import cylinder6kg from '../../assets/6kg.png';
import cylinder7kg from '../../assets/7kg.png';
import cylinder10kg from '../../assets/10kg.png';
import cylinder12kg from '../../assets/12kg.png';
import cylinder12_5kg from '../../assets/12.5kg.png';
import cylinder15kg from '../../assets/15kg.png';

// Fallback images for any missing imports
const fallbackImages = {
  cylinder: '⛽',
  package: '📦',
  emergency: '🚨'
};

const Home = () => {
  const navigate = useNavigate();
  
  // Use local state for cart - load from localStorage initially
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('greenWellsCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        return Array.isArray(parsedCart) ? parsedCart : [];
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        return [];
      }
    }
    return [];
  });
  
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartAnimation, setCartAnimation] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  // Green Wells Kenya Products Data
  useEffect(() => {
    const greenWellsProducts = [
      {
        id: 1,
        name: '3kg Gas Cylinder Refill',
        weight: '3kg',
        price: 600,
        delivery: 'Same Day Delivery',
        popular: false,
        image: cylinder3kg,
        description: 'Compact size perfect for students, small apartments, and occasional cooking',
        features: ['Lasts 1-2 weeks', 'Lightweight & portable', 'Ideal for single users'],
        deliveryAreas: ['Nairobi', 'Thika', 'Kiambu']
      },
      {
        id: 2,
        name: '4kg Gas Cylinder Refill',
        weight: '4kg',
        price: 850,
        delivery: 'Same Day Delivery',
        popular: false,
        image: cylinder4kg,
        description: 'Great for small families or backup cooking solution',
        features: ['Lasts 2-3 weeks', 'Easy to handle', 'Budget-friendly option'],
        deliveryAreas: ['Nairobi', 'Thika', 'Kiambu']
      },
      {
        id: 3,
        name: '5kg Gas Cylinder Refill',
        weight: '5kg',
        price: 1000,
        delivery: 'Same Day Delivery',
        popular: true,
        image: cylinder5kg,
        description: 'Versatile size for small to medium households',
        features: ['Lasts 3-4 weeks', 'Balanced size & capacity', 'Most versatile choice'],
        deliveryAreas: ['Nairobi', 'Thika', 'Kiambu', 'Nakuru']
      },
      {
        id: 4,
        name: '6kg Gas Cylinder Refill',
        weight: '6kg',
        price: 1150,
        delivery: 'Same Day Delivery',
        popular: true,
        image: cylinder6kg,
        description: 'Ideal for small families and efficient cooking needs',
        features: ['Lasts 4-5 weeks', 'Family-friendly size', 'Easy to transport'],
        deliveryAreas: ['Nairobi', 'Thika', 'Kiambu', 'Nakuru']
      },
      {
        id: 5,
        name: '7kg Gas Cylinder Refill',
        weight: '7kg',
        price: 1300,
        delivery: 'Same Day Delivery',
        popular: false,
        image: cylinder7kg,
        description: 'Extended capacity for growing families',
        features: ['Lasts 5-6 weeks', 'Extra cooking time', 'Reliable supply'],
        deliveryAreas: ['Nairobi', 'Thika', 'Kiambu', 'Nakuru']
      },
      {
        id: 6,
        name: '10kg Gas Cylinder Refill',
        weight: '10kg',
        price: 1800,
        delivery: 'Same Day Delivery',
        popular: true,
        image: cylinder10kg,
        description: 'Perfect balance of capacity and affordability for families',
        features: ['Lasts 6-8 weeks', 'Cost-effective', 'Family favorite'],
        deliveryAreas: ['Nairobi', 'Nakuru', 'Mombasa', 'Kisumu']
      },
      {
        id: 7,
        name: '12kg Gas Cylinder Refill',
        weight: '12kg',
        price: 2000,
        delivery: 'Same Day Delivery',
        popular: false,
        image: cylinder12kg,
        description: 'Extended family size with reliable long-term supply',
        features: ['Lasts 8-10 weeks', 'Reduced refill frequency', 'Great value'],
        deliveryAreas: ['Nairobi', 'Nakuru', 'Mombasa', 'Kisumu']
      },
      {
        id: 8,
        name: '12.5kg Gas Cylinder Refill',
        weight: '12.5kg',
        price: 2050,
        delivery: 'Same Day Delivery',
        popular: true,
        image: cylinder12_5kg,
        description: 'Standard family size trusted by Kenyan households',
        features: ['Lasts 8-10 weeks', 'Most popular family size', 'Trusted quality'],
        deliveryAreas: ['Nairobi', 'Nakuru', 'Mombasa', 'Kisumu', 'All major towns']
      },
      {
        id: 9,
        name: '15kg Gas Cylinder Refill',
        weight: '15kg',
        price: 2500,
        delivery: 'Next Day Delivery',
        popular: false,
        image: cylinder15kg,
        description: 'Large capacity for big families and small businesses',
        features: ['Lasts 10-12 weeks', 'Commercial grade', 'Extended usage'],
        deliveryAreas: ['Nairobi', 'All major towns']
      }
      
    ];
    setProducts(greenWellsProducts);
  }, []);

  const handleImageError = (productId) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  const getFallbackIcon = (productName) => {
    if (productName.toLowerCase().includes('emergency')) return fallbackImages.emergency;
    if (productName.toLowerCase().includes('package')) return fallbackImages.package;
    return fallbackImages.cylinder;
  };

  const addToCart = (product) => {
    const newCart = [...cart, product];
    setCart(newCart);
    
    // Save to localStorage IMMEDIATELY and synchronously
    localStorage.setItem('greenWellsCart', JSON.stringify(newCart));
    
    // Trigger animation
    setCartAnimation(product.id);
    setTimeout(() => setCartAnimation(null), 1000);

    // Show success notification
    const event = new CustomEvent('showToast', { 
      detail: { 
        message: `${product.name} added to cart!`, 
        type: 'success' 
      }
    });
    window.dispatchEvent(event);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(price);
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Add some items first.');
      return;
    }
    
    // Double-check localStorage is updated and pass cart via state
    localStorage.setItem('greenWellsCart', JSON.stringify(cart));
    
    // Navigate with cart data in state for reliability
    navigate('/checkout', { state: { cart } });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCartValue = cart.reduce((total, item) => total + (item.price || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b-4 border-[#2F9E44]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-[#2F9E44] text-white p-2 rounded-lg">
                <span className="text-2xl">🌿</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Green <span className="text-[#2F9E44]">Wells</span>
                </h1>
                <p className="text-sm text-gray-600">Clean Energy for Kenya</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search gas cylinders by size... (6kg, 13kg, 50kg)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2F9E44] focus:border-transparent transition-all duration-200 shadow-sm"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                  🔍
                </div>
              </div>
            </div>

            {/* Cart with Animation */}
            <div className="relative">
              <button 
                onClick={proceedToCheckout}
                className="relative p-3 bg-[#2F9E44] text-white rounded-xl hover:bg-green-700 transition-colors duration-200 shadow-lg"
              >
                <span className="text-xl">🛒</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                    {cart.length}
                  </span>
                )}
              </button>
              
              {/* Cart Value */}
              {cart.length > 0 && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm font-semibold text-[#2F9E44]">
                  {formatPrice(totalCartValue)}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#2F9E44] to-[#1E7E34] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Affordable LPG Gas Delivery in Kenya
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Safe, reliable gas cylinders delivered to your doorstep across Kenya
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 mt-8 text-black">
              <div className="flex flex-col items-center bg-white bg-opacity-20 p-4 rounded-xl">
                <span className="text-3xl mb-2">🚚</span>
                <span className="font-semibold">Same Day Delivery</span>
                <span className="text-sm opacity-80">Nairobi & Major Towns</span>
              </div>
              <div className="flex flex-col items-center bg-white bg-opacity-20 p-4 rounded-xl">
                <span className="text-3xl mb-2">🛡️</span>
                <span className="font-semibold">KEBS Certified</span>
                <span className="text-sm opacity-80">Quality Guaranteed</span>
              </div>
              <div className="flex flex-col items-center bg-white bg-opacity-20 p-4 rounded-xl">
                <span className="text-3xl mb-2">💳</span>
                <span className="font-semibold">M-Pesa Accepted</span>
                <span className="text-sm opacity-80">Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Gas Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our range of certified LPG cylinders with free safe delivery
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                product.popular ? 'border-[#2F9E44]' : 'border-transparent'
              } relative overflow-hidden group`}
            >
              {/* Popular Badge */}
              {product.popular && (
                <div className="absolute top-4 right-4 bg-[#2F9E44] text-white px-3 py-1 rounded-full text-sm font-bold z-10 animate-pulse">
                  MOST POPULAR
                </div>
              )}

              {/* Product Image with Error Handling */}
              <div className="h-48 mb-4 flex items-center justify-center bg-gray-50 transform group-hover:scale-105 transition-transform duration-300">
                {imageErrors[product.id] ? (
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-6xl text-gray-400 mb-2">
                      {getFallbackIcon(product.name)}
                    </div>
                    <div className="text-sm text-gray-500 text-center px-4">
                      {product.name}
                    </div>
                  </div>
                ) : (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="h-full w-auto object-contain max-w-full"
                    onError={() => handleImageError(product.id)}
                  />
                )}
              </div>

              {/* Product Details */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 pr-2">
                    {product.name}
                  </h3>
                  <span className="bg-green-100 text-[#2F9E44] px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                    {product.weight}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 text-sm">
                  {product.description}
                </p>

                {/* Features */}
                <div className="mb-4">
                  {product.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600 mb-1">
                      <span className="text-[#2F9E44] mr-2">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Price and Delivery */}
                <div className="space-y-3 mb-6">
                  <div className="text-2xl font-bold text-[#2F9E44]">
                    {formatPrice(product.price)}
                  </div>
                  <div className="text-green-600 text-sm font-semibold flex items-center">
                    <span className="mr-2">🚚</span>
                    {product.delivery}
                  </div>
                </div>

                {/* Add to Cart Button with Animation */}
                <button
                  onClick={() => addToCart(product)}
                  disabled={cartAnimation === product.id}
                  className={`w-full bg-[#2F9E44] hover:bg-[#1E7E34] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform ${
                    cartAnimation === product.id 
                      ? 'scale-95 bg-green-700' 
                      : 'hover:scale-105'
                  } focus:ring-2 focus:ring-[#2F9E44] focus:ring-opacity-50 flex items-center justify-center space-x-2`}
                >
                  {cartAnimation === product.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <span>Add to Cart</span>
                      <span className="text-lg">+</span>
                    </>
                  )}
                </button>

                {/* Delivery Areas */}
                <div className="mt-3 text-xs text-gray-500">
                  Available in: {product.deliveryAreas.join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}

        {/* Safety Features */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-green-200">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Why Choose Green Wells Kenya?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🇰🇪</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Kenyan Owned</h4>
              <p className="text-gray-600 text-sm">Supporting local economy</p>
            </div>
            <div className="text-center p-4">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">KEBS Certified</h4>
              <p className="text-gray-600 text-sm">Quality guaranteed cylinders</p>
            </div>
            <div className="text-center p-4">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Free Delivery</h4>
              <p className="text-gray-600 text-sm">Nairobi & major towns</p>
            </div>
            <div className="text-center p-4">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📞</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">24/7 Support</h4>
              <p className="text-gray-600 text-sm">Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-[#2F9E44]">10,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#2F9E44]">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#2F9E44]">50+</div>
              <div className="text-gray-600">Cities Served</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#2F9E44]">99%</div>
              <div className="text-gray-600">On-time Delivery</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Green Wells Kenya</h3>
              <p className="text-gray-400">
                Providing clean, affordable cooking gas to Kenyan households since 2015.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <p>📞 0712 345 678</p>
                <p>📧 info@greenwells.co.ke</p>
                <p>📍 Nairobi, Kenya</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Delivery Areas</h4>
              <div className="text-gray-400 space-y-1">
                <p>Nairobi & Surrounding</p>
                <p>Mombasa</p>
                <p>Kisumu</p>
                <p>Nakuru</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Payment Methods</h4>
              <div className="text-gray-400 space-y-1">
                <p>M-Pesa</p>
                <p>Cash on Delivery</p>
                <p>Bank Transfer</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Green Wells Kenya. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Cart Animation */}
      {cartAnimation && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute bottom-20 right-20 animate-bounce">
            <div className="bg-[#2F9E44] text-white p-4 rounded-full shadow-2xl">
              <span className="text-2xl">🎉</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;