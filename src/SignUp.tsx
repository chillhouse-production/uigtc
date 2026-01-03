import { useState } from 'react';
import { authApi } from './config/api';
import './SignIn.css';

// Import assets
import cloudLeft from './assets/images/cloud-left.svg';
import cloudRight from './assets/images/cloud-right.svg';
import wavesBottle from './assets/images/waves-bottle.svg';

// Mobile assets
import cloudMobile from './assets/images/cloud-left-mobile.svg';
import wavesBottleMobile from './assets/images/waves-bottle-mobile.svg';

// Import birds
import bird1 from './assets/images/birds/Vector 68.svg';
import bird2 from './assets/images/birds/Vector 69.svg';
import bird3 from './assets/images/birds/Vector 71.svg';
import bird4 from './assets/images/birds/Vector 72.svg';
import bird5 from './assets/images/birds/Vector 73.svg';

// Mobile birds
import birdMobile1 from './assets/images/birds-mobile/Vector 72.svg';
import birdMobile2 from './assets/images/birds-mobile/Vector 73.svg';
import birdMobile3 from './assets/images/birds-mobile/Vector 74.svg';


interface SignUpProps {
    onSwitchToSignIn: () => void;
}

const SignUp = ({ onSwitchToSignIn }: SignUpProps) => {
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [school, setSchool] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        // Validasi
        if (password !== confirmPassword) {
            setErrorMessage('Password dan Konfirmasi Password tidak sama!');
            return;
        }

        if (password.length < 6) {
            setErrorMessage('Password minimal 6 karakter!');
            return;
        }

        setIsLoading(true);

        try {
            const response = await authApi.register({
                name: fullName,
                email,
                password,
                phoneNumber,
                schoolOrigin: school
            });

            if (response.success) {
                setSuccessMessage('Registrasi berhasil! Silakan cek email untuk verifikasi, lalu login.');
                // Reset form
                setFullName('');
                setPhoneNumber('');
                setSchool('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                
                // Redirect ke login setelah 2 detik
                setTimeout(() => {
                    onSwitchToSignIn();
                }, 2000);
            } else {
                setErrorMessage(response.message || 'Registrasi gagal. Silakan coba lagi.');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(error instanceof Error ? error.message : 'Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signin-container">
            {/* Background Elements - Desktop */}
            <img src={cloudLeft} alt="Cloud Left" className="cloud cloud-left desktop-only" />
            <img src={cloudRight} alt="Cloud Right" className="cloud cloud-right desktop-only" />

            {/* Background Elements - Mobile */}
            <img src={cloudMobile} alt="Cloud Mobile" className="cloud cloud-mobile mobile-only" />

            {/* Birds - Desktop */}
            <img src={bird1} alt="Bird" className="bird bird-1 desktop-only" />
            <img src={bird2} alt="Bird" className="bird bird-2 desktop-only" />
            <img src={bird3} alt="Bird" className="bird bird-3 desktop-only" />
            <img src={bird4} alt="Bird" className="bird bird-4 desktop-only" />
            <img src={bird5} alt="Bird" className="bird bird-5 desktop-only" style={{ top: '5%', left: '40%', width: '30px', animationDelay: '2s' }} />

            {/* Birds - Mobile */}
            <img src={birdMobile1} alt="Bird Mobile" className="bird bird-mobile-1 mobile-only" />
            <img src={birdMobile2} alt="Bird Mobile" className="bird bird-mobile-2 mobile-only" />
            <img src={birdMobile3} alt="Bird Mobile" className="bird bird-mobile-3 mobile-only" />

            <img src={wavesBottle} alt="Waves and Bottle" className="waves-bottle-bg desktop-only" />
            <img src={wavesBottleMobile} alt="Waves and Bottle Mobile" className="waves-bottle-bg mobile-only" />

            {/* Glassmorphism Card */}
            <div className="signin-card signup-mode">
                <h1 className="signin-title">SIGN UP</h1>

                {errorMessage && (
                    <div style={{ 
                        backgroundColor: 'rgba(220, 38, 38, 0.2)', 
                        color: '#ffdddd', 
                        padding: '10px', 
                        borderRadius: '8px', 
                        marginBottom: '15px',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        border: '1px solid rgba(220, 38, 38, 0.5)'
                    }}>
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div style={{ 
                        backgroundColor: 'rgba(34, 197, 94, 0.2)', 
                        color: '#bbffbb', 
                        padding: '10px', 
                        borderRadius: '8px', 
                        marginBottom: '15px',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        border: '1px solid rgba(34, 197, 94, 0.5)'
                    }}>
                        {successMessage}
                    </div>
                )}

                <form className="signin-form" onSubmit={handleSignUp}>

                    <div className="input-group">
                        <label htmlFor="fullName">Full Name</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                id="fullName"
                                placeholder="blabla"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <div className="input-wrapper">
                            <input
                                type="tel"
                                id="phoneNumber"
                                placeholder="blabla"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="school">School</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                id="school"
                                placeholder="blabla"
                                value={school}
                                onChange={(e) => setSchool(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-wrapper">
                            <input
                                type="email"
                                id="email"
                                placeholder="blabla@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="*****"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                required
                            />
                            <span className="eye-icon" onClick={togglePasswordVisibility}>
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                placeholder="Placeholder"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="form-input"
                                required
                            />
                            <span className="eye-icon" onClick={toggleConfirmPasswordVisibility}>
                                {showConfirmPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                )}
                            </span>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="signin-button"
                        disabled={isLoading}
                        style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
                    >
                        {isLoading ? 'Loading...' : 'Sign Up'}
                    </button>
                </form>

                <p className="signup-link-text">
                    Already Have An Account? <span className="signup-link" onClick={onSwitchToSignIn}>Sign In</span>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
