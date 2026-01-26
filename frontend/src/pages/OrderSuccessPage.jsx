import { Link } from 'react-router-dom';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
    return (
        <div className="order-success-page">
            <div className="success-card">
                <div className="success-icon">🎉</div>
                <h1>Order Placed Successfully!</h1>
                <p>Thank you for your purchase. We've received your order and are getting it ready for shipment.</p>
                
                <div className="success-actions">
                    <Link to="/orders" className="btn-primary">View My Orders</Link>
                    <Link to="/products" className="btn-secondary">Continue Shopping</Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
