import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import orderService from '../api/orderService';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        shippingAddress: '',
        paymentMethod: 'Cash on Delivery'
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        setSubmitting(true);
        setError(null);

        try {
            const orderRequest = {
                shippingAddress: formData.shippingAddress,
                paymentMethod: formData.paymentMethod,
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                }))
            };

            await orderService.placeOrder(orderRequest);
            
            clearCart();
            navigate('/order-success');
        } catch (err) {
            console.error('Checkout error:', err);
            setError(err.response?.data?.message || 'Failed to place order. Please check stock availability.');
        } finally {
            setSubmitting(false);
        }
    };

    if (cart.length === 0) {
        navigate('/products');
        return null;
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <main className="checkout-main">
                    <section className="checkout-section">
                        <h2>Shipping Information</h2>
                        <form id="checkout-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Detailed Shipping Address</label>
                                <textarea 
                                    name="shippingAddress" 
                                    value={formData.shippingAddress}
                                    onChange={handleChange}
                                    placeholder="House No, Street, City, State, Zip Code"
                                    required
                                    rows="4"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Payment Method</label>
                                <div className="payment-select">
                                    <input 
                                        type="radio" 
                                        id="cod" 
                                        name="paymentMethod" 
                                        value="Cash on Delivery" 
                                        checked 
                                        readOnly 
                                    />
                                    <label htmlFor="cod">Cash on Delivery (COD)</label>
                                </div>
                                <p className="payment-note">Pay with cash when your order is delivered to your doorstep.</p>
                            </div>
                        </form>
                    </section>
                </main>

                <aside className="checkout-sidebar">
                    <div className="summary-card">
                        <h3>Order Summary</h3>
                        <div className="checkout-items-preview">
                            {cart.map(item => (
                                <div key={item.id} className="preview-item">
                                    <span>{item.name} (x{item.quantity})</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row">
                            <span>Total Amount</span>
                            <span className="total-price">${cartTotal.toFixed(2)}</span>
                        </div>
                        
                        {error && <div className="checkout-error">{error}</div>}
                        
                        <button 
                            type="submit" 
                            form="checkout-form" 
                            className="btn-place-order" 
                            disabled={submitting}
                        >
                            {submitting ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CheckoutPage;
