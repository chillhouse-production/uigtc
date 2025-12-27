
import { useEffect, useState } from "react"

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
import fotoMuter from '../assets/RollingPhotos.png'
import bgBiruMuda from '../assets/BackGroundBiruMuda.png'


export default function MainPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div>
            <div className="block flex flex-col h-max-screen  sm:hidden z-0 pt-20 bg-gradient-to-b from-[#EAB775] to-[#F3CC91] overflow-hidden">
                <div className="flex flex-col w-screen items-center justify-center">
                    <img src={judulImg} alt="UIGTC judul" className="h-32 w-300px mb-4" />
                    <h2 className="text-sm italic font-[Lora] text-white
               [text-shadow:1px_1px_2px_rgba(0,0,0,0.7),0_4px_8px_rgba(0,0,0,0.6)]">
                        Sail The Sea Reach Your Degree
                    </h2>


                </div>
                <div className="flex flex-col h-400px w-screen items-center justify-center mt-10"></div>
                <div
                    className={`flex flex-row w-screen items-center justify-center mt-10
  ${mounted ? "animate-fade-up" : "opacity-0"}`}
                >
                    <div className="z-10 translate-y-[10px] animate-float-slow">
                        <img src={batuKiri} alt="" />
                    </div>

                    <div className="z-10 translate-y-[25px] animate-float-slow">
                        <img src={hartaTengah} alt="" />
                    </div>

                    <div className="z-10 animate-float-slow">
                        <img src={batuKanan} alt="" />
                    </div>
                </div>

                <div className="relative z-20 -translate-y-[60px]">
                    <img src={pasirBg} alt="" className="w-full" />
                    <button className="absolute top-3/12 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#135D66] hover:bg-[#0E464D] text-[#E3FEF7] font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300">
                        Explore
                    </button>
                </div>
                <div className="relative z-30 -translate-y-[120px] w-full h-[550px]">
                    <img
                        src={ombakDesc}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover animate-float-slow"
                    />

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[92%] flex flex-col items-center gap-5">

                        <img
                            src={logoUIGTC}
                            alt="Logo"
                            className="w-40 h-40 shrink-0"
                        />

                        <div className="text-[#0B2E34] max-w-[260px]">
                            <h3 className="text-xl text-center font-extrabold leading-tight mb-2">
                                WHAT’S UI GOES TO CELEBES?
                            </h3>

                            <p className="text-sm leading-relaxed text-justify hyphens-auto">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                            </p>
                        </div>
                    </div>

                </div>


                <div className="relative z-40 -translate-y-[260px] w-full">
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
                                <img src={botolKiri} alt="" className="w-10 mb-4 drop-shadow-xl animate-sway-slow" />
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
                                <img src={kapalTengah} alt="" className="w-20 mb-4 drop-shadow-xl animate-sway-slow" />
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
                                <img src={petiKanan} alt="" className="w-20 mb-4 drop-shadow-xl animate-sway-slow" />
                                <div className="bg-[#3d2314] rounded-md border flex-col items-center flex  border-black/20 shadow-lg">
                                    <span className="text-[#f1e7d0] px-2 py-1 font-serif font-bold text-[10px] whitespace-nowrap">
                                        25 January 2026
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center -mt-60">
                    <div className="mb-10">
                        <h2 className="text-4xl italic font-[Lora] text-white
               [text-shadow:1px_1px_2px_rgba(0,0,0,0.7),0_4px_8px_rgba(0,0,0,0.6)]">
                            UIGTC 2025'S ARCHIVE
                        </h2>
                    </div>
                    <div className="relative w-full overflow-hidden mb-20">
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
                    <section className="relative w-screen h-[420px] overflow-hidden">
                        <img src={bgBiruMuda} alt="bgBirumuda" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="relative z-10 flex h-full px-6 py-10">
                            <div className="flex flex-col justify-center w-2/3 text-[#0B2E34]">
                                <h2 className="text-3xl font-serif font-bold leading-tight mb-4">
                                    LET’S TAKE A LOOK <br /> AT OUR MERCH
                                </h2>
                                <p className="text-sm leading-relaxed mb-6 text-justify">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                                <button className="w-fit bg-[#E39A3B] text-[#1F2D2F]
        px-6 py-2 rounded-lg font-semibold shadow-md">
                                    Buy
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <section className="hidden sm:flex relative min-h-screen w-full bg-gradient-to-b from-[#EAB775] to-[#F3CC91] overflow-hidden justify-center">
                <div className="relative w-full max-w-[1400px] border-l border-r border-[#3d2314]/30 flex flex-col items-center pt-30">
                    <div className="w-full flex flex-col items-center justify-center -mb-20">
                        <img
                            src={judulImg}
                            alt="VIGTC 2026"
                            className="w-[50%] max-w-[900px] min-w-[300px] h-auto object-contain transition-all duration-300"
                        />
                        <h2 className="mt-6 italic font-[Lora] text-white text-center leading-tight
                /* Menggunakan text-shadow agar tetap terbaca saat di-zoom */
                [text-shadow:1px_1px_2px_rgba(0,0,0,0.7),0_4px_8px_rgba(0,0,0,0.6)]
                /* Ukuran teks responsif: minimal 1.25rem, ideal 2.5vw, maksimal 2rem */
                text-[clamp(1.25rem,2.5vw,2rem)]">
                Sail The Sea Reach Your Degree
            </h2>
                    </div>

                    <div className={`mt-24 grid grid-cols-3 items-end w-full ${mounted ? "animate-fade-up" : "opacity-0"}`}>
                        <div className="flex justify-start animate-float-slow">
                            <img
                                src={batuKiri}
                                className="w-[18vw] min-w-[80px] max-w-[280px] object-contain"
                                alt="Batu Kiri"
                            />
                        </div>
                        <div className="flex justify-center translate-y-8 animate-float-slow">
                            <img
                                src={hartaTengah}
                                className="w-[30vw] min-w-[150px] max-w-[500px] object-contain"
                                alt="Harta Karun"
                            />
                        </div>
                        <div className="flex justify-end animate-float-slow">
                            <img
                                src={batuKanan}
                                className="w-[18vw] min-w-[80px] max-w-[280px] object-contain"
                                alt="Batu Kanan"
                            />
                        </div>
                    </div>
                    <div className="relative z-20 -mt-30 w-full">
                        <img
                            src={pasirBg}
                            alt="Sand Background"
                            className="w-full object-cover"
                        />
                        <button className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 
                bg-[#135D66] hover:bg-[#0E464D] text-[#E3FEF7] 
                font-semibold py-4 px-12 rounded-lg shadow-md 
                transition-all duration-300 
                text-xl md:text-2xl whitespace-nowrap">
                            Explore
                        </button>
                    </div>

                </div>
            </section>
        </div>
    )
}
