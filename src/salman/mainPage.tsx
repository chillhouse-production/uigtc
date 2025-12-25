
import { useState } from "react"
import judulImg from '../assets/UIGTC-judul.png'
import hartaTengah from '../assets/Hartakarun-Tengah.png'
import batuKanan from '../assets/Batu-Kanan.png'
import batuKiri from '../assets/Batu-Kiri.png'
import pasirBg from '../assets/pasirBG.png'
import ombakDesc from '../assets/OmbakDeskripsi.png'
import logoUIGTC from '../assets/LogoUIGTBulat.png'

export default function MainPage() {

    return (
        <div className="block flex flex-col h-screen  sm:hidden z-0 pt-20 bg-gradient-to-b from-[#EAB775] to-[#F3CC91]">
            <div className="flex flex-col w-screen items-center justify-center">
                <img src={judulImg} alt="UIGTC judul" className="h-32 w-300px mb-4" />
                <h2 className="text-2xl font-semibold text-white">Sail The Sea Reach Your Degree</h2>
            </div>
            <div className="flex flex-col h-400px w-screen items-center justify-center mt-10"></div>
            <div className="flex flex-row w-screen items-center justify-center mt-10">
                <div className="z-10 translate-y-[10px]">
                    <img src={batuKiri} alt="" />
                </div>
                <div className="z-10 translate-y-[25px]">
                    <img src={hartaTengah} alt="" />
                </div>
                <div className="z-10">
                    <img src={batuKanan} alt="" />
                </div>
            </div>
            <div className="relative z-20 -translate-y-[60px]">
                <img src={pasirBg} alt="" className="w-full" />
                <button className="absolute top-3/12 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#135D66] hover:bg-[#0E464D] text-[#E3FEF7] font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300">
                    Explore
                </button>
            </div>
            <div className="relative z-30 -translate-y-[150px]">
                <img
                    src={ombakDesc}
                    alt=""
                    className="w-screen h-[520px] object-cover"
                />
                <div className="
                    absolute top-3/12 left-1/2 -translate-x-1/2
                    flex flex-row items-center
                    w-[85%] gap-6
                ">
                    <img
                        src={logoUIGTC}
                        alt="Logo UIGTC"
                        className="w-50 h-50 shrink-0"
                    />
                    <div className="text-[#0B2E34]">
                        <h3 className="text-2xl font-extrabold mb-3 tracking-wide">
                            WHAT’S UI GOES TO CELEBES?
                        </h3>
                        <p className="text-sm leading-relaxed">
                            Join us for an unforgettable journey at the Universitas Indonesia
                            Global Trade Competition (UIGTC)! Dive into international trade
                            challenges, connect with industry leaders, and showcase your skills
                            on a national stage. Set sail toward success and make your mark.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
