import { useState } from 'react';
import iconProfileHitam from '../assets/IconProfileHitam.svg';
import iconProfilePutih from '../assets/IconProfilePutih.svg';
import iconHome from '../assets/IconRumah.svg';
import iconToko from '../assets/IconToko.svg';
import iconKeranjang from '../assets/IconKeranjang.svg';
import LogoBulat from '../assets/LogoUIGTCKotak.svg';

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false);
  const [showMobileProfileDropdown, setShowMobileProfileDropdown] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  const menuItemsLoggedOut = [
    { id: 'home', icon: iconHome, path: '/', label: 'Home' },
  ];

  const menuItemsLoggedIn = [
    { id: 'home', icon: iconHome, path: '/', label: 'Home' },
    { id: 'toko', icon: iconToko, path: '/', label: 'Merchandise' },
    { id: 'keranjang', icon: iconKeranjang, path: '/', label: 'Cart' },
  ];

  const menuItems = isLoggedIn ? menuItemsLoggedIn : menuItemsLoggedOut;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 hidden md:block z-[100]">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 border-l border-r border-[#3d2314]/30 bg-white shadow-md">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0"><img src={LogoBulat} alt="UIGTC Logo" className="h-12 w-auto" /></div>
            <div className="flex items-center space-x-2">
              {menuItems.map((item) => (<a key={item.id} href={item.path} className={`p-3 rounded-lg transition-all duration-200 ${activeMenu === item.id ? 'bg-[#5196AA] shadow-md' : 'hover:bg-gray-100'}`} onMouseEnter={() => setActiveMenu(item.id)} onMouseLeave={() => setActiveMenu('')}><img src={item.icon} alt={item.id} className="h-6 w-6" /></a>))}
              {isLoggedIn ? (
                <div className="relative">
                  <button className={`flex items-center space-x-1 p-3 rounded-lg transition-all duration-200 ${showDropdown ? 'bg-[#5196AA] shadow-md' : 'hover:bg-gray-100'}`} onClick={() => setShowDropdown(!showDropdown)} onMouseEnter={() => setActiveMenu('profile')} onMouseLeave={() => setActiveMenu('')}><img src={showDropdown ? iconProfileHitam : iconProfilePutih} alt="Profile" className="h-6 w-6" /><svg className={`h-4 w-4 transition-transform duration-200 ${showDropdown ? 'rotate-180 text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
                  {showDropdown && (<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"><a href="/" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"><img src={iconProfileHitam} alt="Profile" className="h-5 w-5 mr-3" />Profile</a><a href="/" className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"><svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>Sign Out</a></div>)}
                </div>
              ) : (
                <a href="/" className="bg-[#5196AA] hover:bg-[#5196AA] text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200">Login</a>
              )}
            </div>
          </div>
        </div>
        {showDropdown && (<div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />)}
      </nav>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md md:hidden z-[100]">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0"><img src={LogoBulat} alt="UIGTC Logo" className="h-10 w-auto" /></div>
            <button onClick={() => setShowMobileSidebar(!showMobileSidebar)} className="p-2"><svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
          </div>
        </div>
      </nav>
      <div className={`fixed inset-0 z-[200] md:hidden transform transition-transform duration-300 ${showMobileSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileSidebar(false)} />
        <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl">
          <div className="p-4 border-b flex items-center justify-between"><img src={LogoBulat} alt="UIGTC Logo" className="h-10 w-auto" /><button onClick={() => setShowMobileSidebar(false)} className="p-2"><svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></div>
          <div className="py-4">
            {menuItems.map((item) => (
              <a key={item.id} href={item.path} className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors font-medium">
                <img src={item.icon} alt={item.label} className="h-5 w-5 mr-3" />
                {item.label}
              </a>
            ))}
            {isLoggedIn ? (
              <>
                <div className="border-t my-2" />
                <button onClick={() => setShowMobileProfileDropdown(!showMobileProfileDropdown)} className="w-full flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors font-medium">
                  <div className="flex items-center">
                    <img src={iconProfileHitam} alt="Profile" className="h-5 w-5 mr-3" />
                    <span>Profile</span>
                  </div>
                  <svg className={`h-4 w-4 transition-transform duration-200 ${showMobileProfileDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showMobileProfileDropdown && (<div className="bg-gray-50"><a href="/" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors pl-12"><img src={iconProfileHitam} alt="Profile" className="h-5 w-5 mr-3" />View Profile</a><a href="/" className="flex items-center px-6 py-3 text-red-600 hover:bg-red-50 transition-colors pl-12"><svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>Sign Out</a></div>)}
              </>
            ) : (
              <div className="px-6 py-4"><a href="/" className="block w-full text-center bg-[#5196AA] text-white py-2 px-4 rounded-lg hover:bg-[#5196AA] transition-colors font-medium">Login</a></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;