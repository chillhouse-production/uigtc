import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi, type User } from '../config/api';
import Navbar from "../salman/navBar";
import LeftCloud from '../assets/Left Cloud_Profile.svg';
import RightCloud from '../assets/Right Cloud_Profile.svg';
import Bird1 from '../assets/burung-profile_1.svg';
import Bird2 from '../assets/burung-profile_2.svg';
import Laut from '../assets/laut-profile.svg';
import Kapal from '../assets/kapal-profile.svg';
import Footer from '../salman/footer';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user: authUser, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        school: '',
        phone: '',
    });

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await authApi.me();
                if (response.success && response.data) {
                    setUser(response.data);
                    setFormData({
                        name: response.data.name || '',
                        email: response.data.email || '',
                        school: response.data.schoolOrigin || '',
                        phone: response.data.phoneNumber || '',
                    });
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            } finally {
                setLoading(false);
            }
        }
        
        if (authUser) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [authUser]);

    const handleLogout = async () => {
        try {
            await authApi.logout();
            logout();
            navigate('/auth');
        } catch (error) {
            console.error('Logout error:', error);
            logout();
            navigate('/auth');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7AABB6 19%, #98AE9C 51%, #B6B282 72%, #FEDE89 96%)' }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a3c40] mx-auto"></div>
                    <p className="mt-4 text-[#1a3c40]">Loading...</p>
                </div>
            </div>
        );
    }

    if (!authUser && !user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7AABB6 19%, #98AE9C 51%, #B6B282 72%, #FEDE89 96%)' }}>
                <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-bree text-[#1a3c40] mb-4">Anda belum login</h2>
                    <button 
                        onClick={() => navigate('/auth')}
                        className="px-8 py-2 rounded-lg bg-[#1a5c6d] text-white font-bree hover:bg-[#154a57] transition-colors"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #7AABB6 19%, #98AE9C 51%, #B6B282 72%, #FEDE89 96%)' }}>
            <Navbar />
            
            {/* Main Content Area */}
            <div className="flex-1 relative flex items-center justify-center overflow-x-hidden px-4 py-24 sm:py-28 md:py-32">
                {/* Cloud Assets */}
                <img
                    src={LeftCloud}
                    alt="Cloud Left"
                    className="
                        absolute opacity-100
                        -left-20 top-40 w-[400px]
                        sm:-left-32 sm:top-32 sm:w-[500px]
                        md:-left-48 md:top-[12.5%] md:w-[550px]
                    "
                />
                <img
                    src={RightCloud}
                    alt="Cloud Right"
                    className="
                        absolute opacity-100
                        -right-8 top-10 w-[400px]
                        sm:-right-12 sm:top-12 sm:w-[500px]
                        md:-right-20 md:top-16 md:w-[700px]
                    "
                />

                <img
                    src={Bird1}
                    alt="Bird 1"
                    className="
                        absolute opacity-100
                        right-10 top-4 w-[40px]
                        sm:right-16 sm:top-6 sm:w-[50px]
                        md:right-75 md:top-0 md:w-[70px]
                    "
                />
                <img
                    src={Bird2}
                    alt="Bird 2"
                    className="
                        absolute opacity-100
                        -right-2 top-8 w-[50px]
                        sm:right-2 sm:top-12 sm:w-[60px]
                        md:right-0 md:top-15 md:w-[90px]
                    "
                />

                {/* Responsive Content Container - Similar to Popup */}
                <div
                    className="
                        relative z-30
                        w-[min(90vw,640px)]
                        max-h-[calc(100vh-240px)]
                        overflow-y-auto
                        rounded-2xl
                        bg-white
                        shadow-2xl
                        p-6 sm:p-8 md:p-10
                        animate-scale-in
                    "
                    style={{
                        minWidth: '320px',
                        scrollBehavior: 'smooth',
                    }}
                >
                    {/* Custom Scrollbar Styles */}
                    <style>{`
                        /* Custom scrollbar for profile card */
                        .relative.z-30::-webkit-scrollbar {
                            width: 8px;
                        }
                        
                        .relative.z-30::-webkit-scrollbar-track {
                            background: transparent;
                            border-radius: 0 16px 16px 0;
                        }
                        
                        .relative.z-30::-webkit-scrollbar-thumb {
                            background: rgba(26, 60, 64, 0.3);
                            border-radius: 4px;
                        }
                        
                        .relative.z-30::-webkit-scrollbar-thumb:hover {
                            background: rgba(26, 60, 64, 0.5);
                        }

                        /* For Firefox */
                        .relative.z-30 {
                            scrollbar-width: thin;
                            scrollbar-color: rgba(26, 60, 64, 0.3) transparent;
                        }
                    `}</style>

                    <h1 className="
                        text-3xl sm:text-4xl md:text-5xl 
                        font-treamd font-bree 
                        text-center text-[#1a3c40] 
                        mb-6 sm:mb-8 
                        tracking-wide drop-shadow-sm
                        uppercase
                        pt-2 sm:pt-4
                    ">
                        {isEditing ? 'Edit Profile' : 'Profile'}
                    </h1>

                    <div className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-[#1a3c40] font-semibold mb-1 ml-1 text-sm sm:text-base">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={!isEditing}
                                className={`
                                    w-full px-4 py-2.5 sm:py-3 rounded-full 
                                    border-2 
                                    ${isEditing ? 'bg-white/50 border-[#1a3c40]/50' : 'bg-white/30 border-[#1a3c40]/30'} 
                                    text-[#1a3c40] font-medium 
                                    outline-none focus:border-[#1a3c40] 
                                    transition-colors
                                    text-sm sm:text-base
                                `}
                            />
                        </div>

                        {/* School */}
                        <div>
                            <label className="block text-[#1a3c40] font-semibold mb-1 ml-1 text-sm sm:text-base">
                                School
                            </label>
                            <input
                                type="text"
                                value={formData.school}
                                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                disabled={!isEditing}
                                placeholder="Masukkan sekolah Anda"
                                className={`
                                    w-full px-4 py-2.5 sm:py-3 rounded-full 
                                    border-2 
                                    ${isEditing ? 'bg-white/50 border-[#1a3c40]/50' : 'bg-white/30 border-[#1a3c40]/30'} 
                                    text-[#1a3c40] font-medium 
                                    outline-none focus:border-[#1a3c40] 
                                    transition-colors
                                    text-sm sm:text-base
                                `}
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-[#1a3c40] font-semibold mb-1 ml-1 text-sm sm:text-base">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                disabled={!isEditing}
                                placeholder="Masukkan nomor telepon"
                                className={`
                                    w-full px-4 py-2.5 sm:py-3 rounded-full 
                                    border-2 
                                    ${isEditing ? 'bg-white/50 border-[#1a3c40]/50' : 'bg-white/30 border-[#1a3c40]/30'} 
                                    text-[#1a3c40] font-medium 
                                    outline-none focus:border-[#1a3c40] 
                                    transition-colors
                                    text-sm sm:text-base
                                `}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-[#1a3c40] font-semibold mb-1 ml-1 text-sm sm:text-base">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled={true}
                                className="
                                    w-full px-4 py-2.5 sm:py-3 rounded-full 
                                    border-2 bg-white/30 border-[#1a3c40]/30 
                                    text-[#1a3c40] font-medium 
                                    outline-none
                                    text-sm sm:text-base
                                "
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4 pb-2">
                        <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="
                                            px-6 sm:px-8 py-2 sm:py-2.5 
                                            rounded-lg 
                                            bg-[#e89c3f] text-[#1a3c40] 
                                            font-bold text-base sm:text-lg 
                                            hover:bg-[#d68b2e] 
                                            transition-all
                                            hover:scale-105 active:scale-95
                                            shadow-lg
                                        "
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="
                                            px-8 sm:px-10 py-2 sm:py-2.5 
                                            rounded-lg 
                                            bg-[#1a5c6d] text-white 
                                            font-bold text-base sm:text-lg 
                                            hover:bg-[#154a57] 
                                            transition-all
                                            hover:scale-105 active:scale-95
                                            shadow-lg
                                        "
                                    >
                                        Save
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="
                                        px-6 sm:px-8 py-2 sm:py-2.5 
                                        rounded-lg 
                                        bg-[#1a5c6d] text-white 
                                        font-bold text-base sm:text-lg 
                                        hover:bg-[#154a57] 
                                        transition-all
                                        hover:scale-105 active:scale-95
                                        shadow-lg
                                    "
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Assets - positioned above footer */}
                <img
                    src={Laut}
                    alt="Laut"
                    className="
                        absolute z-10 left-0 
                        bottom-0 w-full h-auto object-cover
                        max-h-[150px] sm:max-h-[200px] md:max-h-none
                    "
                />
                <img
                    src={Kapal}
                    alt="Kapal"
                    className="
                        absolute z-20
                        left-4 bottom-12 w-[200px]
                        sm:left-8 sm:bottom-16 sm:w-[300px]
                        md:left-30 md:bottom-3 md:w-[700px]
                    "
                />
            </div>

            {/* Footer at the very bottom */}
            <div className="relative z-30 mt-auto">
                <Footer />
            </div>
        </div>
    );
}