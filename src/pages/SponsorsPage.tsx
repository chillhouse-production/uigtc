import Navbar from '../salman/navBar';
import Footer from '../salman/footer';
import HistoryBG from '../assets/history-bg.svg';

// Import sponsor logos
import AASFoundationLogo from '../assets/logo_sponsor/aas.png';
import BankSulSelBarLogo from '../assets/logo_sponsor/BANK SULSELBAR.png';
import HaluoleoLandLogo from '../assets/logo_sponsor/Haluoleo Land.png';
import AjabaIndustriLogo from '../assets/logo_sponsor/OFFICIAL LOGO Ajaba Industri  Default Horizontal.png';
import KallaLogo from '../assets/logo_sponsor/Logo KALLA.png';
import PelindoLogo from '../assets/logo_sponsor/Pelindo Jasa Maritim-putih (3) (1).png';

interface Sponsor {
    id: string;
    name: string;
    logo: string;
    size: 'S' | 'B' | 'M' | 'L'; // L=Title, M=Gold, S=Silver, B=Bronze
    description?: string;
    website?: string;
}

// Sponsor data - organized by tier
const sponsors: Sponsor[] = [
    {
        id: '1',
        name: 'PT Pelindo Jasa Maritim',
        logo: PelindoLogo,
        size: 'S', // Silver
    },
    {
        id: '2',
        name: 'AAS Foundation',
        logo: AASFoundationLogo,
        size: 'S', // Silver
    },
    {
        id: '3',
        name: 'KALLA',
        logo: KallaLogo,
        size: 'S', // Silver
    },
    {
        id: '4',
        name: 'Bank SulSelBar',
        logo: BankSulSelBarLogo,
        size: 'B', // Bronze
    },
    {
        id: '5',
        name: 'Haluoleo Land',
        logo: HaluoleoLandLogo,
        size: 'B', // Bronze
    },
    {
        id: '6',
        name: 'Ajaba Industri',
        logo: AjabaIndustriLogo,
        size: 'B', // Bronze
    },

];

export default function SponsorsPage() {
    return (
        <div className="min-h-screen overflow-auto relative flex flex-col">
            {/* Background */}
            <img src={HistoryBG} alt="Background" className="fixed inset-0 w-full h-full object-cover z-0" />

            {/* Navbar */}
            <div className="relative z-50 w-full">
                <Navbar />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center px-4 pt-28 md:pt-32 pb-12">
                <div className="w-full max-w-6xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-block mb-4">
                            <span className="text-5xl">⚓</span>
                        </div>
                        <h1
                            className="text-4xl md:text-6xl font-bold text-white mb-4"
                            style={{
                                fontFamily: 'treamd',
                                textShadow: '3px 3px 0px #3d2314, 5px 5px 0px rgba(61, 35, 20, 0.5)',
                            }}
                        >
                            OUR SPONSORS
                        </h1>
                        <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
                            Terima kasih kepada para sponsor yang telah mendukung perjalanan UIGTC 2026
                        </p>
                        <div className="mt-4 flex justify-center gap-2">
                            <div className="w-16 h-1 bg-amber-400 rounded-full"></div>
                            <div className="w-4 h-1 bg-amber-400/60 rounded-full"></div>
                            <div className="w-2 h-1 bg-amber-400/40 rounded-full"></div>
                        </div>
                    </div>
                    {/* Sponsors Card */}
                    <section className="mb-12">
                        <div className="bg-[#092D39] rounded-3xl shadow-2xl p-8 md:p-12 border border-white/10">
                            {/* Title */}
                            <h2
                                className="text-2xl md:text-3xl font-bold text-white text-center mb-8"
                                style={{ fontFamily: 'treamd' }}
                            >
                                UIGTC 2026 sponsored by:
                            </h2>

                            {/* Sponsor Logos */}
                            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                                {sponsors.map((sponsor) => (
                                    <div
                                        key={sponsor.id}
                                        className="transform hover:scale-110 transition-all duration-300"
                                    >
                                        <img
                                            src={sponsor.logo}
                                            alt={sponsor.name}
                                            className={`object-contain ${sponsor.size === 'S' ? 'h-20 md:h-24' : 'h-14 md:h-18'}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>


                    {/* Thank You Section */}
                    <section className="mt-8">
                        <div className="bg-gradient-to-r from-[#135D66]/80 to-[#0E464D]/80 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: 'treamd' }}>
                                Terima Kasih
                            </h2>
                            <p className="text-white/90 max-w-2xl mx-auto">
                                Atas dukungan dan kepercayaan para sponsor, UIGTC 2026 dapat terlaksana dengan baik.
                                Semoga kerjasama ini membawa manfaat bagi dunia pendidikan Indonesia.
                            </p>
                            <div className="mt-6 flex justify-center gap-4 flex-wrap">
                                <div className="bg-white/10 rounded-lg px-4 py-2">
                                    <p className="text-white/60 text-xs">Event Date</p>
                                    <p className="text-white font-bold">24 Januari 2026</p>
                                </div>
                                <div className="bg-white/10 rounded-lg px-4 py-2">
                                    <p className="text-white/60 text-xs">Location</p>
                                    <p className="text-white font-bold">Makassar, Sulawesi Selatan</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
}
