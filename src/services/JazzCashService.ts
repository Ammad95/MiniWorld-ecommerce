import { JazzCashInfo, JazzCashResponse, ShippingAddress } from '../types';

export interface JazzCashConfig {
  merchantId: string;
  password: string;
  hashKey: string;
  returnUrl: string;
  cancelUrl: string;
  isSandbox?: boolean;
}

export interface JazzCashPaymentRequest {
  amount: number;
  billReference: string;
  description: string;
  currency: string;
  customerInfo: JazzCashInfo;
  shippingAddress: ShippingAddress;
  orderNumber: string;
  language: string;
}

export class JazzCashService {
  private config: JazzCashConfig;
  private readonly sandboxUrl = 'https://sandbox.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction';
  private readonly productionUrl = 'https://payments.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction';

  constructor(config: JazzCashConfig) {
    this.config = {
      ...config,
      isSandbox: config.isSandbox !== false, // Default to sandbox
    };
  }

  /**
   * Generate secure hash for JazzCash API
   */
  private generateHash(data: Record<string, string>): string {
    // Sort keys alphabetically and concatenate values
    const sortedKeys = Object.keys(data).sort();
    const concatenatedString = sortedKeys.map(key => data[key]).join('&');
    const hashString = `${this.config.hashKey}&${concatenatedString}`;
    
    // In a real implementation, you'd use crypto.createHmac('sha256', this.config.hashKey)
    // For now, we'll simulate the hash generation
    return this.simulateHmacSha256(hashString);
  }

  /**
   * Simulate HMAC-SHA256 hash generation
   * In production, use proper crypto library
   */
  private simulateHmacSha256(input: string): string {
    // This is a simplified simulation for demo purposes
    // In production, use: crypto.createHmac('sha256', this.config.hashKey).update(input).digest('hex')
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }

  /**
   * Generate transaction reference number
   */
  private generateTransactionRef(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8);
    return `MW${timestamp}${random}`.toUpperCase();
  }

  /**
   * Format amount for JazzCash API (in paisa)
   */
  private formatAmount(amount: number): string {
    return Math.round(amount * 100).toString();
  }

  /**
   * Create hosted checkout form HTML
   */
  public createHostedCheckoutForm(paymentRequest: JazzCashPaymentRequest): string {
    const transactionRef = this.generateTransactionRef();
    const formattedAmount = this.formatAmount(paymentRequest.amount);
    
    const formData = {
      pp_Version: '1.1',
      pp_TxnType: 'MWALLET',
      pp_Language: paymentRequest.language || 'EN',
      pp_MerchantID: this.config.merchantId,
      pp_SubMerchantID: '',
      pp_Password: this.config.password,
      pp_BankID: 'TBANK',
      pp_ProductID: 'RETL',
      pp_TxnRefNo: transactionRef,
      pp_Amount: formattedAmount,
      pp_TxnCurrency: paymentRequest.currency,
      pp_TxnDateTime: new Date().toISOString().replace(/[-:]/g, '').split('.')[0],
      pp_BillReference: paymentRequest.billReference,
      pp_Description: paymentRequest.description,
      pp_TxnExpiryDateTime: new Date(Date.now() + 30 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0], // 30 minutes
      pp_ReturnURL: this.config.returnUrl,
      pp_CancelURL: this.config.cancelUrl,
      pp_SecureHash: '',
      ppmpf_1: paymentRequest.customerInfo.customerName,
      ppmpf_2: paymentRequest.customerInfo.mobileNumber,
      ppmpf_3: paymentRequest.customerInfo.cnic || '',
      ppmpf_4: paymentRequest.shippingAddress.email,
      ppmpf_5: paymentRequest.shippingAddress.address,
    };

    // Generate secure hash
    const hashData: Record<string, string> = { ...formData };
    delete (hashData as any).pp_SecureHash;
    formData.pp_SecureHash = this.generateHash(hashData);

    const apiUrl = this.config.isSandbox ? this.sandboxUrl : this.productionUrl;

    return `
      <form id="jazzcash-form" action="${apiUrl}" method="post" style="display: none;">
        ${Object.entries(formData).map(([key, value]) => 
          `<input type="hidden" name="${key}" value="${value}" />`
        ).join('')}
      </form>
      <script>
        document.getElementById('jazzcash-form').submit();
      </script>
    `;
  }

  /**
   * Process JazzCash payment
   */
  public async processPayment(paymentRequest: JazzCashPaymentRequest): Promise<JazzCashResponse> {
    try {
      // In sandbox mode, simulate successful payment
      if (this.config.isSandbox) {
        return this.simulatePaymentResponse(paymentRequest);
      }

      // For production, you would make actual API calls
      const formHtml = this.createHostedCheckoutForm(paymentRequest);
      
      // Return response with redirect URL
      return {
        transactionId: this.generateTransactionRef(),
        status: 'pending',
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        responseCode: '000',
        responseMessage: 'Transaction initiated successfully',
        redirectUrl: 'data:text/html;base64,' + btoa(formHtml),
        orderNumber: paymentRequest.orderNumber,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('JazzCash payment processing failed:', error);
      return {
        transactionId: '',
        status: 'failed',
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        responseCode: '999',
        responseMessage: 'Payment processing failed',
        orderNumber: paymentRequest.orderNumber,
        createdAt: new Date(),
      };
    }
  }

  /**
   * Simulate payment response for sandbox testing
   */
  private simulatePaymentResponse(paymentRequest: JazzCashPaymentRequest): JazzCashResponse {
    // Simulate different responses based on mobile number for testing
    const mobileNumber = paymentRequest.customerInfo.mobileNumber;
    
    if (mobileNumber.endsWith('1111')) {
      return {
        transactionId: this.generateTransactionRef(),
        status: 'failed',
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        responseCode: '121',
        responseMessage: 'Insufficient balance',
        orderNumber: paymentRequest.orderNumber,
        createdAt: new Date(),
      };
    }

    if (mobileNumber.endsWith('2222')) {
      return {
        transactionId: this.generateTransactionRef(),
        status: 'failed',
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        responseCode: '114',
        responseMessage: 'Transaction declined',
        orderNumber: paymentRequest.orderNumber,
        createdAt: new Date(),
      };
    }

    // Default successful response
    return {
      transactionId: this.generateTransactionRef(),
      status: 'success',
      amount: paymentRequest.amount,
      currency: paymentRequest.currency,
      responseCode: '000',
      responseMessage: 'Transaction completed successfully',
      orderNumber: paymentRequest.orderNumber,
      createdAt: new Date(),
    };
  }

  /**
   * Verify transaction status
   */
  public async verifyTransaction(transactionId: string): Promise<JazzCashResponse> {
    // In sandbox mode, simulate verification
    if (this.config.isSandbox) {
      return {
        transactionId,
        status: 'success',
        amount: 0,
        currency: 'PKR',
        responseCode: '000',
        responseMessage: 'Transaction verified successfully',
        orderNumber: '',
        createdAt: new Date(),
      };
    }

    // In production, you would call JazzCash verification API
    throw new Error('Transaction verification not implemented for production');
  }

  /**
   * Get supported mobile wallet prefixes for Pakistan
   */
  public getSupportedMobileWallets(): Array<{ name: string; prefix: string; logo: string }> {
    return [
      { name: 'Jazz', prefix: '0300', logo: '🎵' },
      { name: 'JazzCash', prefix: '0301', logo: '💳' },
      { name: 'Warid', prefix: '0321', logo: '📱' },
      { name: 'Ufone', prefix: '0333', logo: '📞' },
      { name: 'Telenor', prefix: '0345', logo: '📲' },
      { name: 'Zong', prefix: '0310', logo: '🌐' },
    ];
  }
}

// Default configuration for MiniWorld
export const defaultJazzCashConfig: JazzCashConfig = {
  merchantId: 'MW_MERCHANT_001',
  password: 'miniworld_password',
  hashKey: 'miniworld_hash_key_12345',
  returnUrl: `${window.location.origin}/checkout/jazzcash/success`,
  cancelUrl: `${window.location.origin}/checkout/jazzcash/cancel`,
  isSandbox: true,
};

export const jazzCashService = new JazzCashService(defaultJazzCashConfig); 