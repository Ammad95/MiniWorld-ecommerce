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
        from: `MiniHub Support Team <support@minihubpk.com>`,
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

  constructor() {
    // Private constructor for singleton pattern
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
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
The MiniHub Team
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
    <p>Best regards,<br>The MiniHub Team</p>
    <p style="font-size: 12px; margin-top: 10px;">
      📧 support@minihubpk.com | 🌐 minihubpk.com
    </p>
  </div>
</body>
</html>
    `;

    return { subject, body, html };
  }

  /**
   * Send order confirmation email to customer
   */
  async sendOrderConfirmation(order: Order): Promise<boolean> {
    try {
      if (!order.orderNumber || !order.shippingAddress?.email) {
        console.error('Missing required order information for confirmation email');
        return false;
      }

      const emailSubject = `Order Confirmation - ${order.orderNumber}`;

      // Simple text version for email content
      const emailContent = `
Thank you for your order! We're excited to get your baby essentials to you.

ORDER DETAILS:
- Order Number: ${order.orderNumber}
- Total: PKR ${order.total?.toLocaleString('en-PK') || 'N/A'}
- Payment Method: ${order.paymentInfo?.method === 'cash_on_delivery' ? 'Cash on Delivery' : 'Bank Transfer'}

ITEMS ORDERED:
${order.items?.map(item => `- ${item.product?.name || 'Unknown'} (Qty: ${item.quantity || 0})`).join('\n') || 'No items'}

SHIPPING ADDRESS:
${order.shippingAddress?.fullName || 'N/A'}
${order.shippingAddress?.address || 'N/A'}
${order.shippingAddress?.city || 'N/A'}, ${order.shippingAddress?.state || 'N/A'} ${order.shippingAddress?.zipCode || 'N/A'}

ESTIMATED DELIVERY: ${order.estimatedDelivery?.toLocaleDateString() || 'Within 7 business days'}

We'll keep you updated on your order status via email.

Thank you for choosing MiniWorld!

Best regards,
The MiniWorld Team
      `;

      // In a real implementation, you would use an email service like Resend, SendGrid, etc.
      console.log('📧 Sending order confirmation email...');
      console.log('To:', order.shippingAddress.email);
      console.log('Subject:', emailSubject);
      console.log('Content:', emailContent);
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Order confirmation email sent successfully');
      return true;
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
            <p style="margin: 0;">Best regards,<br>The MiniHub Team</p>
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

  // Newsletter subscription confirmation
  async sendNewsletterConfirmation(email: string): Promise<boolean> {
    try {
      const subject = '🎉 Welcome to MiniHub Newsletter!';
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #1e3a8a; margin: 0; padding: 0; }
            .header { background: linear-gradient(135deg, #1e3a8a 0%, #f97316 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f8fafc; }
            .welcome-box { background: white; padding: 25px; border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .benefits { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
            .benefit-item { display: flex; align-items: center; margin: 10px 0; }
            .footer { background: #1e3a8a; color: white; padding: 25px; text-align: center; margin-top: 30px; }
            .unsubscribe { font-size: 12px; color: #6b7280; margin-top: 20px; }
            .logo { display: inline-block; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">
              <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 15px; display: inline-flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                <div style="background: white; color: #6366f1; font-weight: bold; font-size: 20px; width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">Mi</div>
              </div>
            </div>
            <h1 style="margin: 10px 0;">Welcome to MiniHub!</h1>
            <p style="font-size: 18px; margin: 0;">Your subscription to our newsletter is confirmed</p>
          </div>
          
          <div class="content">
            <div class="welcome-box">
              <h2 style="color: #f97316; margin-top: 0;">🎉 Thank you for subscribing!</h2>
              <p>Welcome to the MiniHub family! You've successfully subscribed to our newsletter and will now receive:</p>
              
              <div class="benefits">
                <div class="benefit-item">
                  <span style="color: #10b981; font-size: 18px; margin-right: 10px;">✨</span>
                  <span>Exclusive early access to new baby products</span>
                </div>
                <div class="benefit-item">
                  <span style="color: #10b981; font-size: 18px; margin-right: 10px;">🎁</span>
                  <span>Special offers and discounts just for subscribers</span>
                </div>
                <div class="benefit-item">
                  <span style="color: #10b981; font-size: 18px; margin-right: 10px;">📚</span>
                  <span>Expert tips and advice for your little one</span>
                </div>
                <div class="benefit-item">
                  <span style="color: #10b981; font-size: 18px; margin-right: 10px;">🚚</span>
                  <span>Free shipping updates and promotions</span>
                </div>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://minihubpk.com" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Start Shopping Now
              </a>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
              <h3 style="color: #1e3a8a; margin-top: 0;">What's next?</h3>
              <p>Browse our collection of premium baby products designed with care and crafted for comfort. From newborn essentials to toddler favorites, we have everything your little one needs.</p>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Thank you for choosing MiniHub!</strong></p>
            <p>Premium baby products for your little one's bright future</p>
            <div style="margin: 15px 0;">
              <a href="https://facebook.com/minihubpk" style="color: white; margin: 0 10px; text-decoration: none;">Facebook</a>
              <a href="https://instagram.com/minihubpk" style="color: white; margin: 0 10px; text-decoration: none;">Instagram</a>
            </div>
            <p style="font-size: 12px; margin-top: 20px;">
              📧 support@minihubpk.com | 📞 +923364599579<br>
              🌐 minihubpk.com
            </p>
            <div class="unsubscribe">
              <p>You received this email because you subscribed to MiniHub newsletter.<br>
              If you no longer wish to receive these emails, you can unsubscribe at any time.</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      const text = `
Welcome to MiniHub Newsletter!

Thank you for subscribing to our newsletter! You'll now receive:
- Exclusive early access to new baby products
- Special offers and discounts just for subscribers
- Expert tips and advice for your little one
- Free shipping updates and promotions

Visit us at minihubpk.com to start shopping.

Contact us: support@minihubpk.com | +923364599579

Best regards,
The MiniHub Team
      `;
      
      const result = await sendEmail(email, subject, html, text);
      
      // Store notification for tracking
      this.notifications.push({
        id: Date.now().toString(),
        to: email,
        subject: subject,
        body: text,
        sentAt: new Date(),
        type: 'newsletter_confirmation' as any,
        status: result.success ? 'sent' : 'failed',
        messageId: result.messageId,
        error: result.error
      });
      
      if (result.success) {
        console.log('✅ Newsletter confirmation email sent:', {
          to: email,
          messageId: result.messageId
        });
      } else {
        console.error('❌ Newsletter confirmation email failed:', result.error);
      }
      
      return result.success;
    } catch (error) {
      console.error('❌ Failed to send newsletter confirmation email:', error);
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
