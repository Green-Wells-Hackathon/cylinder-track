import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../../firebase';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  
  const [step, setStep] = useState(1);
  const [userLocation, setUserLocation] = useState(null);
  const [orderStatus, setOrderStatus] = useState('pending');
  const [driverInfo, setDriverInfo] = useState(null);
  const [order, setOrder] = useState(null);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderId, setOrderId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [safetyTips, setSafetyTips] = useState([]);
  const [orderUpdates, setOrderUpdates] = useState(null);

  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    address: '',
    additionalNotes: '',
    email: '',
    paymentMethod: 'mpesa'
  });

  // Default team contacts
  const teamContacts = {
    admin: {
      name: 'Green Wells Dispatch',
      phone: '+254712345678',
      email: 'dispatch@greenwells.co.ke'
    },
    support: {
      name: 'Customer Support',
      phone: '+254712345678',
      email: 'support@greenwells.co.ke'
    }
  };

  // Sample drivers data
  const sampleDrivers = [
    {
      id: 'driver_001',
      name: 'John Kamau',
      phone: '+254712345678',
      vehicle: 'Toyota Probox KCD 123A',
      rating: '4.8',
      photo: '👨🏾‍💼'
    },
    {
      id: 'driver_002',
      name: 'Mary Wanjiku', 
      phone: '+254723456789',
      vehicle: 'Nissan Van KAB 456B',
      rating: '4.9',
      photo: '👩🏾‍💼'
    }
  ];

  // Load cart and initialize
  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        let cartData = [];
        
        // Try location state first
        if (location.state?.cart && Array.isArray(location.state.cart)) {
          cartData = location.state.cart;
        } else {
          // Fallback to localStorage
          const savedCart = localStorage.getItem('greenWellsCart');
          if (savedCart) {
            try {
              cartData = JSON.parse(savedCart);
              if (!Array.isArray(cartData)) {
                cartData = [];
              }
            } catch (error) {
              console.error('Error parsing cart:', error);
              cartData = [];
            }
          }
        }

        // Validate cart items
        const validCartData = cartData.filter(item => 
          item && 
          typeof item === 'object' && 
          item.id && 
          item.name && 
          typeof item.price === 'number'
        );

        setCart(validCartData);
        
        if (validCartData.length === 0) {
          setTimeout(() => navigate('/home'), 2000);
          return;
        }

        // Set estimated delivery time
        const now = new Date();
        const deliveryTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        setEstimatedDelivery(deliveryTime.toLocaleTimeString('en-KE', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }));

        loadSafetyTips(validCartData);

      } catch (error) {
        console.error('Error initializing checkout:', error);
        setCart([]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCheckout();
  }, [navigate, location.state]);

  const loadSafetyTips = (cartItems) => {
    const tips = [
      "🔍 Always check for gas leaks with soapy water before use",
      "🚫 Never use gas cylinders in enclosed spaces without ventilation",
      "🔥 Keep cylinders upright and away from heat sources",
      "👨‍👩‍👧‍👦 Educate all family members on gas safety procedures",
      "📞 Save our emergency line: 0712 345 678",
      "🔧 Ensure all connections are tight before turning on gas"
    ];

    if (cartItems.some(item => item.name.includes('Package'))) {
      tips.push("🛠️ Our certified technician will install your stove safely");
      tips.push("💨 Ensure proper ventilation when using your new stove");
      tips.push("📖 Read the user manual carefully before operation");
    }

    if (cartItems.some(item => parseInt(item.weight) >= 12.5)) {
      tips.push("🏠 Large cylinders should be placed on stable, flat surfaces");
      tips.push("🚚 Use proper handling equipment for large cylinders");
    }

    if (cartItems.some(item => item.name.includes('Emergency'))) {
      tips.push("🚨 Emergency delivery - driver will contact you directly");
      tips.push("⏱️ Keep your phone nearby for quick coordination");
    }

    setSafetyTips(tips);
  };

  // Simulate order updates
  useEffect(() => {
    if (!orderId) return;

    const simulateOrderUpdates = () => {
      const updates = [
        { status: 'pending', delay: 2000, message: 'Order received - awaiting approval' },
        { status: 'approved', delay: 5000, message: 'Order approved by admin' },
        { status: 'assigned', delay: 8000, message: 'Driver assigned to your order' },
        { status: 'picked_up', delay: 12000, message: 'Driver has picked up your order' },
        { status: 'out_for_delivery', delay: 15000, message: 'Driver is in your area' },
        { status: 'delivered', delay: 20000, message: 'Order delivered successfully' }
      ];

      updates.forEach(update => {
        setTimeout(() => {
          setOrderStatus(update.status);
          setOrderUpdates({
            status: update.status,
            message: update.message,
            timestamp: new Date()
          });

          // Assign a random driver when status becomes 'assigned'
          if (update.status === 'assigned') {
            const randomDriver = sampleDrivers[Math.floor(Math.random() * sampleDrivers.length)];
            setDriverInfo({
              ...randomDriver,
              eta: '15-25 mins',
              assigned_at: new Date()
            });
          }

          // Clear cart when delivered
          if (update.status === 'delivered') {
            localStorage.removeItem('greenWellsCart');
          }
        }, update.delay);
      });
    };

    simulateOrderUpdates();
  }, [orderId]);

  const requestLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStep(3);
      return;
    }

    setStep(2);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        reverseGeocode(latitude, longitude);
      },
      (error) => {
        console.error('Location error:', error);
        setStep(3);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000,
        maximumAge: 60000
      }
    );
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.address) {
          const addressParts = [
            data.address.road,
            data.address.house_number,
            data.address.suburb || data.address.neighbourhood,
            data.address.city || data.address.town || data.address.county || 'Nairobi'
          ].filter(part => part).join(', ');
          
          setUserInfo(prev => ({ ...prev, address: addressParts }));
        }
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    } finally {
      setStep(3);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create order in Firestore
  const createOrder = async (orderData) => {
    try {
      console.log('Saving order to Firestore with data:', orderData);
      
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        created_at: serverTimestamp(),
        admin_approved: false,
        assigned_driver_id: null,
        assigned_driver_name: "",
        assigned_driver_phone: "",
        customer_feedback: "",
        customer_rating: null,
        payment_status: 'pending'
      });

      console.log('Order saved to Firestore with ID:', docRef.id);
      return docRef.id;
      
    } catch (error) {
      console.error('Error saving order to Firestore:', error);
      throw new Error('Failed to save order to database: ' + error.message);
    }
  };

  // Notify admin team
  const notifyAdminTeam = async (orderId, orderData) => {
    console.log('Admin notified of new order:', {
      orderId,
      customer: orderData.customer_name,
      phone: orderData.customer_phone,
      amount: orderData.amount
    });
    
    return Promise.resolve();
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert('Please log in to place an order. You will be redirected to the login page.');
      navigate('/login');
      return;
    }

    // Comprehensive validation
    if (!userInfo.name.trim()) {
      alert('Please enter your full name');
      return;
    }

    if (!userInfo.phone.trim()) {
      alert('Please enter your phone number');
      return;
    }

    // Enhanced phone validation for Kenyan numbers
    const phoneRegex = /^(\+?254|0)?[17]\d{8}$/;
    const cleanPhone = userInfo.phone.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      alert('Please enter a valid Kenyan phone number (e.g., 0712 345 678 or 254712345678)');
      return;
    }

    if (!userInfo.address.trim()) {
      alert('Please enter your delivery address');
      return;
    }

    if (userInfo.address.trim().length < 10) {
      alert('Please provide a more detailed delivery address with landmarks');
      return;
    }

    setIsSubmitting(true);

    // Use authenticated user's email
    const customerEmail = currentUser.email;
    console.log('Using customer email:', customerEmail);

    const orderData = {
      // Customer Information
      customer_name: userInfo.name.trim(),
      customer_phone: cleanPhone,
      customer_email: customerEmail, // Always use authenticated user's email
      customer_address: userInfo.address.trim(),
      additional_notes: userInfo.additionalNotes.trim(),
      
      // Order Details
      amount: cart.reduce((total, item) => total + (item.price || 0), 0),
      cylinder_ids: cart.map(item => item.id),
      cylinders: cart.map(item => ({
        id: item.id,
        name: item.name,
        weight: item.weight,
        price: item.price,
        image: item.image
      })),
      
      // Location
      destination_location: userLocation ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        address: userInfo.address.trim()
      } : null,
      
      // Status
      status: 'pending',
      payment_status: 'pending',
      payment_method: userInfo.paymentMethod,
      
      // Additional Info
      safety_tips: safetyTips,
      
      // Team workflow fields
      dispatcher_notes: "",
      driver_notes: "",
      signature_required: true,
      
      // Initialize driver fields
      assigned_driver_id: null,
      assigned_driver_name: "",
      assigned_driver_phone: "",
      admin_approved: false,
      customer_feedback: "",
      customer_rating: null
    };

    try {
      // Create order in Firestore
      const newOrderId = await createOrder(orderData);
      setOrderId(newOrderId);
      
      const newOrder = {
        id: newOrderId,
        items: cart,
        total: orderData.amount,
        timestamp: new Date(),
        status: 'pending'
      };
      setOrder(newOrder);

      // Clear cart from localStorage
      localStorage.removeItem('greenWellsCart');

      // Notify admin team (non-blocking)
      notifyAdminTeam(newOrderId, orderData).catch(error => {
        console.warn('Admin notification failed:', error);
      });

      // Move to tracking step
      setStep(4);

    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order. Please try again. Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    if (typeof price !== 'number') {
      return 'KES 0';
    }
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
          <h2 className="text-xl font-bold text-gray-900">Loading your order...</h2>
          <p className="text-gray-600 mt-2">Preparing your checkout experience</p>
        </div>
      </div>
    );
  }

  // Handle empty cart
  if (cart.length === 0 && step < 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some gas cylinders to proceed with checkout</p>
          <button 
            onClick={() => navigate('/home')}
            className="bg-[#2F9E44] text-white px-8 py-4 rounded-xl hover:bg-[#1E7E34] transition-all duration-200 transform hover:scale-105 font-semibold"
          >
            🌿 Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const totalCartValue = cart.reduce((total, item) => total + (item.price || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/home')}
              className="flex items-center space-x-2 text-[#2F9E44] hover:text-[#1E7E34] transition-colors group"
            >
              <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
              <span className="font-semibold">Back to Shop</span>
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Green <span className="text-[#2F9E44]">Wells</span>
              </h1>
              <p className="text-sm text-gray-600">Safe Gas Delivery in Kenya</p>
            </div>
            <div className="w-24 text-right">
              {cart.length > 0 && (
                <div className="text-sm text-gray-600">
                  {cart.length} item{cart.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-2 md:space-x-4">
            {[
              { number: 1, label: 'Location', icon: '📍' },
              { number: 2, label: 'Details', icon: '📝' },
              { number: 3, label: 'Confirm', icon: '✅' },
              { number: 4, label: 'Track', icon: '🚚' }
            ].map((stepItem, index) => (
              <React.Fragment key={stepItem.number}>
                <div className={`flex flex-col items-center transition-all duration-300 ${
                  step >= stepItem.number ? 'text-[#2F9E44] scale-110' : 'text-gray-400'
                }`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    step >= stepItem.number 
                      ? 'bg-[#2F9E44] border-[#2F9E44] text-white shadow-lg' 
                      : 'border-gray-300 bg-white'
                  } font-bold text-lg`}>
                    {step >= stepItem.number ? stepItem.number : stepItem.icon}
                  </div>
                  <span className="text-xs mt-2 font-medium hidden sm:block">
                    {stepItem.label}
                  </span>
                </div>
                {index < 3 && (
                  <div className={`w-8 md:w-16 h-1 transition-all duration-500 ${
                    step > stepItem.number ? 'bg-[#2F9E44]' : 'bg-gray-300'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step 1: Location Access */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <span className="text-5xl">📍</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Enable Location for Faster Delivery
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Share your location to help our drivers find you quickly and ensure accurate delivery tracking
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                { icon: '🚚', title: 'Faster Routes', desc: 'Optimized delivery paths' },
                { icon: '🎯', title: 'Pinpoint Accuracy', desc: 'Exact delivery location' },
                { icon: '⏱️', title: 'Live ETA', desc: 'Real-time tracking' }
              ].map((feature, idx) => (
                <div key={idx} className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <button
                onClick={requestLocation}
                className="w-full bg-[#2F9E44] hover:bg-[#1E7E34] text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 text-lg shadow-lg"
              >
                📍 Allow Location Access
              </button>
              
              <button
                onClick={() => setStep(3)}
                className="w-full border-2 border-gray-300 text-gray-600 hover:border-[#2F9E44] hover:text-[#2F9E44] font-semibold py-4 px-8 rounded-xl transition-all duration-200"
              >
                Enter Address Manually
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                🔒 Your location data is only used for delivery and is never stored or shared
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Location Loading */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md mx-auto">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#2F9E44] border-t-transparent mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Finding Your Location
            </h2>
            <p className="text-gray-600 mb-4">
              Please allow location access in your browser...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#2F9E44] h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Step 3: User Information Form */}
        {step === 3 && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Summary & Safety Tips */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📦</span>
                  Order Summary
                </h3>
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-start py-3 border-b border-gray-100">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{item.name}</div>
                        <div className="text-xs text-gray-600">{item.weight}</div>
                      </div>
                      <div className="font-bold text-[#2F9E44] text-sm">
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
                  {estimatedDelivery && (
                    <div className="text-sm text-green-600 mt-2 flex items-center">
                      <span className="mr-2">⏰</span>
                      Estimated delivery: {estimatedDelivery}
                    </div>
                  )}
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-yellow-50 rounded-2xl shadow-lg p-6 border border-yellow-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">⚠️</span>
                  Safety Tips
                </h3>
                <ul className="space-y-2">
                  {safetyTips.map((tip, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="mr-2 mt-1 flex-shrink-0">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Delivery Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-3xl mr-3">🚚</span>
                  Delivery Information
                </h3>
                <form onSubmit={submitOrder} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={userInfo.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2F9E44] focus:border-transparent transition-all duration-200"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={userInfo.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2F9E44] focus:border-transparent transition-all duration-200"
                        placeholder="0712 345 678"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Format: 0712 345 678 or 254712345678</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2F9E44] focus:border-transparent transition-all duration-200"
                      placeholder="your.email@example.com"
                      disabled={auth.currentUser} // Disable if user is logged in
                    />
                    {auth.currentUser && (
                      <p className="text-xs text-green-600 mt-1">
                        Using your account email: {auth.currentUser.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Address *
                    </label>
                    <textarea
                      name="address"
                      value={userInfo.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2F9E44] focus:border-transparent transition-all duration-200"
                      placeholder="Enter your complete delivery address including landmarks, building name, floor, etc."
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Please provide detailed address for accurate delivery</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: 'mpesa', name: 'M-Pesa', icon: '📱' },
                        { id: 'cash', name: 'Cash on Delivery', icon: '💵' }
                      ].map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            userInfo.paymentMethod === method.id
                              ? 'border-[#2F9E44] bg-green-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={userInfo.paymentMethod === method.id}
                            onChange={handleInputChange}
                            className="hidden"
                          />
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{method.icon}</span>
                            <span className="font-semibold">{method.name}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      name="additionalNotes"
                      value={userInfo.additionalNotes}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2F9E44] focus:border-transparent transition-all duration-200"
                      placeholder="Gate code, floor number, special instructions, delivery time preferences..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-[#2F9E44] hover:bg-[#1E7E34] text-white font-semibold py-4 rounded-xl transition-all duration-200 transform hover:scale-105 text-lg ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing Order...</span>
                      </div>
                    ) : (
                      `Confirm Order - ${formatPrice(totalCartValue)}`
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Order Tracking */}
        {step === 4 && (
          <div className="max-w-4xl mx-auto">
            {/* Order Header */}
            <div className="bg-gradient-to-r from-[#2F9E44] to-[#1E7E34] text-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    Order #{orderId?.replace('GW-', '').slice(-8).toUpperCase()}
                  </h2>
                  <p className="opacity-90 text-lg">
                    Placed on {new Date().toLocaleDateString('en-KE', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  {orderUpdates && (
                    <p className="text-sm opacity-80 mt-1">
                      Last update: {orderUpdates.timestamp.toLocaleTimeString()}
                    </p>
                  )}
                </div>
                <div className="text-center md:text-right">
                  <div className="text-3xl font-bold">{formatPrice(order?.total || 0)}</div>
                  <div className="text-lg opacity-90">{cart.length} item{cart.length !== 1 ? 's' : ''}</div>
                  <div className="text-sm opacity-80 mt-1">
                    {userInfo.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Cash'} • {orderStatus.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Status Badge */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                  <span className="font-semibold">Live Order Tracking</span>
                </div>
                <span className="text-sm opacity-90">Real-time Updates</span>
              </div>
            </div>

            {/* Enhanced Tracking Visualization */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="max-w-2xl mx-auto">
                  {/* Tracking Steps */}
                  <div className="relative">
                    <div className="absolute left-8 top-0 h-full w-1 bg-gray-200 -z-10"></div>
                    
                    {[
                      { 
                        status: 'pending', 
                        icon: '📝', 
                        title: 'Order Received', 
                        description: 'We have received your order',
                        teamAction: 'Awaiting admin approval'
                      },
                      { 
                        status: 'approved', 
                        icon: '✅', 
                        title: 'Order Approved', 
                        description: 'Admin has approved your order',
                        teamAction: 'Preparing for dispatch'
                      },
                      { 
                        status: 'assigned', 
                        icon: '👨🏾‍💼', 
                        title: 'Driver Assigned', 
                        description: 'Delivery partner assigned',
                        teamAction: 'Driver heading to station'
                      },
                      { 
                        status: 'picked_up', 
                        icon: '🚚', 
                        title: 'Picked Up', 
                        description: 'Driver has collected your order',
                        teamAction: 'On the way to you'
                      },
                      { 
                        status: 'out_for_delivery', 
                        icon: '🎯', 
                        title: 'Out for Delivery', 
                        description: 'Driver is in your area',
                        teamAction: 'Near your location'
                      },
                      { 
                        status: 'delivered', 
                        icon: '🎉', 
                        title: 'Delivered', 
                        description: 'Order delivered successfully',
                        teamAction: 'Delivery completed'
                      }
                    ].map((stepItem, index) => {
                      const isActive = getStatusIndex(orderStatus) >= index;
                      const isCurrent = getStatusIndex(orderStatus) === index;
                      
                      return (
                        <div key={stepItem.status} className="flex items-center mb-8 last:mb-0">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl z-10 transition-all duration-500 ${
                            isActive 
                              ? 'bg-[#2F9E44] text-white shadow-lg scale-110' 
                              : 'bg-gray-200 text-gray-400'
                          } ${isCurrent ? 'animate-pulse ring-4 ring-green-200' : ''}`}>
                            {stepItem.icon}
                          </div>
                          <div className="ml-6 flex-1">
                            <h3 className={`font-semibold text-lg transition-colors duration-300 ${
                              isActive ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              {stepItem.title}
                              {isCurrent && (
                                <span className="ml-2 text-sm bg-[#2F9E44] text-white px-2 py-1 rounded-full animate-pulse">
                                  Live
                                </span>
                              )}
                            </h3>
                            <p className={`transition-colors duration-300 ${
                              isActive ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                              {stepItem.description}
                            </p>
                            <p className="text-sm text-green-600 font-medium mt-1">
                              {stepItem.teamAction}
                            </p>
                            
                            {/* Driver Info */}
                            {stepItem.status === 'assigned' && driverInfo && isActive && (
                              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 shadow-sm">
                                <div className="flex items-center space-x-4">
                                  <div className="text-4xl bg-white p-3 rounded-full shadow-sm">
                                    {driverInfo.photo}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 text-lg">{driverInfo.name}</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                      <div className="text-gray-600">
                                        <span className="font-semibold">Vehicle:</span> {driverInfo.vehicle}
                                      </div>
                                      <div className="text-gray-600">
                                        <span className="font-semibold">Rating:</span> {driverInfo.rating} ⭐
                                      </div>
                                      <div className="text-green-600 font-semibold col-span-2">
                                        🎯 ETA: {driverInfo.eta}
                                      </div>
                                    </div>
                                    {driverInfo.assigned_at && (
                                      <p className="text-xs text-gray-500 mt-2">
                                        Assigned: {driverInfo.assigned_at.toLocaleTimeString()}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex flex-col space-y-2">
                                    <a 
                                      href={`tel:${driverInfo.phone}`}
                                      className="bg-[#2F9E44] text-white px-4 py-2 rounded-lg hover:bg-[#1E7E34] transition-colors text-center font-semibold"
                                    >
                                      📞 Call Driver
                                    </a>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Admin Contact for Pending Orders */}
                            {stepItem.status === 'pending' && isActive && (
                              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <div className="flex items-center space-x-4">
                                  <div className="text-4xl bg-white p-3 rounded-full shadow-sm">👨‍💼</div>
                                  <div className="flex-1">
                                    <h4 className="font-bold text-gray-900">Contact Dispatch</h4>
                                    <p className="text-sm text-gray-600">{teamContacts.admin.name}</p>
                                    <p className="text-sm text-gray-600">{teamContacts.admin.phone}</p>
                                    <p className="text-blue-600 font-semibold">For order approval status</p>
                                  </div>
                                  <a 
                                    href={`tel:${teamContacts.admin.phone}`}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                                  >
                                    Call Dispatch
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Enhanced Live Map Simulation */}
                  {['assigned', 'picked_up', 'out_for_delivery'].includes(orderStatus) && driverInfo && (
                    <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200 shadow-sm">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                        <span className="text-2xl mr-2">🗺️</span>
                        Live Delivery Tracking
                        <span className="ml-2 text-sm bg-red-500 text-white px-2 py-1 rounded-full animate-pulse">
                          Live
                        </span>
                      </h3>
                      <div className="bg-white p-4 rounded-xl border shadow-inner">
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-sm text-gray-600 font-medium">
                            🚗 Driver is on the way to you
                          </div>
                          <div className="text-lg font-bold text-[#2F9E44]">
                            {driverInfo.eta}
                          </div>
                        </div>
                        <div className="h-32 bg-gradient-to-r from-green-100 via-yellow-100 to-red-100 rounded-lg relative overflow-hidden">
                          {/* Animated route line */}
                          <div className="absolute top-1/2 left-0 right-4 h-1 bg-gray-400 transform -translate-y-1/2">
                            <div className="h-1 bg-[#2F9E44] animate-pulse" style={{ width: '70%' }}></div>
                          </div>
                          
                          {/* Animated driver vehicle */}
                          <div 
                            className="absolute top-1/2 transform -translate-y-1/2 animate-bounce"
                            style={{ left: '65%' }}
                          >
                            <div className="bg-[#2F9E44] text-white p-3 rounded-full shadow-lg animate-pulse">
                              🚗
                            </div>
                          </div>
                          
                          {/* Destination marker */}
                          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                            <div className="bg-red-500 text-white p-3 rounded-full shadow-lg">
                              📍
                            </div>
                          </div>
                          
                          {/* Start marker */}
                          <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                            <div className="bg-green-500 text-white p-2 rounded-full shadow">
                              🏢
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>Green Wells Depot</span>
                          <span>Your Location</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Order Delivered Celebration */}
                  {orderStatus === 'delivered' && (
                    <div className="text-center py-12 bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl border border-green-200 shadow-sm">
                      <div className="text-8xl mb-6 animate-bounce">🎉</div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-3">
                        Order Delivered Successfully!
                      </h3>
                      <p className="text-gray-600 mb-6 text-lg">
                        Your Green Wells gas cylinder has been delivered safely. Enjoy clean cooking!
                      </p>
                      {orderUpdates?.timestamp && (
                        <p className="text-sm text-gray-500 mb-6 bg-white inline-block px-4 py-2 rounded-full shadow-sm">
                          🕒 Delivered at: {orderUpdates.timestamp.toLocaleString('en-KE')}
                        </p>
                      )}
                      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                        <button 
                          onClick={() => navigate('/home')}
                          className="bg-[#2F9E44] text-white px-8 py-4 rounded-xl hover:bg-[#1E7E34] transition-all duration-200 transform hover:scale-105 font-semibold text-lg"
                        >
                          🌿 Order Again
                        </button>
                        <button className="border-2 border-[#2F9E44] text-[#2F9E44] px-8 py-4 rounded-xl hover:bg-green-50 transition-all duration-200 transform hover:scale-105 font-semibold text-lg">
                          ⭐ Rate Delivery
                        </button>
                      </div>
                      
                      {/* Safety Reminder */}
                      <div className="mt-8 p-4 bg-yellow-100 rounded-lg border border-yellow-300 max-w-md mx-auto">
                        <p className="text-sm text-yellow-800 font-medium">
                          🔒 Remember: Always store your gas cylinder in a well-ventilated area away from heat sources.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl bg-blue-100 p-3 rounded-full">📞</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Need Help?</h4>
                    <p className="text-gray-600">Our support team is here for you</p>
                  </div>
                </div>
                <a 
                  href={`tel:${teamContacts.support.phone}`}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                >
                  Call Support
                </a>
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
  const statusOrder = ['pending', 'approved', 'assigned', 'picked_up', 'out_for_delivery', 'delivered'];
  return statusOrder.indexOf(status);
};

export default Checkout;