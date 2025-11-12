import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/hooks/useAuth'
import { useSidebar } from '@/contexts/SidebarContext'
import { getStarCount } from '@/services/githubApi'
import {
  X,
  Search,
  User,
  LogOut,
  Settings,
  History,
  Github,
  Home,
  TrendingUp,
  Lightbulb,
  Star
} from 'lucide-react'
import { Button as MovingBorderButton } from '@/components/ui/moving-border'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [starCount, setStarCount] = useState<number | null>(null)
  const { user, logout } = useAuth()
  const { isOpen, toggleSidebar } = useSidebar()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        // Correct repo owner
        const count = await getStarCount('piyushdhoka', 'Repo-Scout')
        setStarCount(count)
      } catch (error) {
        console.error('Failed to fetch star count:', error)
        setStarCount(220) // Fallback
      }
    }

    fetchStarCount()
    // Refresh star count every 5 minutes
    const interval = setInterval(fetchStarCount, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`)
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setIsMobileMenuOpen(false)
  }

  const getUserInitials = (user: any) => {
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase()
    }
    return 'U'
  }

  const isActivePath = (path: string) => {
    return location.pathname === path
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-lg border-b border-gray-800'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Hamburger */}
          <div className="flex items-center gap-4">
            {/* Desktop Sidebar Toggle - Left side */}
            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="hidden md:flex text-gray-300 hover:text-white active:bg-gray-800 active:text-gray-300 transition-colors rounded-md"
                title={isOpen ? "Close sidebar" : "Open sidebar"}
              >
                <span className="relative inline-block h-5 w-5">
                  {/* Closed state icon (left-sidebar expand) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`absolute inset-0 h-5 w-5 transform transition-all duration-200 ${isOpen ? 'opacity-0 -translate-x-1' : 'opacity-100 translate-x-0'}`}
                    aria-hidden={isOpen}
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
                    <path d="M9 4v16" />
                    <path d="M14 10l2 2l-2 2" />
                  </svg>

                  {/* Open state icon (right-sidebar expand) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`absolute inset-0 h-5 w-5 transform transition-all duration-200 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-1'}`}
                    aria-hidden={!isOpen}
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
                    <path d="M15 4v16" />
                    <path d="M10 10l-2 2l2 2" />
                  </svg>
                </span>
              </Button>
            )}

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/repo_logo.png"
                alt="Repo Scout logo"
                className="h-8 w-8 rounded-full object-cover shadow-sm"
              />
              <span className="text-lg sm:text-xl font-bold text-white font-instrument">Repo Scout</span>
            </Link>
          </div>

          {/* Center - Desktop Navigation - Properly centered */}
          <nav className="hidden md:flex-1 items-center justify-center font-instrument">
            {user && (
              <Link
                to="/home"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Search
              </Link>
            )}
          </nav>

          {/* Right side - GitHub Star button and auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* GitHub Star Button */}
            {user && (
              <MovingBorderButton
                borderRadius="0.75rem"
                containerClassName="inline-flex h-10 w-auto px-1"
                className="!bg-gray-900 text-gray-300 hover:!bg-gray-800 px-3 py-1 text-sm"
                borderClassName="bg-[radial-gradient(#0ea5e9_40%,transparent_60%)]"
                onClick={() => window.open('https://github.com/piyushdhoka/Repo-Scout', '_blank')}
                title="View on GitHub"
              >
                <span className="font-semibold">Proudly Open Source</span>
                <span className="ml-2 flex items-center gap-1 bg-gray-800/50 px-2 py-0.5 rounded">
                  <Star className="h-4 w-4 text-yellow-300" />
                  <span className="font-mono text-xs">
                    {starCount !== null ? starCount.toLocaleString() : '—'}
                  </span>
                </span>
              </MovingBorderButton>
            )}

            {/* Sponsor Dropdown */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-gray-300 hover:text-white px-2 py-1"
                    title="Sponsor"
                  >
                    <svg className="h-4 w-4 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"></path></svg>
                    <span className="text-sm font-medium">Sponsor</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 bg-gray-800 border border-gray-700 rounded-lg">
                  <div className="p-4">
                    {/* Buy Me Coffee Section */}
                    <a href="https://buymeacoffee.com/piyushdhoka" target="_blank" rel="noreferrer noopener" className="block mb-4">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-white">Buy me Coffee</div>
                        {/* Inline BuyMe SVG (very small) */}
                        <svg width="884" height="1279" viewBox="0 0 884 1279" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-6" aria-hidden>
                          <path d="M791.109 297.518L790.231 297.002L788.201 296.383C789.018 297.072 790.04 297.472 791.109 297.518V297.518Z" fill="#0D0C22"/>
                          <path d="M803.896 388.891L802.916 389.166L803.896 388.891Z" fill="#0D0C22"/>
                          <path d="M791.484 297.377C791.359 297.361 791.237 297.332 791.118 297.29C791.111 297.371 791.111 297.453 791.118 297.534C791.252 297.516 791.379 297.462 791.484 297.377V297.377Z" fill="#0D0C22"/>
                          <path d="M791.113 297.529H791.244V297.447L791.113 297.529Z" fill="#0D0C22"/>
                          <path d="M803.111 388.726L804.591 387.883L805.142 387.573L805.641 387.04C804.702 387.444 803.846 388.016 803.111 388.726V388.726Z" fill="#0D0C22"/>
                          <path d="M793.669 299.515L792.223 298.138L791.243 297.605C791.77 298.535 792.641 299.221 793.669 299.515V299.515Z" fill="#0D0C22"/>
                          <path d="M430.019 1186.18C428.864 1186.68 427.852 1187.46 427.076 1188.45L427.988 1187.87C428.608 1187.3 429.485 1186.63 430.019 1186.18Z" fill="#0D0C22"/>
                          <path d="M641.187 1144.63C641.187 1143.33 640.551 1143.57 640.705 1148.21C640.705 1147.84 640.86 1147.46 640.929 1147.1C641.015 1146.27 641.084 1145.46 641.187 1144.63Z" fill="#0D0C22"/>
                          <path d="M619.284 1186.18C618.129 1186.68 617.118 1187.46 616.342 1188.45L617.254 1187.87C617.873 1187.3 618.751 1186.63 619.284 1186.18Z" fill="#0D0C22"/>
                          <path d="M281.304 1196.06C280.427 1195.3 279.354 1194.8 278.207 1194.61C279.136 1195.06 280.065 1195.51 280.684 1195.85L281.304 1196.06Z" fill="#0D0C22"/>
                          <path d="M247.841 1164.01C247.704 1162.66 247.288 1161.35 246.619 1160.16C247.093 1161.39 247.489 1162.66 247.806 1163.94L247.841 1164.01Z" fill="#0D0C22"/>
                          <path d="M472.623 590.836C426.682 610.503 374.546 632.802 306.976 632.802C278.71 632.746 250.58 628.868 223.353 621.274L270.086 1101.08C271.74 1121.13 280.876 1139.83 295.679 1153.46C310.482 1167.09 329.87 1174.65 349.992 1174.65C349.992 1174.65 416.254 1178.09 438.365 1178.09C462.161 1178.09 533.516 1174.65 533.516 1174.65C553.636 1174.65 573.019 1167.08 587.819 1153.45C602.619 1139.82 611.752 1121.13 613.406 1101.08L663.459 570.876C641.091 563.237 618.516 558.161 593.068 558.161C549.054 558.144 513.591 573.303 472.623 590.836Z" fill="#FFDD00"/>
                          <path d="M78.6885 386.132L79.4799 386.872L79.9962 387.182C79.5987 386.787 79.1603 386.435 78.6885 386.132V386.132Z" fill="#0D0C22"/>
                          <path d="M879.567 341.849L872.53 306.352C866.215 274.503 851.882 244.409 819.19 232.898C808.711 229.215 796.821 227.633 788.786 220.01C780.751 212.388 778.376 200.55 776.518 189.572C773.076 169.423 769.842 149.257 766.314 129.143C763.269 111.85 760.86 92.4243 752.928 76.56C742.604 55.2584 721.182 42.8009 699.88 34.559C688.965 30.4844 677.826 27.0375 666.517 24.2352C613.297 10.1947 557.342 5.03277 502.591 2.09047C436.875 -1.53577 370.983 -0.443234 305.422 5.35968C256.625 9.79894 205.229 15.1674 158.858 32.0469C141.91 38.224 124.445 45.6399 111.558 58.7341C95.7448 74.8221 90.5829 99.7026 102.128 119.765C110.336 134.012 124.239 144.078 138.985 150.737C158.192 159.317 178.251 165.846 198.829 170.215C256.126 182.879 315.471 187.851 374.007 189.968C438.887 192.586 503.87 190.464 568.44 183.618C584.408 181.863 600.347 179.758 616.257 177.304C634.995 174.43 647.022 149.928 641.499 132.859C634.891 112.453 617.134 104.538 597.055 107.618C594.095 108.082 591.153 108.512 588.193 108.942L586.06 109.252C579.257 110.113 572.455 110.915 565.653 111.661C551.601 113.175 537.515 114.414 523.394 115.378C491.768 117.58 460.057 118.595 428.363 118.647C397.219 118.647 366.058 117.769 334.983 115.722C320.805 114.793 306.661 113.611 292.552 112.177C286.134 111.506 279.733 110.801 273.333 110.009L267.241 109.235L265.917 109.046L259.602 108.134C246.697 106.189 233.792 103.953 221.025 101.251C219.737 100.965 218.584 100.249 217.758 99.2193C216.932 98.1901 216.482 96.9099 216.482 95.5903C216.482 94.2706 216.932 92.9903 217.758 91.9612C218.584 90.9319 219.737 90.2152 221.025 89.9293H221.266C232.33 87.5721 243.479 85.5589 254.663 83.8038C258.392 83.2188 262.131 82.6453 265.882 82.0832H265.985C272.988 81.6186 280.026 80.3625 286.994 79.5366C347.624 73.2302 408.614 71.0801 469.538 73.1014C499.115 73.9618 528.676 75.6996 558.116 78.6935C564.448 79.3474 570.746 80.0357 577.043 80.8099C579.452 81.1025 581.878 81.4465 584.305 81.7391L589.191 82.4445C603.438 84.5667 617.61 87.1419 631.708 90.1703C652.597 94.7128 679.422 96.1925 688.713 119.077C691.673 126.338 693.015 134.408 694.649 142.03L696.731 151.752C696.786 151.926 696.826 152.105 696.852 152.285C701.773 175.227 706.7 198.169 711.632 221.111C711.994 222.806 712.002 224.557 711.657 226.255C711.312 227.954 710.621 229.562 709.626 230.982C708.632 232.401 707.355 233.6 705.877 234.504C704.398 235.408 702.75 235.997 701.033 236.236H700.895L697.884 236.649L694.908 237.044C685.478 238.272 676.038 239.419 666.586 240.486C647.968 242.608 629.322 244.443 610.648 245.992C573.539 249.077 536.356 251.102 499.098 252.066C480.114 252.57 461.135 252.806 442.162 252.771C366.643 252.712 291.189 248.322 216.173 239.625C208.051 238.662 199.93 237.629 191.808 236.58C198.106 237.389 187.231 235.96 185.029 235.651C179.867 234.928 174.705 234.177 169.543 233.397C152.216 230.798 134.993 227.598 117.7 224.793C96.7944 221.352 76.8005 223.073 57.8906 233.397C42.3685 241.891 29.8055 254.916 21.8776 270.735C13.7217 287.597 11.2956 305.956 7.64786 324.075C4.00009 342.193 -1.67805 361.688 0.472751 380.288C5.10128 420.431 33.165 453.054 73.5313 460.35C111.506 467.232 149.687 472.807 187.971 477.556C338.361 495.975 490.294 498.178 641.155 484.129C653.44 482.982 665.708 481.732 677.959 480.378C681.786 479.958 685.658 480.398 689.292 481.668C692.926 482.938 696.23 485.005 698.962 487.717C701.694 490.429 703.784 493.718 705.08 497.342C706.377 500.967 706.846 504.836 706.453 508.665L702.633 545.797C694.936 620.828 687.239 695.854 679.542 770.874C671.513 849.657 663.431 928.434 655.298 1007.2C653.004 1029.39 650.71 1051.57 648.416 1073.74C646.213 1095.58 645.904 1118.1 641.757 1139.68C635.218 1173.61 612.248 1194.45 578.73 1202.07C548.022 1209.06 516.652 1212.73 485.161 1213.01C450.249 1213.2 415.355 1211.65 380.443 1211.84C343.173 1212.05 297.525 1208.61 268.756 1180.87C243.479 1156.51 239.986 1118.36 236.545 1085.37C231.957 1041.7 227.409 998.039 222.9 954.381L197.607 711.615L181.244 554.538C180.968 551.94 180.693 549.376 180.435 546.76C178.473 528.023 165.207 509.681 144.301 510.627C126.407 511.418 106.069 526.629 108.168 546.76L120.298 663.214L145.385 904.104C152.532 972.528 159.661 1040.96 166.773 1109.41C168.15 1122.52 169.44 1135.67 170.885 1148.78C178.749 1220.43 233.465 1259.04 301.224 1269.91C340.799 1276.28 381.337 1277.59 421.497 1278.24C472.979 1279.07 524.977 1281.05 575.615 1271.72C650.653 1257.95 706.952 1207.85 714.987 1130.13C717.282 1107.69 719.576 1085.25 721.87 1062.8C729.498 988.559 737.115 914.313 744.72 840.061L769.601 597.451L781.009 486.263C781.577 480.749 783.905 475.565 787.649 471.478C791.392 467.391 796.352 464.617 801.794 463.567C823.25 459.386 843.761 452.245 859.023 435.916C883.318 409.918 888.153 376.021 879.567 341.849ZM72.4301 365.835C72.757 365.68 72.1548 368.484 71.8967 369.792C71.8451 367.813 71.9483 366.058 72.4301 365.835ZM74.5121 381.94C74.6842 381.819 75.2003 382.508 75.7337 383.334C74.925 382.576 74.4089 382.009 74.4949 381.94H74.5121ZM76.5597 384.641C77.2996 385.897 77.6953 386.689 76.5597 384.641V384.641ZM80.672 387.979H80.7752C80.7752 388.1 80.9645 388.22 81.0333 388.341C80.9192 388.208 80.7925 388.087 80.6548 387.979H80.672ZM800.796 382.989C793.088 390.319 781.473 393.726 769.996 395.43C641.292 414.529 510.713 424.199 380.597 419.932C287.476 416.749 195.336 406.407 103.144 393.382C94.1102 392.109 84.3197 390.457 78.1082 383.798C66.4078 371.237 72.1548 345.944 75.2003 330.768C77.9878 316.865 83.3218 298.334 99.8572 296.355C125.667 293.327 155.64 304.218 181.175 308.09C211.917 312.781 242.774 316.538 273.745 319.36C405.925 331.405 540.325 329.529 671.92 311.91C695.905 308.686 719.805 304.941 743.619 300.674C764.835 296.871 788.356 289.731 801.175 311.703C809.967 326.673 811.137 346.701 809.778 363.615C809.359 370.984 806.139 377.915 800.779 382.989H800.796Z" fill="#0D0C22"/>
                        </svg>
                      </div>
                    </a>

                    {/* UPI Payment Section */}
                    <div className="sponsor-section">
                      <DropdownMenuLabel className="text-sm text-gray-200 mb-3">UPI Payment</DropdownMenuLabel>
                      <div className="flex flex-col items-center w-full">
                        <div className="bg-white rounded-lg p-4 shadow-md">
                          <img src="/image.png" alt="UPI QR Code" className="w-44 h-44 object-contain rounded-sm" />
                        </div>
                        <p className="mt-3 text-xs text-gray-300 text-center">Scan QR or open UPI app to pay</p>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {!user && (
              <Button
                onClick={() => navigate('/auth')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm auth-button"
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-white active:bg-gray-800 active:text-gray-400 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
                  <path d="M9 4v16" />
                  <path d="M14 10l2 2l-2 2" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-black border-gray-800">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <img
                      src="/repo_logo.png"
                      alt="Repo Scout logo"
                      className="h-8 w-8 rounded-full object-cover shadow-sm"
                    />
                    <span className="text-xl font-bold text-white font-instrument">Repo Scout</span>
                  </div>
                </div>

                <nav className="flex-1 space-y-4">
                  {user && (
                    <>
                      <Link
                        to="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg transition-colors"
                      >
                        <Home className="h-5 w-5" />
                        Home
                      </Link>
                      <Link
                        to="/home"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg transition-colors"
                      >
                        <Search className="h-5 w-5" />
                        Search
                      </Link>
                      <Link
                        to="/home"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg transition-colors"
                      >
                        <TrendingUp className="h-5 w-5" />
                        Trending
                      </Link>
                      <Link
                        to="/suggest"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg transition-colors"
                      >
                        <Lightbulb className="h-5 w-5" />
                        Suggest Feature
                      </Link>
                    </>
                  )}
                </nav>

                <div className="border-t border-gray-800 pt-4 space-y-4">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 px-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {getUserInitials(user)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {user.displayName || 'User'}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            navigate('/home')
                            setIsMobileMenuOpen(false)
                          }}
                          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-900"
                        >
                          <Search className="mr-2 h-4 w-4" />
                          Search Repositories
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            window.open('https://github.com/piyushdhoka/Repo-Scout', '_blank')
                            setIsMobileMenuOpen(false)
                          }}
                          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-900"
                        >
                          <Star className="mr-2 h-4 w-4 text-yellow-300" />
                          <span>
                            {starCount !== null ? `Proudly Open Source • ★${starCount.toLocaleString()}` : 'Star on GitHub'}
                          </span>
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-900"
                        >
                          <History className="mr-2 h-4 w-4" />
                          My Contributions
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-900"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={handleLogout}
                          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-900"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button
                      onClick={() => {
                        navigate('/auth')
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Get Started
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}