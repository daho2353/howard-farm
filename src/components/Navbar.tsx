import { useState } from "react";
import { Menu, X } from "lucide-react";
import apiBaseUrl from "../config";

interface NavbarProps {
  setPage: (page: string) => void;
  user: any;
  setUser: (user: any) => void;
}

const Navbar = ({ setPage, user, setUser }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", page: "Home" },
    { label: "About", page: "About" },
    { label: "Contact Us", page: "Contact" },
    { label: "Shop", page: "Shop" },
    { label: "Check Out", page: "Checkout" },
    ...(user?.isAdmin
      ? [
          { label: "Products", page: "Admin" },
          { label: "Orders", page: "AdminOrders" } // ✅ Added here
        ]
      : []),
    { label: user ? `Account (${user.name})` : "Account", page: "Account" },
  ];

  const handleNavClick = (page: string) => {
    setPage(page);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
        await fetch(`${apiBaseUrl}/api/auth/logout`, {
            method: "POST",
            credentials: "include",
          });         
      setUser(null);
      setPage("Home"); // optional: redirect to home or login
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
  
  const buttonClass =
    "w-11/12 max-w-xs py-2 rounded-xl bg-[#a8936a] text-white font-semibold text-lg hover:bg-[#967f55] transition duration-300";

  const logoutClass =
    "w-11/12 max-w-xs py-2 rounded-xl bg-red-500 text-white font-semibold text-lg hover:bg-red-700 transition duration-300";

  return (
    <div className="w-full px-4 py-4">
      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img
            src="https://howardfarmblob.blob.core.windows.net/websiteimages/logo.png"
            alt="Howard's Farm Logo"
            className="h-28 w-auto object-contain"
          />
          <div className="text-[#4a3a28] text-xl font-serif leading-tight">
            <div>Yankton</div>
            <div>Oregon</div>
          </div>
        </div>

        <div className="flex gap-6">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.page)}
              className="text-[#4a3a28] bg-[#f3f5f9] hover:bg-[#e7e4db] px-4 py-2 rounded-md font-medium transition"
            >
              {item.label}
            </button>
          ))}
          {user && (
            <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 font-medium transition"
          >
            Logout
          </button>          
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex justify-between items-center md:hidden">
        <div className="flex items-center gap-4">
          <img
            src="https://howardfarmblob.blob.core.windows.net/websiteimages/logo.png"
            alt="Howard's Farm Logo"
            className="h-20 w-auto object-contain"
          />
          <div className="text-[#4a3a28] text-xl font-serif leading-tight">
            <div>Yankton</div>
            <div>Oregon</div>
          </div>
        </div>

        {!menuOpen && (
          <button
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-[#f5efe5] text-[#4a3a28] rounded-md shadow-md hover:bg-[#e8dcc6] transition"
          >
            <Menu size={20} />
          </button>
        )}
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white text-[#4a3a28] flex flex-col items-center pt-20 space-y-6">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-[#f5efe5] text-[#4a3a28] rounded-md shadow-md hover:bg-[#e8dcc6] transition"
          >
            <X size={20} />
          </button>

          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.page)}
              className={buttonClass}
            >
              {item.label}
            </button>
          ))}

          {user && (
            <button
              onClick={() => {
                setUser(null);
                setMenuOpen(false);
              }}
              className={logoutClass}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;














