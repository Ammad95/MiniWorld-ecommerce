import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiShoppingBag, 
  FiDollarSign, 
  FiUser, 
  FiMapPin,
  FiShield,
  FiCheck,
  FiTruck,
  FiPackage,
  FiPhone,
  FiMail,
  FiHome
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useSupabaseOrder } from '../context/SupabaseOrderContext';
import { usePayment } from '../context/PaymentContext';
import { ShippingAddress, PaymentMethod } from '../types';

const CheckoutPage: React.FC = () => {
  const { state: cart, clearCart } = useCart();
  const { createOrder } = useSupabaseOrder();
  const { paymentAccounts } = usePayment();

  // Get active accounts for bank transfer options
  const bankTransferAccounts = paymentAccounts.filter(
    (account) => account.isActive && 
    account.paymentMethodType === 'bank_transfer'
  );

  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');
  const [selectedBankAccount, setSelectedBankAccount] = useState<string | null>(null);
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan'
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate totals
  const subtotal = cart.total;
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal >= 5000 ? 0 : 150; // Free shipping over PKR 5,000
  const total = subtotal + tax + shipping;

  const formatCurrency = (amount: number) => `PKR ${amount.toLocaleString('en-PK')}`;

  useEffect(() => {
    if (bankTransferAccounts.length > 0) {
      setSelectedBankAccount(bankTransferAccounts[0].id);
    }
  }, [bankTransferAccounts]);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate shipping address
    const newErrors: {[key: string]: string} = {};
    
    if (!shippingAddress.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!shippingAddress.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!shippingAddress.email.trim()) newErrors.email = 'Email is required';
    if (!shippingAddress.address.trim()) newErrors.address = 'Address is required';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.state.trim()) newErrors.state = 'State is required';
    if (!shippingAddress.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const paymentInfo = {
        method: paymentMethod,
        selectedAccount: paymentMethod === 'bank_transfer' ?
          bankTransferAccounts.find(acc => acc.id === selectedBankAccount) :
          undefined,
      };

      // Create order
      const orderData = {
        items: cart.items,
        shippingAddress,
        paymentInfo,
        subtotal,
        tax,
        shipping,
        total
      };

      const completedOrder = await createOrder(orderData);

      // Store order number for confirmation screen
      setCompletedOrderNumber(completedOrder.orderNumber);

      // Clear cart and show success
      clearCart();
      setCurrentStep(3);
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Shipping Address', icon: FiMapPin },
    { number: 2, title: 'Payment Method', icon: FiShoppingBag },
    { number: 3, title: 'Order Complete', icon: FiCheck },
  ];

  if (cart.items.length === 0 && currentStep !== 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-deepPurple-50 to-white pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <FiShoppingBag className="w-16 h-16 mx-auto text-navy-400 mb-4" />
            <h2 className="text-2xl font-bold text-navy-900 mb-2">Your cart is empty</h2>
            <p className="text-navy-600 mb-6">Add some items to your cart before checkout</p>
            <a 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-deepPurple-600 to-purple-600 text-white font-medium rounded-lg hover:from-deepPurple-700 hover:to-purple-700 transition-all duration-200"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deepPurple-50 to-white pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className={`flex items-center space-x-2 ${
                  currentStep >= step.number ? 'text-deepPurple-600' : 'text-navy-400'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.number 
                      ? 'bg-gradient-to-r from-deepPurple-600 to-purple-600 text-white' 
                      : 'bg-navy-100 text-navy-400'
                  }`}>
                    {currentStep > step.number ? (
                      <FiCheck className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="font-medium hidden sm:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-px ${
                    currentStep > step.number ? 'bg-deepPurple-600' : 'bg-navy-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
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
                
                <form onSubmit={handleAddressSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        <FiUser className="inline w-4 h-4 mr-1" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-deepPurple-500 focus:border-transparent ${
                          errors.fullName ? 'border-red-500' : 'border-navy-200'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        <FiPhone className="inline w-4 h-4 mr-1" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-deepPurple-500 focus:border-transparent ${
                          errors.phone ? 'border-red-500' : 'border-navy-200'
                        }`}
                        placeholder="+92 300 1234567"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-2">
                      <FiMail className="inline w-4 h-4 mr-1" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-deepPurple-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-navy-200'
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-2">
                      <FiHome className="inline w-4 h-4 mr-1" />
                      Street Address *
                    </label>
                    <textarea
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-deepPurple-500 focus:border-transparent ${
                        errors.address ? 'border-red-500' : 'border-navy-200'
                      }`}
                      rows={3}
                      placeholder="House/flat number, street name, area"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">City *</label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-deepPurple-500 focus:border-transparent ${
                          errors.city ? 'border-red-500' : 'border-navy-200'
                        }`}
                        placeholder="Karachi"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">State/Province *</label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-deepPurple-500 focus:border-transparent ${
                          errors.state ? 'border-red-500' : 'border-navy-200'
                        }`}
                        placeholder="Sindh"
                      />
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">ZIP Code *</label>
                      <input
                        type="text"
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-deepPurple-500 focus:border-transparent ${
                          errors.zipCode ? 'border-red-500' : 'border-navy-200'
                        }`}
                        placeholder="75400"
                      />
                      {errors.zipCode && (
                        <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-deepPurple-600 to-purple-600 text-white font-medium rounded-lg hover:from-deepPurple-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Continue to Payment
                  </button>
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
                          <li>• Please have exact change ready: {formatCurrency(total)}</li>
                          <li>• Our delivery partner will provide a receipt</li>
                          <li>• Delivery typically takes 2-5 business days</li>
                          <li>• COD orders above PKR 5,000 get free shipping!</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Bank Transfer */}
                  {paymentMethod === 'bank_transfer' && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2 mb-3">
                        <FiDollarSign className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-blue-900">Bank Transfer Selected</h4>
                      </div>
                      
                      {bankTransferAccounts.length > 0 ? (
                        <div className="space-y-4">
                          <p className="text-sm text-blue-800 mb-3">
                            Transfer the exact amount to one of our bank accounts and upload the receipt.
                          </p>

                          {/* Bank Account Selection */}
                          <div className="space-y-3">
                            <h5 className="font-medium text-blue-900">Select Bank Account:</h5>
                            {bankTransferAccounts.map((account) => (
                              <div 
                                key={account.id}
                                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                  selectedBankAccount === account.id
                                    ? 'border-blue-500 bg-blue-100' 
                                    : 'border-blue-200 hover:border-blue-300'
                                }`}
                                onClick={() => setSelectedBankAccount(account.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h6 className="font-semibold text-blue-900">{account.bankName}</h6>
                                    <p className="text-sm text-blue-700">Account: {account.accountNumber}</p>
                                    <p className="text-sm text-blue-700">Name: {account.accountName}</p>
                                    {account.iban && (
                                      <p className="text-sm text-blue-700">IBAN: {account.iban}</p>
                                    )}
                                  </div>
                                  <div className={`w-4 h-4 rounded-full border-2 ${
                                    selectedBankAccount === account.id
                                      ? 'border-blue-500 bg-blue-500' 
                                      : 'border-blue-300'
                                  }`}>
                                    {selectedBankAccount === account.id && (
                                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="bg-blue-100 p-3 rounded border border-blue-300">
                            <h5 className="font-medium text-blue-900 mb-2">📋 Transfer Instructions:</h5>
                            <ul className="text-sm text-blue-800 space-y-1">
                              <li>1. Transfer exactly {formatCurrency(total)} to the selected account</li>
                              <li>2. Keep the bank receipt/screenshot as proof</li>
                              <li>3. Your order will be processed after payment verification</li>
                              <li>4. Processing typically takes 1-2 business days</li>
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-yellow-100 rounded border border-yellow-300">
                          <p className="text-sm text-yellow-800">
                            Bank transfer accounts are currently being updated. Please choose cash on delivery or contact support.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Payment Security Notice */}
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <FiShield className="w-6 h-6 text-gray-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Secure Payment</h4>
                      <p className="text-sm text-gray-600">
                        Your payment information is protected with bank-level security
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 px-6 py-3 border border-navy-300 text-navy-700 font-medium rounded-lg hover:bg-navy-50 transition-all duration-200"
                    >
                      Back to Shipping
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || (paymentMethod === 'bank_transfer' && !selectedBankAccount)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-deepPurple-600 to-purple-600 text-white font-medium rounded-lg hover:from-deepPurple-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3: Order Complete */}
            {currentStep === 3 && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg shadow-soft p-8 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCheck className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-navy-900 mb-4">Order Placed Successfully!</h2>
                
                {/* Order Number Display */}
                <div className="bg-navy-50 border border-navy-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-navy-600 mb-1">Order Number</p>
                  <p className="text-xl font-bold text-navy-900">{completedOrderNumber}</p>
                </div>
                
                <p className="text-navy-600 mb-6">
                  Thank you for your order. You will receive a confirmation email shortly with your order details.
                </p>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                  <h3 className="font-semibold text-green-900 mb-2">What's Next?</h3>
                  <ul className="text-sm text-green-800 space-y-1 text-left">
                    <li>• You'll receive an email confirmation within 5 minutes</li>
                    <li>• Our team will process your order within 24 hours</li>
                    <li>• We'll send you tracking information once shipped</li>
                    <li>• Estimated delivery: 2-5 business days</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/"
                    className="px-6 py-3 bg-gradient-to-r from-deepPurple-600 to-purple-600 text-white font-medium rounded-lg hover:from-deepPurple-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Back to Home
                  </a>
                  <a
                    href="/category/0-6-months"
                    className="px-6 py-3 border border-navy-300 text-navy-700 font-medium rounded-lg hover:bg-navy-50 transition-all duration-200"
                  >
                    Continue Shopping
                  </a>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-soft p-6 sticky top-4">
              <h3 className="text-xl font-bold text-navy-900 mb-4">Order Summary</h3>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-3">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-navy-900 truncate">{item.product.name}</h4>
                      <p className="text-sm text-navy-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-navy-900 font-medium">
                      {formatCurrency(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="border-t border-navy-200 pt-4 space-y-2">
                <div className="flex justify-between text-navy-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-navy-600">
                  <span>Tax (10%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-navy-600">
                  <span>Shipping</span>
                  <span>{shipping > 0 ? formatCurrency(shipping) : 'FREE'}</span>
                </div>
                {shipping === 0 && (
                  <div className="text-xs text-green-600 font-medium">
                    🎉 Free shipping on orders over PKR 5,000
                  </div>
                )}
                <div className="border-t border-navy-200 pt-2 flex justify-between text-lg font-bold text-navy-900">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Trust Signals */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-2 text-sm text-navy-600">
                  <FiShield className="w-4 h-4 text-green-600" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-navy-600">
                  <FiTruck className="w-4 h-4 text-blue-600" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-navy-600">
                  <FiPackage className="w-4 h-4 text-purple-600" />
                  <span>Quality Guarantee</span>
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
