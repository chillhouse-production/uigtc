import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Ellipse26 from '../assets/background-TS/Ellipse 26.svg';
import Ellipse27 from '../assets/background-TS/Ellipse 27.svg';
import Ellipse28 from '../assets/background-TS/Ellipse 28.svg';
import Ellipse29 from '../assets/background-TS/Ellipse 29.svg';
import Vector69 from '../assets/background-TS/Vector 69.svg';
import Vector71 from '../assets/background-TS/Vector 71.svg';
import Vector72 from '../assets/background-TS/Vector 72.svg';
import Vector73 from '../assets/background-TS/Vector 73.svg';

export default function TransactionSuccessPage() {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const orderId = "ASDWNFOQFNQ";

    const handleCopy = () => {
        navigator.clipboard.writeText(orderId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #61B2DE 23%, #7AABB6 100%)' }}>
            {/* Background Ellipses */}
            <img src={Ellipse26} alt="" className="absolute top-10 left-10 opacity-60" />
            <img src={Ellipse27} alt="" className="absolute bottom-20 right-20 opacity-60" />
            <img src={Ellipse28} alt="" className="absolute top-1/2 left-1/4 opacity-60" />
            <img src={Ellipse29} alt="" className="absolute bottom-10 left-1/3 opacity-60" />

            {/* Bird Vectors */}
            <img src={Vector69} alt="" className="absolute top-20 right-1/4 w-12" />
            <img src={Vector71} alt="" className="absolute top-40 left-20 w-16" />
            <img src={Vector72} alt="" className="absolute bottom-1/3 right-10 w-10" />
            <img src={Vector73} alt="" className="absolute top-10 left-1/2 w-8" />

            {/* Success Card */}
            <div
                className={`relative z-10 bg-white shadow-xl flex flex-col items-center text-center
                    /* HP (Mobile) */
                    w-[90%] max-w-sm p-8 rounded-3xl mb-8

                    /* iPad (Tablet) */
                    md:max-w-xl md:p-12

                    /* Laptop (Desktop) */
                    lg:max-w-2xl lg:p-16 lg:rounded-[1rem]
                `}
            >
                {/* Success Icon */}
                <div className="mb-6 relative">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                        <path d="M60 10C87.6142 10 110 32.3858 110 60C110 87.6142 87.6142 110 60 110C32.3858 110 10 87.6142 10 60C10 32.3858 32.3858 10 60 10Z" fill="white" stroke="#4FB4CE" strokeWidth="4" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M60 0C66.8629 0 73.1856 2.31688 78.2843 6.1802C81.4286 3.79669 85.3946 2.38095 89.697 2.38095C102.508 2.38095 112.895 12.7685 112.895 25.579C112.895 29.8814 111.479 33.8475 109.096 36.9918C112.959 42.0905 115.276 48.4132 115.276 55.2761C115.276 62.139 112.959 68.4617 109.096 73.5604C111.479 76.7047 112.895 80.6708 112.895 84.9732C112.895 97.7837 102.508 108.171 89.697 108.171C85.3946 108.171 81.4286 106.756 78.2843 104.372C73.1856 108.235 66.8629 110.552 60 110.552C53.1371 110.552 46.8144 108.235 41.7157 104.372C38.5714 106.756 34.6054 108.171 30.303 108.171C17.4925 108.171 7.10495 97.7837 7.10495 84.9732C7.10495 80.6708 8.52069 76.7047 10.9042 73.5604C7.04092 68.4617 4.72382 62.139 4.72382 55.2761C4.72382 48.4132 7.04092 42.0905 10.9042 36.9918C8.52069 33.8475 7.10495 29.8814 7.10495 25.579C7.10495 12.7685 17.4925 2.38095 30.303 2.38095C34.6054 2.38095 38.5714 3.79669 41.7157 6.1802C46.8144 2.31688 53.1371 0 60 0ZM30.303 14.5097C24.1904 14.5097 19.2337 19.4664 19.2337 25.579C19.2337 27.6366 19.8028 29.563 20.7961 31.2185C16.9602 36.9038 14.7238 43.7667 14.7238 51.1342C14.7238 51.2721 14.7262 51.4098 14.7309 51.5471C14.7263 52.8091 14.7238 54.0768 14.7238 55.3523C14.7238 67.8598 24.8639 77.9999 37.3714 77.9999C38.6469 77.9999 39.9146 77.9974 41.1766 77.9928C41.314 77.9975 41.4517 77.9999 41.5896 77.9999C48.9571 77.9999 55.82 75.7635 61.5053 71.9276C63.1608 72.9209 65.0872 73.4901 67.1448 73.4901C73.2574 73.4901 78.214 68.5333 78.214 62.4208C78.214 60.3631 77.6449 58.4367 76.6516 56.7812C80.4875 51.0959 82.7238 44.233 82.7238 36.8655C82.7238 36.7276 82.7214 36.59 82.7167 36.4526C82.7214 35.1906 82.7238 33.923 82.7238 32.6474C82.7238 20.14 72.5837 10 60.0762 10C58.8006 10 57.5329 10.0025 56.2709 10.0071C56.1335 10.0024 55.9959 10 55.8579 10C48.4905 10 41.6276 12.2364 35.9423 16.0723C34.2868 15.079 32.3604 14.5097 30.303 14.5097Z" fill="#4FB4CE" fillOpacity="0.1" />
                        {/* Cloud/Flower Shape */}
                        <path d="M60.0001 8.57144C65.5229 8.57144 70.0001 13.0486 70.0001 18.5714C70.0001 19.3364 69.9142 20.0784 69.7523 20.7925C74.6213 22.5694 78.0953 27.2003 78.0953 32.6667C78.0953 33.3719 78.028 34.062 77.899 34.7331C82.3596 37.1326 85.2382 41.9702 85.2382 47.381C85.2382 54.9125 80.6387 61.3444 73.9115 63.858C73.9698 64.3197 74.0001 64.793 74.0001 65.2738C74.0001 70.7967 69.5229 75.2738 64.0001 75.2738C62.0673 75.2738 60.2625 74.6865 58.756 73.682C56.6218 78.0263 52.1264 81 47.0001 81C41.8737 81 37.3783 78.0263 35.2442 73.682C33.7376 74.6865 31.9329 75.2738 30.0001 75.2738C24.4772 75.2738 20.0001 70.7967 20.0001 65.2738C20.0001 64.793 20.0303 64.3197 20.0886 63.858C13.3614 61.3444 8.76196 54.9125 8.76196 47.381C8.76196 41.9702 11.6406 37.1326 16.1012 34.7331C15.9721 34.062 15.9048 33.3719 15.9048 32.6667C15.9048 27.2003 19.3788 22.5694 24.2479 20.7925C24.086 20.0784 24.0001 19.3364 24.0001 18.5714C24.0001 13.0486 28.4772 8.57144 34.0001 8.57144C35.9329 8.57144 37.7376 9.15873 39.2442 10.1633C41.3783 5.81894 45.8737 2.84521 51.0001 2.84521C54.4093 2.84521 57.5199 4.10309 59.9323 6.2084C59.9548 6.99266 59.9774 7.77977 60.0001 8.57144Z" fill="white" stroke="#4FB4CE" strokeWidth="4" strokeLinejoin="round" />
                        {/* Checkmark */}
                        <path d="M42 60L56 74L84 46" stroke="#4FB4CE" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <h1 className="text-4xl md:text-5xl font-['Pirata_One'] text-[#1a3c40] mb-8 font-normal tracking-wide">
                    PEMESANAN BERHASIL!
                </h1>

                {/* Order ID Box */}
                <div className="bg-[#CFE3E8] rounded-lg px-8 py-4 flex items-center gap-4 text-[#1a3c40] mb-2 w-full max-w-sm border border-[#4FB4CE]/30">
                    <span className="font-bold text-lg font-serif">Order ID:</span>
                    <span className="font-serif text-lg tracking-wider flex-1 text-left">{orderId}</span>
                    <button onClick={handleCopy} className="text-[#1a3c40] hover:text-[#0f2426] transition-colors relative">
                        {copied ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Back to Home Button */}
            <button
                onClick={() => navigate('/')}
                className="relative z-10 px-10 py-3 bg-[#133033] hover:bg-[#0b1c1e] text-white font-serif font-bold text-lg rounded-lg shadow-lg transition-colors"
            >
                Back To Home
            </button>
        </div>
    );
}
