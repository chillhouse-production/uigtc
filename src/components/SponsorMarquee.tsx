import { Link } from 'react-router-dom';
import './SponsorMarquee.css';

// Import sponsor logos
import AASFoundationLogo from '../assets/logo_sponsor/aas.png';
import BankSulSelBarLogo from '../assets/logo_sponsor/BANK SULSELBAR.png';
import HaluoleoLandLogo from '../assets/logo_sponsor/Haluoleo Land.png';
import AjabaIndustriLogo from '../assets/logo_sponsor/OFFICIAL LOGO Ajaba Industri  Default Horizontal.png';

interface Sponsor {
    id: string;
    name: string;
    logo: string;
    size: 'S' | 'B'; // S=Silver, B=Bronze
}

// Data sponsor
const sponsors: Sponsor[] = [
    { id: '1', name: 'AAS Foundation', logo: AASFoundationLogo, size: 'S' },  // Silver
    { id: '2', name: 'Bank SulSelBar', logo: BankSulSelBarLogo, size: 'B' },  // Bronze
    { id: '3', name: 'Haluoleo Land', logo: HaluoleoLandLogo, size: 'B' },    // Bronze
    { id: '4', name: 'Ajaba Industri', logo: AjabaIndustriLogo, size: 'B' },  // Bronze
];

const SponsorMarquee = () => {
    // Duplicate sponsors for seamless infinite scroll
    const duplicatedSponsors = [...sponsors, ...sponsors, ...sponsors];

    return (
        <>
            <Link to="/sponsors" className="sponsor-marquee-link">
                <div className="sponsor-marquee-wrapper">
                    <div className="sponsor-marquee-container">
                        <div className="sponsor-marquee-track">
                            {duplicatedSponsors.map((sponsor, index) => (
                                <div
                                    key={`${sponsor.id}-${index}`}
                                    className={`sponsor-item sponsor-size-${sponsor.size}`}
                                >
                                    <img
                                        src={sponsor.logo}
                                        alt={sponsor.name}
                                        className="sponsor-logo"
                                    />
                                    <span className="sponsor-name">{sponsor.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Link>
            {/* Spacer to push content below the fixed marquee */}
            <div className="sponsor-marquee-spacer" />
        </>
    );
};

export default SponsorMarquee;

