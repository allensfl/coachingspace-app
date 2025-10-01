import React, { useState, Suspense } from 'react';
import { NavLink, Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Calendar, FileText, Folder, Settings, Bot, BookOpen, PenSquare, Wrench, Store, Menu, X, Command, Loader2, LifeBuoy, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStateContext } from '@/context/AppStateContext';
import Footer from './Footer';

// Akzentfarbe je Navitem (bei Aktivität)
const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', color: 'text-sky-500' },
    { icon: Users, label: 'Coachees', path: '/coachees', color: 'text-emerald-500' },
    { icon: Calendar, label: 'Sessions', path: '/sessions', color: 'text-violet-500' },
    { icon: PenSquare, label: 'Sitzungsnotizen', path: '/session-notes', color: 'text-orange-500' },
    { icon: BookOpen, label: 'Reflexionstagebuch', path: '/journal', color: 'text-indigo-500' },
    { icon: Folder, label: 'Dokumente', path: '/documents', color: 'text-blue-500' },
    { icon: FileText, label: 'Rechnungen', path: '/invoices', color: 'text-rose-500' },
    { icon: Bot, label: 'KI-Assistent', path: '/ai-coaching', color: 'text-fuchsia-500', requiresFeature: 'aiModule' },
    { icon: Wrench, label: 'Toolbox', path: '/toolbox', color: 'text-pink-500' },
    //{ icon: Store, label: 'Store', path: '/store', color: 'text-yellow-500' },
];

const bottomNavItems = [
    { icon: Settings, label: 'Einstellungen', path: '/settings', color: 'text-gray-500' },
    { icon: LifeBuoy, label: 'Hilfe & Doku', path: '/documentation', color: 'text-lime-500' },
];

const NavItem = ({ item, collapsed, onClick }) => {
    const location = useLocation();
    const { hasFeature, showPremiumFeature } = useAppStateContext();
    const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/');
    
    // Wenn ein Feature erforderlich ist, aber nicht verfügbar
    if (item.requiresFeature && !hasFeature(item.requiresFeature)) {
        return (
            <button
                onClick={() => {
                    showPremiumFeature('KI-Assistent');
                    if (onClick) onClick();
                }}
                className={`flex items-center p-3 rounded-xl transition-all duration-300 glass-nav-item ${
                    collapsed ? 'justify-center' : 'justify-start'
                } opacity-60 cursor-pointer hover:opacity-80`}
                title={`${item.label} (In Entwicklung)`}
            >
                <item.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} text-muted-foreground`} />
                {!collapsed && (
                    <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-medium">{item.label}</span>
                       <span className="text-xs px-2 py-1 bg-orange-500/30 text-orange-300 rounded font-medium">
    In Entwicklung
</span>
                    </div>
                )}
            </button>
        );
    }
    
    return (
        <NavLink
            to={item.path}
            end={item.path === '/'}
            onClick={onClick}
            className={({ isActive }) => 
                `flex items-center p-3 rounded-xl transition-all duration-300 glass-nav-item ${
                    collapsed ? 'justify-center' : 'justify-start'
                } ${isActive ? 'active' : ''}`
            }
            title={item.label}
        >
            <item.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
        </NavLink>
    );
};

const Sidebar = ({ collapsed, setCollapsed, isMobile, setMobileSidebarOpen }) => {
    const { state: { settings }, actions: { setCommandOpen } } = useAppStateContext();
    const logoUrl = settings?.company?.logoUrl;
    const companyName = settings?.company?.name || 'Coachingspace';

    return (
        <aside className={`glass-sidebar flex flex-col transition-all duration-500 ${collapsed ? 'w-20' : 'w-64'}`}>
            <div className={`flex items-center p-4 h-16 border-b border-border ${collapsed ? 'justify-center' : 'justify-between'}`}>
                {!collapsed && (
                    <Link to="/" className="flex items-center gap-2">
                         {logoUrl ? (
                            <img src={logoUrl} alt={`${companyName} Logo`} className="h-8 w-auto" />
                        ) : (
                            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">C</div>
                        )}
                        <span className="font-bold text-lg text-foreground">{companyName}</span>
                    </Link>
                )}
                {isMobile && (
                     <Button variant="ghost" size="icon" onClick={() => setMobileSidebarOpen(false)}>
                        <X className="h-6 w-6 text-muted-foreground" />
                    </Button>
                )}
            </div>
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                {navItems.map((item) => <NavItem key={item.path} item={item} collapsed={collapsed} onClick={() => isMobile && setMobileSidebarOpen(false)} />)}
            </nav>
            <div className="my-3 border-t border-border" />
            <div className="p-2">
                <button
                    onClick={() => setCommandOpen(true)}
                    className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 glass-nav-item ${collapsed ? 'justify-center' : 'justify-start'}`}
                >
                    <Command className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && <span className="text-sm font-medium">Suche...</span>}
                </button>
                {bottomNavItems.map((item) => <NavItem key={item.path} item={item} collapsed={collapsed} onClick={() => isMobile && setMobileSidebarOpen(false)} />)}
            </div>
        </aside>
    );
};

const Header = ({ setMobileSidebarOpen }) => {
    const location = useLocation();
    const navItem = [...navItems, ...bottomNavItems].find(item => item.path === location.pathname);
    const title = navItem ? navItem.label : 'Dashboard';

    return (
        <header className="flex items-center justify-between h-16 glass-header px-4 md:px-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileSidebarOpen(true)}>
                    <Menu className="h-6 w-6 text-muted-foreground" />
                </Button>
                <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
            </div>
        </header>
    );
};

const FloatingFeedbackButton = () => {
    return (
        <a 
            href="https://app-coachingspace.netlify.app/beta-feedback" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="fixed right-6 bottom-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40 group" 
            title="Feedback geben"
        >
            <MessageSquare className="w-6 h-6" />
            <span className="absolute right-full mr-3 bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 text-slate-100 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Feedback geben
            </span>
        </a>
    );
};

const Layout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="flex h-screen bg-background text-foreground">
            <AnimatePresence>
                {mobileSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/10 z-40 md:hidden"
                            onClick={() => setMobileSidebarOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 h-full z-50"
                        >
                            <Sidebar collapsed={false} setCollapsed={() => {}} isMobile={true} setMobileSidebarOpen={setMobileSidebarOpen} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            <div className="hidden md:flex">
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header setMobileSidebarOpen={setMobileSidebarOpen} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
                    <Suspense fallback={
                        <div className="flex h-full w-full items-center justify-center">
                            <Loader2 className="h-10 w-10 animate-spin" />
                        </div>
                    }>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </Suspense>
                </main>
                <Footer />
            </div>
            
            {/* Floating Feedback Button */}
            <FloatingFeedbackButton />
        </div>
    );
};

export default Layout;