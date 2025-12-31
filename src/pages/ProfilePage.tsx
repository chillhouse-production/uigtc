import { useState } from 'react';
import LeftCloud from '../assets/Left Cloud_Profile.svg';
import RightCloud from '../assets/Right Cloud_Profile.svg';
import Bird1 from '../assets/burung-profile_1.svg';
import Bird2 from '../assets/burung-profile_2.svg';
import Laut from '../assets/laut-profile.svg';
import Kapal from '../assets/kapal-profile.svg';

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="relative flex h-screen items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #7AABB6 19%, #98AE9C 51%, #B6B282 72%, #FEDE89 96%)' }}>
            {/* Cloud Assets */}
            <img
                src={LeftCloud}
                alt="Cloud Left"
                className={`absolute opacity-100
                    /* HP (Mobile) */
                    -left-30 top-40 w-[500px]
                    /* iPad (Tablet) */
                    md:-left-48 md:top-[12.5%] md:w-[550px]
                `}
            />
            <img
                src={RightCloud}
                alt="Cloud Right"
                className={`absolute opacity-100 translate-x-1/4 -translate-y-1/4
                    /* HP (Mobile) */
                    -right-12 top-10 w-[500px]
                    /* iPad (Tablet) */
                    md:-right-20 md:top-16 md:w-[700px]
                `}
            />

            <img
                src={Bird1}
                alt="Bird 1"
                className={`absolute opacity-100
                    /* HP (Mobile) */
                    right-10 top-4 w-[50px]
                    /* iPad (Tablet) */
                    md:right-75 md:top-0 md:w-[70px]
                `}
            />
            <img
                src={Bird2}
                alt="Bird 2"
                className={`absolute opacity-100
                
                    /* HP (Mobile) */
                    -right-2 top-8 w-[60px]

                    /* iPad (Tablet) */
                    md:right-0 md:top-15 md:w-[90px]
                `}
            />

            {/* Content Container */}
            <div
                className={`relative z-30 bg-white shadow-xl
                    /* HP (Mobile) */
                    w-full max-w-sm p-8 rounded-3xl

                    /* iPad (Tablet) */
                    md:max-w-lg

                    /* Laptop (Desktop) */
                    lg:max-w-4xl lg:p-10 lg:rounded-[2rem]
                `}
            >
                <h1 className="text-5xl font-['Pirata_One'] font-bold text-center text-[#1a3c40] mb-8 tracking-wide drop-shadow-sm">
                    {isEditing ? 'EDIT PROFILE' : 'PROFILE'}
                </h1>

                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="block text-[#1a3c40] font-semibold mb-1 ml-1">Full Name</label>
                        <input
                            type="text"
                            value="John Doe"
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 rounded-full border-2 ${isEditing ? 'bg-white/50 border-[#1a3c40]/50' : 'bg-white/30 border-[#1a3c40]/30'} text-[#1a3c40] font-medium outline-none focus:border-[#1a3c40] transition-colors`}
                        />
                    </div>

                    {/* School */}
                    <div>
                        <label className="block text-[#1a3c40] font-semibold mb-1 ml-1">School</label>
                        <input
                            type="text"
                            value="SMAN 1 Makassar"
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 rounded-full border-2 ${isEditing ? 'bg-white/50 border-[#1a3c40]/50' : 'bg-white/30 border-[#1a3c40]/30'} text-[#1a3c40] font-medium outline-none focus:border-[#1a3c40] transition-colors`}
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-[#1a3c40] font-semibold mb-1 ml-1">Phone Number</label>
                        <input
                            type="text"
                            value="081234567890"
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 rounded-full border-2 ${isEditing ? 'bg-white/50 border-[#1a3c40]/50' : 'bg-white/30 border-[#1a3c40]/30'} text-[#1a3c40] font-medium outline-none focus:border-[#1a3c40] transition-colors`}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-[#1a3c40] font-semibold mb-1 ml-1">Email</label>
                        <input
                            type="email"
                            value="Kkkkkkk@gmail.com"
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 rounded-full border-2 ${isEditing ? 'bg-white/50 border-[#1a3c40]/50' : 'bg-white/30 border-[#1a3c40]/30'} text-[#1a3c40] font-medium outline-none focus:border-[#1a3c40] transition-colors`}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-[#1a3c40] font-semibold mb-1 ml-1">Password</label>
                        <input
                            type="password"
                            value="********"
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 rounded-full border-2 ${isEditing ? 'bg-white/50 border-[#1a3c40]/50' : 'bg-white/30 border-[#1a3c40]/30'} text-[#1a3c40] font-medium outline-none focus:border-[#1a3c40] transition-colors`}
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex justify-center gap-4">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-8 py-2 rounded-lg bg-[#e89c3f] text-[#1a3c40] font-bold text-lg hover:bg-[#d68b2e] transition-colors shadow-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-10 py-2 rounded-lg bg-[#1a5c6d] text-white font-bold text-lg hover:bg-[#154a57] transition-colors shadow-lg"
                            >
                                Save
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-8 py-2 rounded-lg bg-[#1a5c6d] text-white font-bold text-lg hover:bg-[#154a57] transition-colors shadow-lg"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            <img
                src={Laut}
                alt="Laut"
                className={`absolute z-10 left-0 object-cover
                    /* HP (Mobile) */
                    bottom-0 w-[200px] h-27

                    /* iPad (Tablet) */
                    md:bottom-0 md:h-auto md: w-[2000px]
                `}
            />
            <img
                src={Kapal}
                alt="Kapal"
                className={`absolute -bottom-3
                    /* HP (Mobile) */
                    left-8 w-[1000px] bottom-17

                    /* iPad (Tablet) */
                    md:left-30 md:w-[700px] md:bottom-3
                `}
            />
        </div>
    );
}
