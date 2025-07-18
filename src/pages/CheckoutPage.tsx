import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiEdit3,
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiShoppingBag, 
  FiCheck, 
  FiArrowRight, 
  FiArrowLeft,
  FiSmartphone,
  FiDollarSign,
  FiLock
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { usePayment } from '../context/PaymentContext';
import { ShippingAddress, JazzCashInfo, PaymentMethod } from '../types';
import { jazzCashService } from '../services/JazzCashService';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { state: cartState, clearCart } = useCart();
  const { state: orderState, createOrder } = useOrder();
  const { getActiveAccounts } = usePayment();
  
  // Get active accounts for bank transfer options
  const activeAccounts = getActiveAccounts().filter(account => 
    account.paymentMethodType === 'bank_transfer'
  );
  
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(activeAccounts[0]?.id || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });
  
  const [jazzCashInfo, setJazzCashInfo] = useState<JazzCashInfo>({
    mobileNumber: '',
    cnic: '',
    customerName: '',
  });
  
  // Calculate totals
  const subtotal = cartState.total;
  const tax = subtotal * 0.08;
  const shipping = subtotal > 27750 ? 0 : 2775; // Rs. 27,750 (equivalent to $100) for free shipping, Rs. 2,775 shipping charge
  const total = subtotal + tax + shipping;
  
  // Format currency in PKR
  const formatCurrency = (amount: number): string => {
    return `Rs. ${amount.toLocaleString('en-PK')}`;
  };
  
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };
  
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      let paymentInfo: any = {
        method: paymentMethod,
        selectedAccount: paymentMethod === 'bank_transfer' ? 
          activeAccounts.find(acc => acc.id === selectedAccountId) : undefined,
        jazzCash: paymentMethod === 'jazzcash' ? jazzCashInfo : undefined,
      };
      
      // Handle JazzCash payment
      if (paymentMethod === 'jazzcash') {
        const orderNumber = `MW${Date.now()}`;
        const jazzCashRequest = {
          amount: total,
          billReference: orderNumber,
          description: `MiniHub Order - ${cartState.items.length} item(s)`,
          currency: 'PKR',
          customerInfo: jazzCashInfo,
          shippingAddress: shippingAddress,
          orderNumber: orderNumber,
          language: 'EN',
        };
        
        const jazzCashResponse = await jazzCashService.processPayment(jazzCashRequest);
        paymentInfo.jazzCashResponse = jazzCashResponse;
        
        // If payment requires redirection
        if (jazzCashResponse.redirectUrl) {
          // Open JazzCash payment page
          window.open(jazzCashResponse.redirectUrl, '_blank');
          
          // For sandbox testing, we'll simulate successful payment after a delay
          setTimeout(() => {
            alert('JazzCash payment processed successfully! (Sandbox Mode)');
          }, 3000);
        }
        
        // Check if payment was successful
        if (jazzCashResponse.status === 'failed') {
          throw new Error(jazzCashResponse.responseMessage);
        }
      }
      
      await createOrder(cartState.items, shippingAddress, paymentInfo);
      clearCart();
      setOrderComplete(true);
      setCurrentStep(4);
    } catch (error) {
      console.error('Order creation failed:', error);
      alert(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const steps = [
    { number: 1, title: 'Shipping Address', icon: FiMapPin },
    { number: 2, title: 'Payment Method', icon: FiShoppingBag },
    { number: 3, title: 'Review Order', icon: FiCheck },
    { number: 4, title: 'Confirmation', icon: FiCheck },
  ];
  
  if (cartState.items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-navy-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-navy-900 mb-4">Your cart is empty</h1>
          <p className="text-navy-600 mb-8">Add some items to your cart before checking out.</p>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-navy-50 py-20">
      <div className="container mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4 mb-8">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                  currentStep >= step.number 
                    ? 'bg-orange-100 text-orange-600' 
                    : 'bg-white text-navy-400'
                }`}>
                  <step.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 ${
                    currentStep > step.number ? 'bg-orange-400' : 'bg-navy-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping Address */}
              {currentStep === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-lg shadow-soft p-8"
                >
                  <h2 className="text-2xl font-bold text-navy-900 mb-6">Shipping Address</h2>
                  
                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <FiEdit3 className="absolute left-3 top-3 w-5 h-5 text-navy-400" />
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={shippingAddress.fullName}
                          onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                        />
                      </div>
                      
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-3 w-5 h-5 text-navy-400" />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={shippingAddress.phone}
                          onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="relative">
                      <FiMail className="absolute left-3 top-3 w-5 h-5 text-navy-400" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={shippingAddress.email}
                        onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>
                    
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-3 w-5 h-5 text-navy-400" />
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <input
                        type="text"
                        placeholder="City"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                      
                      <input
                        type="text"
                        placeholder="State"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                        className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                      
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                        className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="btn-primary flex items-center space-x-2"
                      >
                        <span>Continue to Payment</span>
                        <FiArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
              
              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-lg shadow-soft p-8"
                >
                  <h2 className="text-2xl font-bold text-navy-900 mb-6">Payment Method</h2>
                  
                  {/* Payment Method Selection */}
                  <div className="space-y-4 mb-8">
                    {/* Cash on Delivery - Priority Option */}
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'cash_on_delivery' 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-navy-200 hover:border-orange-300'
                      }`}
                      onClick={() => setPaymentMethod('cash_on_delivery')}
                    >
                      <div className="flex items-center space-x-3">
                        <FiShoppingBag className="w-6 h-6 text-orange-600" />
                        <div>
                          <h3 className="font-semibold text-navy-900">Cash on Delivery</h3>
                          <p className="text-sm text-navy-600">Pay when you receive your order</p>
                        </div>
                        <div className="ml-auto">
                          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                            ✨ Recommended
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* JazzCash Mobile Wallet */}
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'jazzcash' 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-navy-200 hover:border-orange-300'
                      }`}
                      onClick={() => setPaymentMethod('jazzcash')}
                    >
                      <div className="flex items-center space-x-3">
                        <FiSmartphone className="w-6 h-6 text-orange-600" />
                        <div>
                          <h3 className="font-semibold text-navy-900">JazzCash Mobile Wallet</h3>
                          <p className="text-sm text-navy-600">Pay with your JazzCash mobile wallet</p>
                        </div>
                        <div className="ml-auto">
                          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded text-xs font-semibold">
                            🇵🇰 Pakistani
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bank Transfer */}
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'bank_transfer' 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-navy-200 hover:border-orange-300'
                      }`}
                      onClick={() => setPaymentMethod('bank_transfer')}
                    >
                      <div className="flex items-center space-x-3">
                        <FiDollarSign className="w-6 h-6 text-orange-600" />
                        <div>
                          <h3 className="font-semibold text-navy-900">Bank Transfer</h3>
                          <p className="text-sm text-navy-600">Transfer directly to our account</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    {/* Cash on Delivery - Enhanced Information */}
                    {paymentMethod === 'cash_on_delivery' && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2 mb-3">
                          <FiShoppingBag className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-green-900">Cash on Delivery Selected</h4>
                        </div>
                        <p className="text-sm text-green-800 mb-3">
                          Pay in cash when your order is delivered to your doorstep. 
                          Please have the exact amount ready for our delivery partner.
                        </p>
                        <div className="bg-green-100 p-3 rounded border border-green-300">
                          <h5 className="font-medium text-green-900 mb-2">💡 Important Notes:</h5>
                          <ul className="text-sm text-green-800 space-y-1">
                            <li>• No advance payment required</li>
                            <li>• Verify your order before payment</li>
                            <li>• Cash payment only (no cheques accepted)</li>
                            <li>• Keep exact change ready for convenience</li>
                          </ul>
                        </div>
                      </div>
                    )}
                      
                    {/* JazzCash Mobile Wallet */}
                    {paymentMethod === 'jazzcash' && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-4">
                          <FiLock className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600">JazzCash payments are secured by bank-grade encryption</span>
                        </div>
                        
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <h4 className="font-semibold text-purple-900 mb-2">💳 About JazzCash</h4>
                          <p className="text-sm text-purple-700">
                            JazzCash is Pakistan's leading mobile wallet service. Pay instantly using your mobile number 
                            without entering card details.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-navy-700 mb-2">
                              Customer Name *
                            </label>
                            <input
                              type="text"
                              placeholder="Enter your full name"
                              value={jazzCashInfo.customerName}
                              onChange={(e) => setJazzCashInfo({...jazzCashInfo, customerName: e.target.value})}
                              className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-navy-700 mb-2">
                              Mobile Number *
                            </label>
                            <input
                              type="tel"
                              placeholder="03XXXXXXXXX"
                              value={jazzCashInfo.mobileNumber}
                              onChange={(e) => setJazzCashInfo({...jazzCashInfo, mobileNumber: e.target.value})}
                              className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              pattern="[0-9]{11}"
                              maxLength={11}
                              required
                            />
                            <p className="text-xs text-navy-500 mt-1">
                              Enter your 11-digit mobile number (e.g., 03001234567)
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-2">
                            CNIC Number (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="12345-1234567-1"
                            value={jazzCashInfo.cnic}
                            onChange={(e) => setJazzCashInfo({...jazzCashInfo, cnic: e.target.value})}
                            className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            pattern="[0-9]{5}-[0-9]{7}-[0-9]{1}"
                            maxLength={15}
                          />
                          <p className="text-xs text-navy-500 mt-1">
                            CNIC helps verify your identity for secure transactions
                          </p>
                        </div>
                        
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                          <h4 className="font-semibold text-amber-900 mb-2">📱 Supported Networks</h4>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="text-amber-700">🎵 Jazz/Warid</div>
                            <div className="text-amber-700">📱 Ufone</div>
                            <div className="text-amber-700">📞 Telenor</div>
                            <div className="text-amber-700">🌐 Zong</div>
                            <div className="text-amber-700">💳 JazzCash</div>
                            <div className="text-amber-700">🏦 Bank Links</div>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-900 mb-2">✅ Payment Process</h4>
                          <ol className="text-sm text-green-700 space-y-1">
                            <li>1. You'll be redirected to JazzCash secure payment page</li>
                            <li>2. Enter your JazzCash PIN or mobile banking credentials</li>
                            <li>3. Confirm the payment amount and merchant details</li>
                            <li>4. Complete the transaction and return to MiniHub</li>
                          </ol>
                        </div>
                      </div>
                    )}
                    
                    {/* Bank Transfer */}
                    {paymentMethod === 'bank_transfer' && (
                      <div className="space-y-4">
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <h4 className="font-semibold text-navy-900 mb-2">Choose Account for Transfer</h4>
                          <div className="space-y-3">
                            {activeAccounts.map((account) => (
                              <label key={account.id} className="flex items-start space-x-3 cursor-pointer">
                                <input
                                  type="radio"
                                  name="bankAccount"
                                  value={account.id}
                                  checked={selectedAccountId === account.id}
                                  onChange={(e) => setSelectedAccountId(e.target.value)}
                                  className="mt-1"
                                  required
                                />
                                <div className="flex-1">
                                  <div className="font-medium text-navy-900">{account.accountName}</div>
                                  <div className="text-sm text-navy-600">{account.bankName}</div>
                                  <div className="text-sm text-navy-600">Account: {account.accountNumber}</div>
                                  {account.routingNumber && (
                                    <div className="text-sm text-navy-600">Routing: {account.routingNumber}</div>
                                  )}
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">Transfer Instructions</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Transfer the exact amount shown in your order summary</li>
                            <li>• Include your order number in the transfer reference</li>
                            <li>• Your order will be processed once payment is confirmed</li>
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="px-6 py-3 border border-navy-300 text-navy-600 rounded-lg hover:bg-navy-50 transition-colors flex items-center space-x-2"
                      >
                        <FiArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                      </button>
                      
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <span>Place Order</span>
                            <FiCheck className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
              
              {/* Step 4: Order Confirmation */}
              {currentStep === 4 && orderComplete && (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-lg shadow-soft p-8 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiCheck className="w-8 h-8 text-green-600" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-navy-900 mb-4">Order Confirmed!</h2>
                  <p className="text-navy-600 mb-6">
                    Thank you for your order. We'll send you a confirmation email shortly.
                  </p>
                  
                  {orderState.currentOrder && (
                    <div className="bg-navy-50 rounded-lg p-4 mb-6">
                      <p className="text-sm text-navy-600">Order Number</p>
                      <p className="text-lg font-bold text-navy-900">{orderState.currentOrder.orderNumber}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => navigate('/')}
                      className="btn-primary"
                    >
                      Continue Shopping
                    </button>
                    <button
                      onClick={() => navigate('/orders')}
                      className="px-6 py-3 border border-navy-300 text-navy-600 rounded-lg hover:bg-navy-50 transition-colors"
                    >
                      View Orders
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-soft p-6 sticky top-6">
              <h3 className="text-xl font-bold text-navy-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {cartState.items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-3">
                    <img
                      src={item.product.images[item.product.thumbnailIndex || 0]}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-navy-900 text-sm">{item.product.name}</h4>
                      <p className="text-navy-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-navy-900">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Currency Notice for JazzCash */}
              {/* Removed as all prices are now in PKR */}
              
              <div className="border-t border-navy-200 pt-6 space-y-3">
                <div className="flex justify-between text-navy-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-navy-600">
                  <span>Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-navy-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                </div>
                <div className="border-t border-navy-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-navy-900">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  {/* Removed JazzCash Mobile Wallet Payment notice */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 
