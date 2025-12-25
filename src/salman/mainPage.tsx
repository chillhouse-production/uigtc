
import { useState } from "react"
import judulImg from '../assets/UIGTC-judul.png'
import hartaTengah from '../assets/Hartakarun-Tengah.png'
import batuKanan from '../assets/Batu-Kanan.png'
import batuKiri from '../assets/Batu-Kiri.png'
import pasirBg from '../assets/pasirBG.png'
import ombakDesc from '../assets/OmbakDeskripsi.svg'
import logoUIGTC from '../assets/LogoUIGTBulat.png'
import lautDalam from '../assets/LautDalam.svg'
import garisKiri from '../assets/GarisKiri.svg'
import garisKanan from '../assets/GarisKanan.svg'
import kapalTengah from '../assets/KapalTengah.svg'
import botolKiri from '../assets/BotolKiri.svg'
import petiKanan from '../assets/PetiKanan.svg'
import bayang from '../assets/Bayang.svg'
import fotoMuter from '../assets/RollingPhotos.svg'


export default function MainPage() {

    return (
        <div className="block flex flex-col h-max-screen  sm:hidden z-0 pt-20 bg-gradient-to-b from-[#EAB775] to-[#F3CC91] overflow-hidden">
            <div className="flex flex-col w-screen items-center justify-center">
                <img src={judulImg} alt="UIGTC judul" className="h-32 w-300px mb-4" />
                <h2 className="text-sm italic font-[Lora] text-white
               [text-shadow:1px_1px_2px_rgba(0,0,0,0.7),0_4px_8px_rgba(0,0,0,0.6)]">
                    Sail The Sea Reach Your Degree
                </h2>


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
            <div className="relative z-30 -translate-y-[120px]">
                <img
                    src={ombakDesc}
                    alt=""
                    className="w-full h-[460px] object-cover"
                />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[92%] flex items-start gap-5">

                    <img
                        src={logoUIGTC}
                        alt="Logo"
                        className="w-28 h-28 shrink-0"
                    />

                    <div className="text-[#0B2E34] max-w-[260px]">
                        <h3 className="text-xl font-extrabold leading-tight mb-2">
                            WHAT’S UI GOES TO CELEBES?
                        </h3>

                        <p className="text-sm leading-relaxed text-justify hyphens-auto">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                        </p>
                    </div>
                </div>

            </div>


            <div className="relative z-40 -translate-y-[220px] w-full">
                <img src={lautDalam} alt="" className="w-full h-[600px] object-cover" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">

                    <h3 className="text-3xl font-serif tracking-widest mb-20 drop-shadow-md">
                        TIMELINE
                    </h3>

                    <div className="relative w-full max-w-5xl flex justify-between items-center">
                        <img src={bayang} alt="bayang1" className="absolute top-1/2 -translate-x-8 -translate-y-35 w-[45%]" />
                        <div className="flex flex-col items-center gap-2 w-1/3 transform -translate-x-5 -translate-y-12">
                            <h4 className="font-serif text-[15px] uppercase italic">Pre-Event</h4>
                            <p className="font-serif text-[10px] opacity-90 mb-2">Tarima Kareba Madeceng</p>
                            <img src={botolKiri} alt="" className="w-10 mb-4 drop-shadow-xl" />
                            <div className="bg-[#3d2314] rounded-md border flex-col items-center flex border-black/20 shadow-lg">
                                <span className="text-[#f1e7d0] px-2 py-1 font-serif font-bold text-[10px] whitespace-nowrap">
                                    4–23 January 2026
                                </span>
                            </div>
                        </div>
                        <img src={garisKiri} alt="" className="absolute left-[15%] top-1/2 -translate-y-12 w-[25%]" />
                        <img src={bayang} alt="bayang2" className="absolute top-1/2 translate-x-30 -translate-y-30 w-[45%]" />
                        <div className="flex flex-col items-center gap-2 w-1/3 transform -translate-y-7">
                            <h4 className="font-serif text-[15px] uppercase italic">RoadShow</h4>
                            <p className="font-serif text-[10px] opacity-90 mb-2">Pangolli Lao Sompe</p>
                            <img src={kapalTengah} alt="" className="w-20 mb-4 drop-shadow-xl" />
                            <div className="bg-[#3d2314] rounded-md border flex-col items-center flex border-black/20 shadow-lg">
                                <span className="text-[#f1e7d0] px-2 py-1 font-serif font-bold text-[10px] whitespace-nowrap">
                                    5–23 January 2026
                                </span>
                            </div>
                        </div>
                        <img src={garisKanan} alt="" className="absolute right-[15%] top-4/12 -translate-y-1/2 w-[25%]" />
                        <img src={bayang} alt="bayang2" className="absolute top-1/2 translate-x-70 -translate-y-40 w-[45%]" />
                        <div className="flex flex-col items-center translate-x-7 w-1/3 transform -translate-y-15">
                            <h4 className="font-serif text-[15px] uppercase italic">Main Event</h4>
                            <p className="font-serif text-[10px] opacity-90 mb-2">Lao Sompe</p>
                            <img src={petiKanan} alt="" className="w-20 mb-4 drop-shadow-xl" />
                            <div className="bg-[#3d2314] rounded-md border flex-col items-center flex  border-black/20 shadow-lg">
                                <span className="text-[#f1e7d0] px-2 py-1 font-serif font-bold text-[10px] whitespace-nowrap">
                                    25 January 2026
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center -translate-y-60">
                <div className="mb-10">
                    <h2 className="text-4xl italic font-[Lora] text-white
               [text-shadow:1px_1px_2px_rgba(0,0,0,0.7),0_4px_8px_rgba(0,0,0,0.6)]">
                        UIGTC 2025'S ARCHIVE
                    </h2>
                </div>
                <div className="relative w-full overflow-hidden">
                    <div className="flex w-max animate-scroll">
                        <img src={fotoMuter} alt="archive" className="h-48 shrink-0 rounded-xl" />
                        <img src={fotoMuter} alt="archive" className="h-48 shrink-0 rounded-xl" />
                        <img src={fotoMuter} alt="archive" className="h-48 shrink-0 rounded-xl" />
                        <img src={fotoMuter} alt="archive" className="h-48 shrink-0 rounded-xl" />
                        <img src={fotoMuter} alt="archive" className="h-48 shrink-0 rounded-xl" />
                        <img src={fotoMuter} alt="archive" className="h-48 shrink-0 rounded-xl" />
                        <img src={fotoMuter} alt="archive" className="h-48 shrink-0 rounded-xl" />
                        <img src={fotoMuter} alt="archive" className="h-48 shrink-0 rounded-xl" />
                    </div>
                </div>

            </div>
        </div>
    )
}
