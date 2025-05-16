import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GiftIcon } from "@/assets/icons/gift-icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getInitials } from "@/lib/utils";

const NavbarLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const [location] = useLocation();
  const isActive = location === href;
  
  return (
    <Link href={href}>
      <a className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
        {children}
      </a>
    </Link>
  );
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout', {});
      logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error logging out",
        description: "There was a problem logging you out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <a className="flex items-center gap-2">
              <GiftIcon className="text-primary h-6 w-6" />
              <span className="font-heading font-bold text-xl text-gray-900">GIFT AI</span>
            </a>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavbarLink href="/">Dashboard</NavbarLink>
          <NavbarLink href="/recipients">Recipients</NavbarLink>
          <NavbarLink href="/recommendations">Recommendations</NavbarLink>
        </nav>
        
        {/* User Menu */}
        {user ? (
          <div className="flex items-center gap-4">
            <Link href="/recipients/add">
              <Button size="default" className="hidden md:inline-flex">
                <i className="ri-user-add-line mr-2"></i>
                Add Recipient
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
                <Avatar className="h-8 w-8 border border-gray-200">
                  <AvatarFallback>{getInitials(`${user.firstName} ${user.lastName}`)}</AvatarFallback>
                </Avatar>
                <i className="ri-arrow-down-s-line text-gray-600"></i>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <a className="w-full cursor-pointer">
                      <i className="ri-user-line mr-2"></i>
                      Profile
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <a className="w-full cursor-pointer">
                      <i className="ri-settings-3-line mr-2"></i>
                      Settings
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <i className="ri-logout-box-line mr-2"></i>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Mobile Menu Button */}
            <button 
              className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className={`${mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl`}></i>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Sign up</Button>
            </Link>
          </div>
        )}
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3 space-y-2">
            <Link href="/">
              <a className="block py-2 text-sm font-medium text-gray-700 hover:text-primary">Dashboard</a>
            </Link>
            <Link href="/recipients">
              <a className="block py-2 text-sm font-medium text-gray-700 hover:text-primary">Recipients</a>
            </Link>
            <Link href="/recommendations">
              <a className="block py-2 text-sm font-medium text-gray-700 hover:text-primary">Recommendations</a>
            </Link>
            <Link href="/recipients/add">
              <a className="block py-2 text-sm font-medium text-primary">Add Recipient</a>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
