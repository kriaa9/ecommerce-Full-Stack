import { useState, useEffect } from 'react';
import userService from '../api/userService'; // Ensure this path is correct
import './Profile.css'; // Ensure CSS is imported

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false); // Toggle State
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        gender: 'MALE',
        address: '',
        backupEmail: '',
        telephone: '',
        mobile: '',
        fax: '',
        department: '',
        position: '',
        socialMediaContact: ''
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await userService.getProfile();
            setFormData(prev => ({ ...prev, ...data }));
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to load profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            const { email, role, ...updateData } = formData;
            await userService.updateProfile(updateData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false); // Switch back to View Mode on success
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        }
    };

    // Helper component to render a field in View Mode vs Edit Mode
    const renderField = (label, name, type = "text", required = false) => {
        if (isEditing) {
            if (type === "textarea") {
                return (
                    <div className="form-group full-width">
                        <label>{label}</label>
                        <textarea name={name} value={formData[name] || ''} onChange={handleChange} rows="2" />
                    </div>
                );
            }
            return (
                <div className="form-group">
                    <label>{label}</label>
                    <input type={type} name={name} value={formData[name] || ''} onChange={handleChange} required={required} />
                </div>
            );
        }

        // View Mode Display
        return (
            <div className={`view-field ${type === 'textarea' ? 'full-width' : ''}`}>
                <span className="view-label">{label}</span>
                <div className="view-value">{formData[name] || '-'}</div>
            </div>
        );
    };

    if (loading) return <div className="profile-loading">Loading...</div>;

    return (
        <div className="profile-container">
            {/* Header with Edit Toggle */}
            <div className="profile-header-actions">
                <div>
                    <h1>{formData.firstName}'s Profile</h1>
                    <p>Manage your account settings</p>
                </div>
                {!isEditing && (
                    <button className="btn-edit-toggle" onClick={() => setIsEditing(true)}>
                        ✎ Edit Profile
                    </button>
                )}
            </div>

            {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

            <form onSubmit={handleSubmit} className="profile-form">

                <section className="form-section">
                    <h2>Basic Information</h2>
                    <div className="form-grid">
                        {renderField("First Name", "firstName", "text", true)}
                        {renderField("Last Name", "lastName", "text", true)}
                        {/* Email is typically read-only always */}
                        <div className="view-field">
                            <span className="view-label">Email</span>
                            <div className="view-value">{formData.email}</div>
                        </div>

                        {isEditing ? (
                            <div className="form-group">
                                <label>Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange}>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                </select>
                            </div>
                        ) : (
                            <div className="view-field">
                                <span className="view-label">Gender</span>
                                <div className="view-value">{formData.gender}</div>
                            </div>
                        )}
                    </div>
                </section>

                <section className="form-section">
                    <h2>Contact Details</h2>
                    <div className="form-grid">
                        {renderField("Address", "address", "textarea")}
                        {renderField("Mobile", "mobile", "tel")}
                        {renderField("Social Media", "socialMediaContact")}
                    </div>
                </section>

                {/* Only show Save/Cancel buttons in Edit Mode */}
                {isEditing && (
                    <div className="form-actions">
                        <button type="button" className="btn-delete" onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-save">
                            Save Changes
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Profile;