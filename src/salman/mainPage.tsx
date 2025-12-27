
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
    const [showPopup1, setShowPopup1] = useState(false);
    const [showPopup2, setShowPopup2] = useState(false);
    const [showPopup, setShowPopup] = useState(false);



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
            <section className="hidden sm:flex relative overflow-hidden min-h-screen w-full bg-gradient-to-b from-[#EAB775] to-[#F3CC91] overflow-x-hidden justify-center">
                <div className="relative w-full max-w-[2000px] overflow-hidden border-l border-r border-[#3d2314]/30 flex flex-col items-center pt-16 sm:pt-20 md:pt-24 lg:pt-30">
                    <div className="w-full flex flex-col items-center justify-center -mb-12 sm:-mb-16 md:-mb-20 px-4">
                        <img
                            src={judulImg}
                            alt="VIGTC 2026"
                            className="w-[60%] sm:w-[55%] md:w-[50%] max-w-[900px] min-w-[280px] h-auto object-contain transition-all duration-300"
                        />
                        <h2 className="mt-4 sm:mt-5 md:mt-6 italic font-[Lora] text-white text-center leading-tight [text-shadow:1px_1px_2px_rgba(0,0,0,0.7),0_4px_8px_rgba(0,0,0,0.6)] text-[clamp(1rem,2.2vw,2rem)] px-4">
                            Sail The Sea Reach Your Degree
                        </h2>
                    </div>
                    <div className={`mt-16 sm:mt-20 md:mt-24 grid grid-cols-3 items-end w-full sm:px-4 ${mounted ? "animate-fade-up" : "opacity-0"}`}>
                        <div className="flex justify-start -translate-x-5 animate-float-slow">
                            <img
                                src={batuKiri}
                                className="w-[16vw] sm:w-[17vw] md:w-[18vw] min-w-[80px] max-w-[380px] object-contain"
                                alt="Batu Kiri"
                            />
                        </div>
                        <div className="flex justify-center translate-y-4 sm:translate-y-6 md:translate-y-8 animate-float-slow">
                            <img
                                src={hartaTengah}
                                className="w-[28vw] sm:w-[29vw] md:w-[30vw] min-w-[220px] max-w-[700px] object-contain"
                                alt="Harta Karun"
                            />
                        </div>
                        <div className="flex justify-end translate-x-5 animate-float-slow">
                            <img
                                src={batuKanan}
                                className="w-[16vw] sm:w-[17vw] md:w-[18vw] min-w-[80px] max-w-[380px] object-contain"
                                alt="Batu Kanan"
                            />
                        </div>
                    </div>

                    <div className="relative z-20 w-full">
                        <img src={pasirBg} alt="Sand Background" className="w-full object-cover relative -mt-[8%] sm:-mt-[9%] md:-mt-[10%]" />
                        <button className="absolute top-[8%] sm:top-[9%] md:top-[10%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#135D66] hover:bg-[#0E464D] text-[#E3FEF7] font-semibold py-2 px-6 sm:py-3 sm:px-8 md:py-4 md:px-12 rounded-lg shadow-md transition-all duration-300 text-base sm:text-lg md:text-xl lg:text-2xl whitespace-nowrap">
                            Explore
                        </button>
                    </div>

                    <div className="relative w-full z-30 overflow-hidden -mt-[30%] sm:-mt-[32%] md:-mt-[35%]">
                        <img
                            src={ombakDesc}
                            alt="ombakDeskripsi"
                            className="w-full h-auto object-cover animate-float-slow"
                        />
                        <div className="absolute inset-0 flex items-center justify-center z-40 px-4 sm:px-6 md:px-8 lg:px-12">
                            <div className="w-full max-w-[95%] sm:max-w-[92%] md:max-w-[88%] lg:max-w-[85%] xl:max-w-[1400px]">
                                <div className="relative w-full" style={{ aspectRatio: '20 / 7' }}>
                                    <div className="absolute inset-0 flex flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16">
                                        <div className="flex-shrink-0 w-[35%] sm:w-[38%] md:w-[40%] lg:w-[42%] flex items-center justify-center">
                                            <img
                                                src={logoUIGTC}
                                                alt="Logo UIGTC"
                                                className="w-full max-w-[280px] sm:max-w-[350px] md:max-w-[450px] lg:max-w-[550px] xl:max-w-[650px] aspect-square object-contain drop-shadow-2xl"
                                            />
                                        </div>
                                        <div className="flex-1 text-[#0B2E34] flex flex-col justify-center">
                                            <h3 className="font-black leading-[1.05] mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-left uppercase font-[Lora] text-[clamp(1.2rem,3.5vw,5.5rem)]">
                                                What's <br /> UI Goes to <br /> Celebes?
                                            </h3>

                                            <p className="leading-relaxed text-left font-medium text-[clamp(0.65rem,1.5vw,1.875rem)] max-w-[90%] md:max-w-[85%] lg:max-w-[650px]">
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                    <div className="relative w-full z-30 overflow-hidden -mt-[18%] sm:-mt-[19%] md:-mt-[20%]">
                        <img src={lautDalam} alt="lautDalam" className="w-full object-cover" />

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl -mt-[10%] font-serif tracking-widest mb-12 sm:mb-16 md:mb-20 lg:mb-24 xl:mb-28 drop-shadow-md">
                                TIMELINE
                            </h3>
                            <div className="relative w-full max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[75%] xl:max-w-[70%] 2xl:max-w-[1400px]" style={{ aspectRatio: '16 / 6' }}>
                                <img
                                    src={bayang}
                                    alt="bayang1"
                                    className="absolute left-0 top-[45%] -translate-x-[45%] -translate-y-1/2 w-[38%] sm:w-[40%] md:w-[42%] lg:w-[45%] opacity-40"
                                />
                                <img
                                    src={bayang}
                                    alt="bayang2"
                                    className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 w-[38%] sm:w-[40%] md:w-[42%] lg:w-[45%] opacity-40"
                                />
                                <img
                                    src={bayang}
                                    alt="bayang3"
                                    className="absolute right-0 top-[45%] translate-x-[45%] -translate-y-1/2 w-[38%] sm:w-[40%] md:w-[92%] lg:w-[45%] opacity-40"
                                />
          <img
            src={garisKiri}
            alt="garis kiri"
            className="absolute left-[18%] sm:left-[16%] md:left-[14%] lg:left-[12%] xl:left-[10%] 2xl:left-[8%] top-[52%] sm:top-[53%] md:top-[54%] lg:top-[55%] xl:top-[56%] -translate-y-1/2 w-[20%] sm:w-[22%] md:w-[24%] lg:w-[26%] xl:w-[28%] 2xl:w-[30%] h-auto"
          />
          <img
            src={garisKanan}
            alt="garis kanan"
            className="absolute right-[24%] sm:right-[22%] md:right-[20%] lg:right-[18%] xl:right-[16%] 2xl:right-[14%] top-[52%] sm:top-[53%] md:top-[54%] lg:top-[55%] xl:top-[56%] -translate-y-1/2 w-[20%] sm:w-[22%] md:w-[24%] lg:w-[26%] xl:w-[28%] 2xl:w-[30%] h-auto"
          />
                                <div className="absolute left-[5%] sm:left-[3%] md:left-[1%] lg:left-[-2%] xl:left-[-4%] 2xl:left-[-6%] top-0 flex flex-col items-center w-[35%] sm:w-[32%] md:w-[30%] lg:w-[28%] xl:w-[26%] 2xl:w-[24%]">
                                    <h4 className="font-serif text-[clamp(0.75rem,2.2vw,2rem)] uppercase italic text-center leading-tight mb-1 sm:mb-2">
                                        Pre-Event
                                    </h4>
                                    <p className="font-serif text-[clamp(0.55rem,1.3vw,1rem)] opacity-90 text-center mb-2 sm:mb-3 md:mb-4">
                                        Tarima Kareba Madeceng
                                    </p>
                                    <img
                                        src={botolKiri}
                                        alt="bottle"
                                        onClick={() => setShowPopup1(true)}
                                        className="w-[42%] sm:w-[44%] md:w-[46%] lg:w-[50%] xl:w-[52%] 2xl:w-[55%] aspect-square object-contain mb-2 sm:mb-3 md:mb-4 drop-shadow-xl animate-sway-slow cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-6 hover:drop-shadow-2xl"
                                    />
                                    <div className="bg-[#3d2314] rounded-md border border-black/20 shadow-lg px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2">
                                        <span className="text-[#f1e7d0] font-serif font-bold text-[clamp(0.55rem,1.2vw,0.95rem)] whitespace-nowrap">
                                            4–23 January 2026
                                        </span>
                                    </div>
                                </div>
                                {showPopup1 && (
                                    <div
                                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in px-4"
                                        onClick={() => setShowPopup1(false)}
                                    >
                                        <div
                                            className="relative bg-gradient-to-b from-[#B8D4DB] to-[#9BC4CC] rounded-2xl shadow-2xl max-w-md w-full p-8 sm:p-10 animate-scale-in"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                onClick={() => setShowPopup1(false)}
                                                className="absolute top-4 right-4 text-[#0B2E34] hover:text-[#1a3d44] transition-colors"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                            <div className="flex flex-col items-center text-[#0B2E34]">
                                                <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-2 text-center uppercase">
                                                    Pre-Event
                                                </h2>
                                                <p className="text-base sm:text-lg font-serif mb-4 text-center italic">
                                                    Tarima Kareba Madeceng
                                                </p>
                                                <div className="bg-white rounded-lg px-4 py-2 mb-6 shadow-md">
                                                    <span className="font-serif font-bold text-sm sm:text-base">
                                                        4–23 January 2026
                                                    </span>
                                                </div>

                                                <img
                                                    src={botolKiri}
                                                    alt="bottle"
                                                    className="w-24 sm:w-32 mb-6 drop-shadow-xl animate-float-gentle"
                                                />

                                                <p className="text-sm sm:text-base leading-relaxed text-justify mb-6 font-medium">
                                                    'Tarima Kareba Madeceng', yang berarti 'menerima kabar gembira'
                                                    dalam Bahasa Bugis, menjadi simbol awal dari perjalanan edukasi menuju
                                                    Universitas Indonesia (UI). Pre-event menjadi momen ketika filosofi bahwa UIGTC
                                                    hadir sebagai kabar baik atau 'harta karun' yang membawa harapan dan semangat
                                                    baru bagi para peserta.
                                                </p>
                                                <p className="text-sm sm:text-base leading-relaxed text-justify mb-6 font-medium">
                                                    Dalam tahap ini, peserta akan menunjukkan antusiasme mereka dengan
                                                    berekspresi melalui video pendek yang menggambarkan reaksi mereka saat
                                                    menerima kabar gembira tentang UIGTC 2026 dan harapan mereka dalam
                                                    mengejar cita-cita pendidikan. Layaknya seseorang yang menemukan peta
                                                    menuju harta karun, peserta diajak untuk mulai menyusun langkah awal
                                                    mereka menuju impian, dengan semangat, imajinasi, dan kreativitas.
                                                </p>

                                                <button
                                                    onClick={() => setShowPopup1(false)}
                                                    className="bg-[#135D66] hover:bg-[#0E464D] text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                                                >
                                                    Done
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="absolute left-1/2 top-[18%] sm:top-[20%] md:top-[22%] -translate-x-1/2 flex flex-col items-center w-[30%] sm:w-[28%] md:w-[26%]">
                                    <h4 className="font-serif text-[clamp(0.7rem,2vw,1.8rem)] uppercase italic text-center leading-tight mb-1 sm:mb-2">
                                        RoadShow
                                    </h4>
                                    <p className="font-serif text-[clamp(0.5rem,1.2vw,0.9rem)] opacity-90 text-center mb-2 sm:mb-3 md:mb-4">
                                        Pangolli Lao Sompe
                                    </p>
                                    <img
                                        src={kapalTengah}
                                        alt="ship"
                                        onClick={() => setShowPopup2(true)}
                                        className="w-[52%] sm:w-[55%] md:w-[58%] lg:w-[62%] aspect-square object-contain mb-2 sm:mb-3 md:mb-4 drop-shadow-xl animate-sway-slow cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-2 hover:drop-shadow-2xl"
                                    />
                                    <div className="bg-[#3d2314] rounded-md border border-black/20 shadow-lg px-2 py-1 sm:px-3 sm:py-1.5">
                                        <span className="text-[#f1e7d0] font-serif font-bold text-[clamp(0.5rem,1.1vw,0.85rem)] whitespace-nowrap">
                                            5–23 January 2026
                                        </span>
                                    </div>
                                </div>

                                {showPopup2 && (
                                    <div
                                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in px-4"
                                        onClick={() => setShowPopup2(false)}
                                    >
                                        <div
                                            className="relative bg-gradient-to-b from-[#B8D4DB] to-[#9BC4CC] rounded-2xl shadow-2xl max-w-md w-full p-8 sm:p-10 animate-scale-in"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                onClick={() => setShowPopup2(false)}
                                                className="absolute top-4 right-4 text-[#0B2E34] hover:text-[#1a3d44] transition-colors"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                            <div className="flex flex-col items-center text-[#0B2E34]">
                                                <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-2 text-center uppercase">
                                                    RoadShow
                                                </h2>
                                                <p className="text-base sm:text-lg font-serif mb-4 text-center italic">
                                                    Pangolli Lao Sompe
                                                </p>
                                                <div className="bg-white rounded-lg px-4 py-2 mb-6 shadow-md">
                                                    <span className="font-serif font-bold text-sm sm:text-base">
                                                        5–23 January 2026
                                                    </span>
                                                </div>
                                                <img
                                                    src={kapalTengah}
                                                    alt="ship"
                                                    className="w-28 sm:w-36 mb-6 drop-shadow-xl animate-sail"
                                                />
                                                <p className="text-sm sm:text-base leading-relaxed text-justify mb-6 font-medium">
                                                    'Pangolli Lao Sompe' dalam Bahasa Bugis berarti 'mengayuh menuju harta karun',
                                                    melambangkan perjalanan aktif peserta dalam mengarungi tantangan untuk mencapai
                                                    tujuan mereka. Seperti kapal yang berlayar melintasi lautan luas, roadshow ini
                                                    mengajak peserta untuk terus bergerak maju, menghadapi ombak kehidupan dengan
                                                    semangat dan determinasi.
                                                </p>
                                                <p className="text-sm sm:text-base leading-relaxed text-justify mb-6 font-medium">
                                                    Dalam tahap ini, UIGTC akan mengunjungi berbagai sekolah di Sulawesi untuk
                                                    memberikan sosialisasi, seminar, dan workshop. Peserta akan mendapatkan
                                                    kesempatan untuk berinteraksi langsung dengan kakak-kakak UI, mendapatkan tips
                                                    persiapan SNBT, dan memahami lebih dalam tentang kehidupan kampus. Seperti
                                                    pelaut yang mengikuti peta, peserta dibimbing untuk menavigasi jalan mereka
                                                    menuju impian kuliah di Universitas Indonesia.
                                                </p>
                                                <button
                                                    onClick={() => setShowPopup2(false)}
                                                    className="bg-[#135D66] hover:bg-[#0E464D] text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                                                >
                                                    Done
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="absolute right-0 top-0 flex flex-col items-center w-[30%] sm:w-[28%] md:w-[26%]">
                                    <h4 className="font-serif text-[clamp(0.7rem,2vw,1.8rem)] uppercase italic text-center leading-tight mb-1 sm:mb-2">
                                        Main Event
                                    </h4>
                                    <p className="font-serif text-[clamp(0.5rem,1.2vw,0.9rem)] opacity-90 text-center mb-2 sm:mb-3 md:mb-4">
                                        Lao Sompe
                                    </p>
                                    <img
                                        src={petiKanan}
                                        alt="chest"
                                        onClick={() => setShowPopup(true)}
                                        className="w-[52%] sm:w-[55%] md:w-[58%] lg:w-[62%] aspect-square object-contain mb-2 sm:mb-3 md:mb-4 drop-shadow-xl animate-sway-slow cursor-pointer transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-2xl"
                                    />
                                    <div className="bg-[#3d2314] rounded-md border border-black/20 shadow-lg px-2 py-1 sm:px-3 sm:py-1.5">
                                        <span className="text-[#f1e7d0] font-serif font-bold text-[clamp(0.5rem,1.1vw,0.85rem)] whitespace-nowrap">
                                            25 January 2026
                                        </span>
                                    </div>
                                </div>
                                {showPopup && (
                                    <div
                                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in px-4"
                                        onClick={() => setShowPopup(false)}
                                    >
                                        <div
                                            className="relative bg-gradient-to-b from-[#B8D4DB] to-[#9BC4CC] rounded-2xl shadow-2xl max-w-md w-full p-8 sm:p-10 animate-scale-in"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                onClick={() => setShowPopup(false)}
                                                className="absolute top-4 right-4 text-[#0B2E34] hover:text-[#1a3d44] transition-colors"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                            <div className="flex flex-col items-center text-[#0B2E34]">
                                                <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-2 text-center uppercase">
                                                    Main Event
                                                </h2>
                                                <p className="text-base sm:text-lg font-serif mb-4 text-center italic">
                                                    Lao Sompe
                                                </p>
                                                <div className="bg-white rounded-lg px-4 py-2 mb-6 shadow-md">
                                                    <span className="font-serif font-bold text-sm sm:text-base">
                                                        25 January 2026
                                                    </span>
                                                </div>
                                                <img
                                                    src={petiKanan}
                                                    alt="chest"
                                                    className="w-32 sm:w-40 mb-6 drop-shadow-xl animate-treasure-glow"
                                                />
                                                <p className="text-sm sm:text-base leading-relaxed text-justify mb-6 font-medium">
                                                    'Lao Sompe' yang berarti 'menuju harta karun' adalah puncak dari seluruh
                                                    perjalanan UIGTC. Setelah menerima kabar gembira dan mengayuh melewati
                                                    berbagai rintangan, akhirnya peserta tiba di destinasi utama—harta karun
                                                    yang sesungguhnya. Harta karun ini bukan hanya tentang pengetahuan akademis,
                                                    tetapi juga pengalaman berharga, koneksi dengan teman sebaya, dan inspirasi
                                                    untuk meraih mimpi.
                                                </p>
                                                <p className="text-sm sm:text-base leading-relaxed text-justify mb-6 font-medium">
                                                    Main Event adalah hari di mana semua peserta berkumpul untuk mengikuti
                                                    serangkaian kegiatan edukatif dan inspiratif. Acara ini mencakup talkshow
                                                    dengan alumni UI yang sukses, sesi tanya jawab interaktif, games edukatif,
                                                    dan pengenalan mendalam tentang berbagai fakultas di UI. Ini adalah momen
                                                    di mana peserta tidak hanya mendapatkan ilmu, tetapi juga merasakan atmosfer
                                                    kampus UI dan membangun networking yang akan berguna untuk masa depan mereka.
                                                </p>
                                                <button
                                                    onClick={() => setShowPopup(false)}
                                                    className="bg-[#135D66] hover:bg-[#0E464D] text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                                                >
                                                    Done
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center mt-[8%] sm:mt-[9%] md:mt-[10%] z-20 relative w-full">
                        <div className="mb-8 sm:mb-10 md:mb-14 lg:mb-20 xl:mb-24 2xl:mb-28 text-center px-4">
                            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl italic font-[Lora] text-white [text-shadow:2px_2px_4px_rgba(0,0,0,0.8),0_6px_12px_rgba(0,0,0,0.7)] tracking-wide">
                                UIGTC 2025'S ARCHIVE
                            </h2>
                        </div>

                        <div className="relative w-full overflow-hidden mb-16 sm:mb-20 md:mb-28 lg:mb-36 xl:mb-44 2xl:mb-52 group">
                            <div className="absolute inset-y-0 left-0 w-16 sm:w-20 md:w-28 lg:w-40 xl:w-52 2xl:w-64 z-10 bg-gradient-to-r from-[#0B2E34]/30 to-transparent"></div>
                            <div className="absolute inset-y-0 right-0 w-16 sm:w-20 md:w-28 lg:w-40 xl:w-52 2xl:w-64 z-10 bg-gradient-to-l from-[#0B2E34]/30 to-transparent"></div>

                            <div className="flex w-max animate-scroll gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 hover:[animation-play-state:paused]">
                                {[...Array(20)].map((_, i) => (
                                    <img
                                        key={i}
                                        src={fotoMuter}
                                        alt={`archive-${i + 1}`}
                                        className="h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[450px] 2xl:h-[550px] w-auto shrink-0 rounded-xl sm:rounded-2xl shadow-2xl hover:scale-105 hover:shadow-3xl transition-all duration-300 cursor-pointer"
                                    />
                                ))}
                            </div>
                        </div>
                        <section className="relative w-screen h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] overflow-hidden">
                            <img src={bgBiruMuda} alt="bgBirumuda" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="relative z-10 container mx-auto h-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-6 sm:py-8 md:py-10 flex items-center">
                                <div className="flex flex-col justify-center w-full md:w-[55%] lg:w-1/2 text-[#0B2E34] bg-white/10 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-4 sm:p-5 md:p-0 rounded-xl">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-serif font-bold leading-tight mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-8 drop-shadow-sm">
                                        LET'S TAKE A LOOK <br /> AT OUR MERCH
                                    </h2>
                                    <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl leading-relaxed mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10 text-justify md:text-left font-medium opacity-90 max-w-xl">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p>
                                    <button className="w-fit bg-[#E39A3B] text-[#1F2D2F] px-5 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 lg:px-9 lg:py-3.5 xl:px-10 xl:py-4 rounded-lg font-bold text-sm sm:text-base md:text-lg shadow-lg hover:bg-[#d68b2a] hover:scale-105 transition-all duration-300">
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    )
}
