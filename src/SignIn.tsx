import { useState } from 'react';
import './SignIn.css';

// Import assets
import cloudLeft from './assets/images/cloud-left.svg';
import cloudRight from './assets/images/cloud-right.svg';
import wavesBottle from './assets/images/waves-bottle.svg';

// Mobile assets
import cloudMobile from './assets/images/cloud-left-mobile.svg';
import wavesBottleMobile from './assets/images/waves-bottle-mobile.svg';

import bird1 from './assets/images/birds/Vector 68.svg';
import bird2 from './assets/images/birds/Vector 69.svg';
import bird3 from './assets/images/birds/Vector 71.svg';
import bird4 from './assets/images/birds/Vector 72.svg';
import bird5 from './assets/images/birds/Vector 73.svg';

// Mobile birds
import birdMobile1 from './assets/images/birds-mobile/Vector 72.svg';
import birdMobile2 from './assets/images/birds-mobile/Vector 73.svg';
import birdMobile3 from './assets/images/birds-mobile/Vector 74.svg';


interface SignInProps {
    onSwitchToSignUp: () => void;
}

const SignIn = ({ onSwitchToSignUp }: SignInProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Sign In Attempt:', { email, password });
        // Add auth logic here
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
            <div className="signin-card">
                <h1 className="signin-title">SIGN IN</h1>

                <form className="signin-form" onSubmit={handleSignIn}>
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
                                    // Simple Eye Open Icon SVG
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                ) : (
                                    // Simple Eye Closed/Slash Icon SVG
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                )}
                            </span>
                        </div>
                    </div>

                    <button type="submit" className="signin-button">
                        Sign In
                    </button>
                </form>

                <p className="signup-link-text">
                    Don't Have An Account? <span className="signup-link" onClick={onSwitchToSignUp}>Sign Up</span>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
