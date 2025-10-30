import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [userLocation, setUserLocation] = useState(null);
  const [orderStatus, setOrderStatus] = useState('pending');
  const [driverInfo, setDriverInfo] = useState(null);
  const [order, setOrder] = useState(null);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    address: '',
    additionalNotes: ''
  });

  // Load cart from location state or localStorage
  useEffect(() => {
    const loadCart = () => {
      // First try to get cart from location state (more reliable)
      if (location.state?.cart) {
        const stateCart = location.state.cart;
        setCart(Array.isArray(stateCart) ? stateCart : []);
        setIsLoading(false);
        
        if (stateCart.length === 0) {
          setTimeout(() => navigate('/dashboard'), 100);
        }
        return;
      }

      // Fallback to localStorage
      const savedCart = localStorage.getItem('greenWellsCart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          const validCart = Array.isArray(parsedCart) ? parsedCart : [];
          setCart(validCart);
          setIsLoading(false);
          
          if (validCart.length === 0) {
            setTimeout(() => navigate('/dashboard'), 100);
          }
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
          setCart([]);
          setIsLoading(false);
          setTimeout(() => navigate('/dashboard'), 100);
        }
      } else {
        setCart([]);
        setIsLoading(false);
        setTimeout(() => navigate('/dashboard'), 100);
      }
    };

    // Add a small delay to ensure everything is loaded
    const timer = setTimeout(loadCart, 50);
    return () => clearTimeout(timer);
  }, [navigate, location.state]);

  // Initialize order when cart is loaded
  useEffect(() => {
    if (!isLoading && cart.length > 0) {
      const newOrder = {
        id: `GW${Date.now()}`,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price || 0), 0),
        timestamp: new Date(),
        status: 'pending'
      };
      setOrder(newOrder);
    }
  }, [isLoading, cart]);

  // Request location access
  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setStep(2); // Show loading state
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setStep(3); // Move to user info form
        reverseGeocode(latitude, longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
        setStep(3); // Still move to form but without auto-filled address
        alert('Unable to get your location. Please enter your address manually.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Reverse geocode to get address from coordinates
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.address) {
        const address = `${data.address.road || ''} ${data.address.house_number || ''}, ${data.address.suburb || data.address.neighbourhood || ''}, ${data.address.city || data.address.town || 'Nairobi'}`;
        setUserInfo(prev => ({ ...prev, address: address.trim() }));
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
  };

  // Submit order
  const submitOrder = async (e) => {
    e.preventDefault();
    
    if (!userInfo.name || !userInfo.phone || !userInfo.address) {
      alert('Please fill in all required fields');
      return;
    }

    setStep(4); // Move to order confirmation
    setOrderStatus('confirmed');

    // Simulate order processing
    setTimeout(() => {
      setOrderStatus('preparing');
      simulateDriverAssignment();
    }, 3000);
  };

  // Simulate driver assignment
  const simulateDriverAssignment = () => {
    const drivers = [
      { 
        id: 1, 
        name: 'John Kamau', 
        phone: '+254 712 345 678', 
        vehicle: 'Toyota Probox KCD 123A',
        rating: '4.8',
        eta: '15-25 mins',
        photo: '👨🏾‍💼'
      },
      { 
        id: 2, 
        name: 'Mary Wanjiku', 
        phone: '+254 723 456 789', 
        vehicle: 'Nissan Van KAB 456B',
        rating: '4.9',
        eta: '20-30 mins',
        photo: '👩🏾‍💼'
      },
      { 
        id: 3, 
        name: 'David Ochieng', 
        phone: '+254 734 567 890', 
        vehicle: 'Motorcycle KMN 789C',
        rating: '4.7',
        eta: '10-15 mins',
        photo: '👨🏾‍💼'
      }
    ];

    const assignedDriver = drivers[Math.floor(Math.random() * drivers.length)];
    setDriverInfo(assignedDriver);
    
    setTimeout(() => {
      setOrderStatus('assigned');
      
      // Simulate pickup
      setTimeout(() => {
        setOrderStatus('picked_up');
        
        // Simulate delivery
        setTimeout(() => {
          setOrderStatus('delivered');
          // Clear cart from localStorage when order is delivered
          localStorage.removeItem('greenWellsCart');
        }, 15000);
      }, 10000);
    }, 2000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(price);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2F9E44] mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900">Loading your cart...</h2>
        </div>
      </div>
    );
  }

  // Safe cart length check
  const cartLength = cart ? cart.length : 0;
  const cartItems = cart || [];

  if (cartLength === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Add some gas cylinders to proceed with checkout</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-[#2F9E44] text-white px-6 py-3 rounded-lg hover:bg-[#1E7E34] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const totalCartValue = cartItems.reduce((total, item) => total + (item.price || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-[#2F9E44] hover:text-[#1E7E34]"
            >
              <span>←</span>
              <span>Back to Shop</span>
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Green <span className="text-[#2F9E44]">Wells</span>
              </h1>
              <p className="text-sm text-gray-600">Checkout & Tracking</p>
            </div>
            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`flex flex-col items-center ${
                  step >= stepNumber ? 'text-[#2F9E44]' : 'text-gray-400'
                }`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    step >= stepNumber 
                      ? 'bg-[#2F9E44] border-[#2F9E44] text-white' 
                      : 'border-gray-300'
                  } font-bold`}>
                    {stepNumber}
                  </div>
                  <span className="text-xs mt-2 font-medium">
                    {stepNumber === 1 && 'Location'}
                    {stepNumber === 2 && 'Details'}
                    {stepNumber === 3 && 'Confirm'}
                    {stepNumber === 4 && 'Track'}
                  </span>
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-1 ${
                    step > stepNumber ? 'bg-[#2F9E44]' : 'bg-gray-300'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step 1: Location Access */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📍</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Enable Location Services
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Allow us to access your location for faster delivery and accurate tracking
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="text-left p-4 bg-green-50 rounded-lg">
                <div className="text-2xl mb-2">🚚</div>
                <h4 className="font-semibold text-gray-900 mb-2">Faster Delivery</h4>
                <p className="text-gray-600 text-sm">Quick route optimization for our drivers</p>
              </div>
              <div className="text-left p-4 bg-green-50 rounded-lg">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-semibold text-gray-900 mb-2">Accurate Tracking</h4>
                <p className="text-gray-600 text-sm">Real-time delivery updates</p>
              </div>
            </div>

            <button
              onClick={requestLocation}
              className="bg-[#2F9E44] hover:bg-[#1E7E34] text-white font-semibold py-4 px-12 rounded-xl transition-all duration-200 transform hover:scale-105 text-lg"
            >
              Allow Location Access
            </button>
            
            <button
              onClick={() => setStep(3)}
              className="block mx-auto mt-4 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Skip and enter address manually
            </button>
          </div>
        )}

        {/* Step 2: Location Loading */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-[#2F9E44] mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Getting Your Location
            </h2>
            <p className="text-gray-600">
              Please allow location access in your browser...
            </p>
          </div>
        )}

        {/* Step 3: User Information Form */}
        {step === 3 && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.weight}</div>
                    </div>
                    <div className="font-bold text-[#2F9E44]">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#2F9E44]">
                    {formatPrice(totalCartValue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery Information</h3>
              <form onSubmit={submitOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F9E44] focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={userInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F9E44] focus:border-transparent"
                    placeholder="e.g., 0712 345 678"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address *
                  </label>
                  <textarea
                    name="address"
                    value={userInfo.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F9E44] focus:border-transparent"
                    placeholder="Enter your complete delivery address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={userInfo.additionalNotes}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F9E44] focus:border-transparent"
                    placeholder="Any special delivery instructions..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2F9E44] hover:bg-[#1E7E34] text-white font-semibold py-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Confirm Order & Pay
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Step 4: Order Tracking */}
        {step === 4 && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Order Header */}
            <div className="bg-gradient-to-r from-[#2F9E44] to-[#1E7E34] text-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Order #{order?.id}</h2>
                  <p className="opacity-90">Placed on {order?.timestamp?.toLocaleDateString('en-KE', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{formatPrice(order?.total || 0)}</div>
                  <div className="text-sm opacity-90">{cartLength} item(s)</div>
                </div>
              </div>
            </div>

            {/* Tracking Visualization */}
            <div className="p-6">
              <div className="max-w-2xl mx-auto">
                {/* Tracking Steps */}
                <div className="relative">
                  {/* Connection Line */}
                  <div className="absolute left-8 top-0 h-full w-1 bg-gray-200 -z-10"></div>
                  
                  {[
                    { status: 'confirmed', icon: '✅', title: 'Order Confirmed', description: 'We have received your order' },
                    { status: 'preparing', icon: '📦', title: 'Preparing Order', description: 'Quality checking your cylinder' },
                    { status: 'assigned', icon: '👨🏾‍💼', title: 'Driver Assigned', description: 'Delivery partner on the way' },
                    { status: 'picked_up', icon: '🚚', title: 'Picked Up', description: 'Order collected from station' },
                    { status: 'delivered', icon: '🎉', title: 'Delivered', description: 'Order delivered successfully' }
                  ].map((stepItem, index) => (
                    <div key={stepItem.status} className="flex items-center mb-8 last:mb-0">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl z-10 ${
                        getStatusIndex(orderStatus) >= index 
                          ? 'bg-[#2F9E44] text-white animate-pulse' 
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        {stepItem.icon}
                      </div>
                      <div className="ml-6 flex-1">
                        <h3 className={`font-semibold text-lg ${
                          getStatusIndex(orderStatus) >= index ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {stepItem.title}
                        </h3>
                        <p className={`${
                          getStatusIndex(orderStatus) >= index ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {stepItem.description}
                        </p>
                        
                        {/* Driver Info */}
                        {stepItem.status === 'assigned' && driverInfo && getStatusIndex(orderStatus) >= index && (
                          <div className="mt-3 p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center space-x-4">
                              <div className="text-3xl">{driverInfo.photo}</div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{driverInfo.name}</h4>
                                <p className="text-sm text-gray-600">Vehicle: {driverInfo.vehicle}</p>
                                <p className="text-sm text-gray-600">Rating: {driverInfo.rating} ⭐</p>
                                <p className="text-sm text-green-600 font-semibold">ETA: {driverInfo.eta}</p>
                              </div>
                              <a 
                                href={`tel:${driverInfo.phone}`}
                                className="bg-[#2F9E44] text-white px-4 py-2 rounded-lg hover:bg-[#1E7E34] transition-colors"
                              >
                                Call
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live Map Simulation */}
                {orderStatus === 'assigned' && driverInfo && (
                  <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="text-2xl mr-2">🗺️</span>
                      Live Delivery Tracking
                    </h3>
                    <div className="bg-white p-4 rounded border">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-sm text-gray-600">Driver is on the way to you</div>
                        <div className="text-sm font-semibold text-[#2F9E44]">{driverInfo.eta}</div>
                      </div>
                      <div className="h-32 bg-gradient-to-r from-green-100 to-green-200 rounded relative">
                        {/* Animated driver marker */}
                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 animate-pulse">
                          <div className="bg-[#2F9E44] text-white p-2 rounded-full shadow-lg">
                            🚗
                          </div>
                        </div>
                        {/* Destination marker */}
                        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                          <div className="bg-red-500 text-white p-2 rounded-full">
                            📍
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Delivered Celebration */}
                {orderStatus === 'delivered' && (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4 animate-bounce">🎉</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Delivered Successfully!</h3>
                    <p className="text-gray-600 mb-6">Your Green Wells gas cylinder has been delivered safely.</p>
                    <div className="flex space-x-4 justify-center">
                      <button 
                        onClick={() => navigate('/dashboard')}
                        className="bg-[#2F9E44] text-white px-6 py-3 rounded-lg hover:bg-[#1E7E34] transition-colors"
                      >
                        Order Again
                      </button>
                      <button className="border border-[#2F9E44] text-[#2F9E44] px-6 py-3 rounded-lg hover:bg-green-50 transition-colors">
                        Rate Delivery
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get status index for tracking
const getStatusIndex = (status) => {
  const statusOrder = ['confirmed', 'preparing', 'assigned', 'picked_up', 'delivered'];
  return statusOrder.indexOf(status);
};

export default Checkout;