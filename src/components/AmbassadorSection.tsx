import { ambassadors } from "../services/ambassadors";
import botol from '../assets/BotolKiri.svg';
import peti from '../assets/PetiKanan.svg';
import kapal from '../assets/KapalTengah.svg';

export default function AmbassadorSection() {
    return (
        <section className="relative w-full py-10 sm:py-20 overflow-hidden bg-[#eecfa1]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-40 mix-blend-multiply pointer-events-none"></div>

            {/* Background Decorations */}
            <img src={botol} alt="" className="absolute -left-10 top-20 w-32 sm:w-48 opacity-20 rotate-12 blur-[1px] pointer-events-none" />
            <img src={peti} alt="" className="absolute -right-5 bottom-10 w-32 sm:w-48 opacity-20 -rotate-6 blur-[1px] pointer-events-none" />
            <img src={kapal} alt="" className="absolute left-10 bottom-0 w-24 sm:w-40 opacity-10 rotate-3 pointer-events-none" />

            <div className="container mx-auto px-4 z-10 relative">
                <div className="flex flex-col items-center mb-16 text-center relative">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-treamd text-[#3d2314] mb-4 drop-shadow-md tracking-wider">
                        OUR CREW
                    </h2>
                    <p className="font-serif text-[#5c3a21] text-lg sm:text-xl italic max-w-2xl">
                        The finest sailors and navigators of the seven seas.
                    </p>
                    <div className="w-40 h-1.5 bg-[#3d2314] mt-6 rounded-[100%] opacity-80 shadow-sm"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-10 justify-items-center perspective-px">
                    {ambassadors.map((ambassador, index) => {
                        // Random-ish rotation based on index
                        const rotations = ['rotate-[2deg]', '-rotate-[2deg]', 'rotate-[1deg]', '-rotate-[1deg]', 'rotate-[3deg]'];
                        const rotationClass = rotations[index % rotations.length];

                        return (
                            <div
                                key={ambassador.id}
                                className={`group relative w-full max-w-[220px] aspect-[3/4] transition-all duration-300 hover:z-20 hover:scale-105 ${rotationClass}`}
                            >
                                {/* Pin */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-4 h-4 rounded-full bg-[#2a1a11] shadow-[0_2px_4px_rgba(0,0,0,0.5)] border border-[#5c3a21]">
                                    <div className="absolute top-[3px] left-[3px] w-1.5 h-1.5 rounded-full bg-[#8b5a36] opacity-80"></div>
                                </div>

                                <div className="relative w-full h-full">
                                    {/* Card Background/Frame - Parchment Paper Style */}
                                    <div className="absolute inset-0 bg-[#F8EBCD] shadow-[5px_5px_15px_rgba(0,0,0,0.3)] flex flex-col items-center p-3 border border-[#3d2314]/30 transform group-hover:shadow-[10px_10px_25px_rgba(0,0,0,0.4)] transition-shadow duration-300">
                                        {/* Paper Texture Overlay */}
                                        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] pointer-events-none mix-blend-multiply"></div>

                                        {/* WANTED Header */}
                                        <div className="w-full text-center border-b-2 border-[#3d2314] mb-2 pb-1 relative z-10 mt-2">
                                            <h3 className="font-treamd text-2xl sm:text-3xl text-[#3d2314] tracking-widest leading-none drop-shadow-sm">WANTED</h3>
                                        </div>

                                        {/* Image Container - Full width mobile */}
                                        <div className="w-full aspect-square bg-[#3d2314]/20 border-2 border-[#3d2314] mb-2 overflow-hidden relative z-10 p-0.5 shadow-inner">
                                            <div className="w-full h-full overflow-hidden border border-[#3d2314]/50">
                                                <img
                                                    src={ambassador.image}
                                                    alt={ambassador.name}
                                                    className="w-full h-full object-cover object-top sepia-[.4] contrast-125 group-hover:sepia-0 group-hover:contrast-100 transition-all duration-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Text Content */}
                                        <div className="text-center w-full flex-1 flex flex-col justify-between relative z-10">
                                            <div>
                                                <h3 className="font-treamd text-[#3d2314] text-sm sm:text-xl leading-tight mb-1 line-clamp-2 uppercase drop-shadow-sm">
                                                    {ambassador.name}
                                                </h3>

                                                <p className="font-serif text-[#5c3a21] text-[10px] sm:text-xs font-bold italic line-clamp-2 leading-tight mt-1">
                                                    {ambassador.school}
                                                </p>
                                            </div>

                                            <a
                                                href={ambassador.instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-2 text-[#3d2314] hover:text-[#135D66] transition-colors duration-300 flex items-center justify-center gap-1 group/link"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover/link:opacity-100">
                                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                                </svg>
                                                <span className="text-[10px] font-bold tracking-wide uppercase">Connect</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Gradient Overlay for blending */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#EAB775] to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#EAB775] to-transparent pointer-events-none"></div>
        </section>
    );
}
