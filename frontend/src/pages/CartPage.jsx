import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    if (cart.length === 0) {
        return (
            <div className="cart-empty-state">
                <div className="empty-cart-card">
                    <span style={{fontSize: '4rem'}}>🧺</span>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/products" className="btn-primary">Start Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page-container">
            <div className="cart-content">
                <header className="cart-header">
                    <h1>Your Shopping Cart</h1>
                    <span>{cart.length} unique items</span>
                </header>

                <div className="cart-grid">
                    <div className="cart-items-list">
                        {cart.map(item => (
                            <div key={item.id} className="cart-item-card">
                                <div className="cart-item-image">
                                    {item.imageUrls && item.imageUrls.length > 0 ? (
                                        <img src={item.imageUrls[0]} alt={item.name} />
                                    ) : (
                                        <div className="placeholder"></div>
                                    )}
                                </div>
                                <div className="cart-item-info">
                                    <h3>{item.name}</h3>
                                    <p className="item-price">${item.price.toFixed(2)}</p>
                                    <div className="item-controls">
                                        <div className="quantity-toggle">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <button className="btn-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                                    </div>
                                </div>
                                <div className="cart-item-subtotal">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <aside className="cart-summary-sidebar">
                        <div className="summary-card">
                            <h3>Order Summary</h3>
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span className="free">FREE</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <Link to="/checkout" className="btn-checkout">Proceed to Checkout</Link>
                            <Link to="/products" className="btn-continue">Continue Shopping</Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
