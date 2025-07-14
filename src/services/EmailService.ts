import { Order, OrderStatus } from '../types';

export interface EmailTemplate {
  subject: string;
  body: string;
  html: string;
}

// Simple email sending function (will be replaced with real SMTP)
const sendEmail = async (to: string, subject: string, html: string, text: string): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  // Check if we're in development or production
  const isDevelopment = import.meta.env.DEV;
  const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;
  
  // In development or if no API key, simulate sending
  if (isDevelopment || !resendApiKey) {
    console.log('📧 EMAIL SIMULATION (Development Mode)');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`HTML Length: ${html.length} characters`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show browser notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
    notification.innerHTML = `
      <div class="font-semibold">📧 Email Sent (Simulated)</div>
      <div class="text-sm">To: ${to}</div>
      <div class="text-xs mt-1">Subject: ${subject}</div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 5000);
    
    return { success: true, messageId: `sim_${Date.now()}` };
  }

  // Production: Use Resend API
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `MiniWorld Support Team <support@minihubpk.com>`,
        to: [to],
        subject: subject,
        html: html,
        text: text,
        tags: [
          { name: 'source', value: 'miniworld' },
          { name: 'environment', value: 'production' }
        ]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Email API Error:', data);
      return { success: false, error: data.message || 'Failed to send email' };
    }

    console.log('✅ Email sent successfully:', data.id);
    return { success: true, messageId: data.id };
  } catch (error: any) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

class EmailService {
  private static instance: EmailService;
  private notifications: Array<{
    id: string;
    to: string;
    subject: string;
    body: string;
    sentAt: Date;
    type: 'order_confirmation' | 'status_update' | 'shipping_notification';
    status: 'sent' | 'failed';
    messageId?: string;
    error?: string;
  }> = [];

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private generateOrderConfirmationTemplate(order: Order): EmailTemplate {
    const subject = `Order Confirmation - #${order.orderNumber}`;
    
    const body = `
Dear ${order.shippingAddress.fullName},

Thank you for your order with MiniWorld! We're excited to help you provide the best for your little one.

ORDER DETAILS:
Order Number: #${order.orderNumber}
Order Date: ${order.createdAt.toLocaleDateString()}
Total Amount: $${order.total.toFixed(2)}

ITEMS ORDERED:
${order.items.map(item => `• ${item.product.name} (Qty: ${item.quantity}) - $${(item.product.price * item.quantity).toFixed(2)}`).join('\n')}

SHIPPING ADDRESS:
${order.shippingAddress.fullName}
${order.shippingAddress.address}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
${order.shippingAddress.country}

PAYMENT METHOD: ${this.getPaymentMethodDisplay(order.paymentInfo.method)}

${order.paymentInfo.method === 'bank_transfer' ? 
  `Please transfer the amount to the provided bank account details. Your order will be processed once payment is confirmed.` :
  order.paymentInfo.method === 'cash_on_delivery' ?
  `You have chosen Cash on Delivery. Please have the exact amount ready when our delivery partner arrives.` :
  `Your payment has been processed successfully.`
}

ESTIMATED DELIVERY: ${order.estimatedDelivery?.toLocaleDateString() || 'Within 7 business days'}

You can track your order status at any time by visiting your account dashboard.

Thank you for choosing MiniWorld!

Best regards,
The MiniWorld Team
    `;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #1e3a8a; }
    .header { background: linear-gradient(135deg, #1e3a8a 0%, #f97316 100%); color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .order-details { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0; }
    .items { margin: 15px 0; }
    .item { padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
    .footer { background: #1e3a8a; color: white; padding: 20px; text-align: center; margin-top: 30px; }
    .total { font-size: 18px; font-weight: bold; color: #f97316; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🍼 MiniWorld</h1>
    <h2>Order Confirmation</h2>
  </div>
  
  <div class="content">
    <h3>Dear ${order.shippingAddress.fullName},</h3>
    <p>Thank you for your order with MiniWorld! We're excited to help you provide the best for your little one.</p>
    
    <div class="order-details">
      <h4>Order Details</h4>
      <p><strong>Order Number:</strong> #${order.orderNumber}</p>
      <p><strong>Order Date:</strong> ${order.createdAt.toLocaleDateString()}</p>
      <p class="total"><strong>Total Amount:</strong> $${order.total.toFixed(2)}</p>
    </div>
    
    <div class="items">
      <h4>Items Ordered</h4>
      ${order.items.map(item => `
        <div class="item">
          <strong>${item.product.name}</strong><br>
          Quantity: ${item.quantity} | Price: $${(item.product.price * item.quantity).toFixed(2)}
        </div>
      `).join('')}
    </div>
    
    <div class="order-details">
      <h4>Shipping Address</h4>
      <p>
        ${order.shippingAddress.fullName}<br>
        ${order.shippingAddress.address}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
        ${order.shippingAddress.country}
      </p>
    </div>
    
    <div class="order-details">
      <h4>Payment Information</h4>
      <p><strong>Method:</strong> ${this.getPaymentMethodDisplay(order.paymentInfo.method)}</p>
      ${order.paymentInfo.method === 'bank_transfer' ? 
        '<p style="color: #f97316;"><strong>Action Required:</strong> Please transfer the amount to the provided bank account details.</p>' :
        order.paymentInfo.method === 'cash_on_delivery' ?
        '<p style="color: #10b981;">Payment will be collected upon delivery.</p>' :
        '<p style="color: #10b981;">Payment processed successfully.</p>'
      }
    </div>
    
    <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery?.toLocaleDateString() || 'Within 7 business days'}</p>
    <p>You can track your order status at any time by visiting your account dashboard.</p>
  </div>
  
  <div class="footer">
    <p>Thank you for choosing MiniWorld!</p>
    <p>Best regards,<br>The MiniWorld Team</p>
    <p style="font-size: 12px; margin-top: 10px;">
      📧 support@minihubpk.com | 🌐 minihubpk.com
    </p>
  </div>
</body>
</html>
    `;

    return { subject, body, html };
  }

  private generateStatusUpdateTemplate(order: Order, oldStatus: OrderStatus, newStatus: OrderStatus): EmailTemplate {
    const subject = `Order Update - #${order.orderNumber} is now ${newStatus}`;
    
    const statusMessages = {
      pending: 'Your order has been received and is awaiting confirmation.',
      confirmed: 'Your order has been confirmed and is being prepared for processing.',
      processing: 'Your order is currently being processed and will be shipped soon.',
      shipped: `Great news! Your order has been shipped${order.trackingNumber ? ` with tracking number: ${order.trackingNumber}` : ''}.`,
      delivered: 'Your order has been successfully delivered! We hope you and your little one love your new items.',
      cancelled: 'Your order has been cancelled as requested.',
      completed: 'Your order has been completed successfully! We hope you and your little one love your new items.',
      dispatched: `Great news! Your order has been dispatched${order.trackingNumber ? ` with tracking number: ${order.trackingNumber}` : ''}.`,
      payment_due: 'Your order is confirmed but payment is still due. Please complete your payment to proceed.',
      returned: 'Your order has been returned as requested. We will process your refund shortly.'
    };

    const body = `
Dear ${order.shippingAddress.fullName},

Your order #${order.orderNumber} status has been updated.

Status: ${oldStatus.toUpperCase()} → ${newStatus.toUpperCase()}

${statusMessages[newStatus as keyof typeof statusMessages] || `Your order status has been updated to ${newStatus}.`}

${newStatus === 'shipped' && order.trackingNumber ? 
  `Tracking Number: ${order.trackingNumber}\nEstimated Delivery: ${order.estimatedDelivery?.toLocaleDateString()}` : ''
}

${newStatus === 'delivered' ? 
  'Thank you for choosing MiniWorld! We hope you have a wonderful experience with your purchase.' : ''
}

You can always check your order status in your account dashboard.

Best regards,
The MiniWorld Team
    `;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #1e3a8a; }
    .header { background: linear-gradient(135deg, #1e3a8a 0%, #f97316 100%); color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .status-update { background: #f0f9ff; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border-left: 4px solid #f97316; }
    .footer { background: #1e3a8a; color: white; padding: 20px; text-align: center; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🍼 MiniWorld</h1>
    <h2>Order Status Update</h2>
  </div>
  
  <div class="content">
    <h3>Dear ${order.shippingAddress.fullName},</h3>
    
    <div class="status-update">
      <h3>Order #${order.orderNumber}</h3>
      <p style="font-size: 18px;"><strong>${oldStatus.toUpperCase()} → ${newStatus.toUpperCase()}</strong></p>
      <p>${statusMessages[newStatus as keyof typeof statusMessages] || `Your order status has been updated to ${newStatus}.`}</p>
      
      ${newStatus === 'shipped' && order.trackingNumber ? 
        `<p><strong>Tracking Number:</strong> <code>${order.trackingNumber}</code></p>
         <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery?.toLocaleDateString()}</p>` : ''
      }
    </div>
    
    ${newStatus === 'delivered' ? 
      '<p style="color: #10b981; font-weight: bold;">Thank you for choosing MiniWorld! We hope you have a wonderful experience with your purchase.</p>' : ''
    }
    
    <p>You can always check your order status in your account dashboard.</p>
  </div>
  
  <div class="footer">
    <p>Best regards,<br>The MiniWorld Team</p>
    <p style="font-size: 12px; margin-top: 10px;">
      📧 support@minihubpk.com | 🌐 minihubpk.com
    </p>
  </div>
</body>
</html>
    `;

    return { subject, body, html };
  }

  private getPaymentMethodDisplay(method: string): string {
    switch (method) {
      case 'credit_card': return 'Credit Card';
      case 'bank_transfer': return 'Bank Transfer';
      case 'cash_on_delivery': return 'Cash on Delivery';
      case 'jazzcash': return 'JazzCash';
      default: return method;
    }
  }

  async sendOrderConfirmation(order: Order): Promise<boolean> {
    try {
      const template = this.generateOrderConfirmationTemplate(order);
      
      const result = await sendEmail(
        order.shippingAddress.email,
        template.subject,
        template.html,
        template.body
      );
      
      // Store notification for tracking
      this.notifications.push({
        id: Date.now().toString(),
        to: order.shippingAddress.email,
        subject: template.subject,
        body: template.body,
        sentAt: new Date(),
        type: 'order_confirmation',
        status: result.success ? 'sent' : 'failed',
        messageId: result.messageId,
        error: result.error
      });

      if (result.success) {
        console.log('✅ Order confirmation email sent:', {
          to: order.shippingAddress.email,
          orderNumber: order.orderNumber,
          messageId: result.messageId
        });
      } else {
        console.error('❌ Order confirmation email failed:', result.error);
      }

      return result.success;
    } catch (error) {
      console.error('❌ Failed to send order confirmation email:', error);
      return false;
    }
  }

  async sendStatusUpdate(order: Order, oldStatus: OrderStatus, newStatus: OrderStatus): Promise<boolean> {
    try {
      const template = this.generateStatusUpdateTemplate(order, oldStatus, newStatus);
      
      const result = await sendEmail(
        order.shippingAddress.email,
        template.subject,
        template.html,
        template.body
      );
      
      // Store notification for tracking
      this.notifications.push({
        id: Date.now().toString(),
        to: order.shippingAddress.email,
        subject: template.subject,
        body: template.body,
        sentAt: new Date(),
        type: 'status_update',
        status: result.success ? 'sent' : 'failed',
        messageId: result.messageId,
        error: result.error
      });

      if (result.success) {
        console.log('✅ Status update email sent:', {
          to: order.shippingAddress.email,
          orderNumber: order.orderNumber,
          statusChange: `${oldStatus} → ${newStatus}`,
          messageId: result.messageId
        });
      } else {
        console.error('❌ Status update email failed:', result.error);
      }

      return result.success;
    } catch (error) {
      console.error('❌ Failed to send status update email:', error);
      return false;
    }
  }

  // Test email function
  async sendTestEmail(to: string): Promise<boolean> {
    try {
      const subject = '🧪 Test Email from MiniWorld';
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #f97316 100%); color: white; padding: 20px; text-align: center; border-radius: 8px;">
            <h1>🍼 MiniWorld Email Test</h1>
          </div>
          <div style="padding: 20px;">
            <p>This is a test email to verify your email configuration is working correctly.</p>
            <p><strong>Time sent:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>From:</strong> support@minihubpk.com</p>
            <p style="color: #10b981; font-weight: bold;">✅ Email system is working perfectly!</p>
          </div>
          <div style="background: #1e3a8a; color: white; padding: 15px; text-align: center; margin-top: 20px; border-radius: 8px;">
            <p style="margin: 0;">Best regards,<br>The MiniWorld Team</p>
          </div>
        </div>
      `;
      const text = `MiniWorld Email Test - This is a test email sent at ${new Date().toLocaleString()}`;
      
      const result = await sendEmail(to, subject, html, text);
      
      if (result.success) {
        console.log('✅ Test email sent successfully:', result.messageId);
      } else {
        console.error('❌ Test email failed:', result.error);
      }
      
      return result.success;
    } catch (error) {
      console.error('❌ Test email error:', error);
      return false;
    }
  }

  getNotifications() {
    return this.notifications.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());
  }

  getNotificationStats() {
    const total = this.notifications.length;
    const sent = this.notifications.filter(n => n.status === 'sent').length;
    const failed = this.notifications.filter(n => n.status === 'failed').length;
    
    return { 
      total, 
      sent, 
      failed, 
      successRate: total > 0 ? (sent / total * 100).toFixed(1) : '0' 
    };
  }
}

export default EmailService.getInstance(); 
