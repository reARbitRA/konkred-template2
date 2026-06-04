
// Production Payment Service Specification

interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  redirectUrl?: string;
}

class PaymentService {
  /**
   * Initializes a transaction intent with the NowPayments gateway.
   * In production, this calls a cloud function to generate a real payment link.
   */
  async createPaymentIntent(amount: number, currency: 'USD' | 'USDT' | 'ETH', listingId: string): Promise<PaymentIntent> {
    // API Route: POST /api/payments/create
    const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, listingId })
    });
    
    if (!response.ok) {
        throw new Error("Failed to initialize decentralized settlement node.");
    }
    
    return await response.json();
  }

  /**
   * Verifies the status of a specific transaction hash on the blockchain.
   */
  async verifyTransaction(txId: string): Promise<any> {
    const response = await fetch(`/api/payments/status?id=${txId}`);
    return await response.json();
  }
}

export const paymentService = new PaymentService();
