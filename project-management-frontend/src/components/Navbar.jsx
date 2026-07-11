import { useSelector } from "react-redux";

function Navbar({ title }) {
  const user = useSelector((state) => state.auth.user);

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm">
      
      {/* Left Dynamic Page Title */}
      <h1 className="text-xl font-bold text-gray-800 tracking-tight">
        {title || "Dashboard"}
      </h1>
      
      {/* Right User Profile Dropdown / Badge Layout */}
      <div className="flex items-center gap-3 bg-gray-50/60 px-4 py-2 rounded-xl border border-gray-100/80">
        
        {/* Fixed Text Spacing Wrapper */}
        <div className="text-right flex flex-col justify-center min-w-[70px]">
          <p className="text-sm font-bold text-gray-800 leading-tight block">
            {user?.name || "Kiran"}
          </p>
          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 block">
            {user?.role || "Member"}
          </span>
        </div>

        {/* Square/Rounded Initials Avatar Layout */}
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#2E75B6] flex items-center justify-center font-black text-base select-none shadow-sm shrink-0">
          {(user?.name || "K").charAt(0).toUpperCase()}
        </div>

      </div>

    </header>
  );
}

export default Navbar;