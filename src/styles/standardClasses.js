// src/styles/standardClasses.js
// Coachingspace Design System - Standard Tailwind Classes

export const classes = {
  // ===== LAYOUT & CONTAINERS =====
  pageContainer: "min-h-screen bg-slate-900",
  contentWrapper: "p-6 lg:p-8",
  section: "space-y-6",
  
  // ===== TYPOGRAPHY =====
  // Headlines
  h1: "text-3xl font-bold text-white",
  h2: "text-2xl font-semibold text-white", 
  h3: "text-xl font-semibold text-white",
  h4: "text-lg font-medium text-white",
  
  // Body Text
  bodyText: "text-slate-300",
  bodyTextLarge: "text-lg text-slate-300",
  captionText: "text-sm text-slate-400",
  subtitleText: "text-xl text-slate-300",
  
  // Special Text
  welcomeText: "text-4xl font-bold text-white mb-4",
  sectionDescription: "text-slate-400 mb-6",

  // ===== BUTTONS =====
  // Primary Buttons
  btnPrimary: "px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2",
  btnPrimaryLarge: "px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2",
  btnPrimarySmall: "px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-colors inline-flex items-center gap-2",
  
  // Secondary Buttons
  btnSecondary: "px-4 py-2 border border-slate-600 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors inline-flex items-center gap-2",
  btnSecondarySmall: "px-3 py-1.5 border border-slate-600 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-md transition-colors inline-flex items-center gap-2",
  
  // Icon Buttons (für Tabellen-Aktionen)
  btnIcon: "p-2 rounded-lg transition-colors",
  btnIconBlue: "p-2 text-blue-400 hover:text-blue-300 hover:bg-slate-700 rounded-lg transition-colors",
  btnIconGreen: "p-2 text-green-400 hover:text-green-300 hover:bg-slate-700 rounded-lg transition-colors", 
  btnIconYellow: "p-2 text-yellow-400 hover:text-yellow-300 hover:bg-slate-700 rounded-lg transition-colors",
  btnIconRed: "p-2 text-red-400 hover:text-red-300 hover:bg-slate-700 rounded-lg transition-colors",
  btnIconGray: "p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-700 rounded-lg transition-colors",
  
  // Filter/Tab Buttons
  btnFilter: "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
  btnFilterActive: "px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium",
  btnFilterInactive: "px-3 py-1.5 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-md text-sm font-medium transition-colors",

  // ===== CARDS =====
  // Standard Cards
  card: "bg-slate-800 border border-slate-700 rounded-lg p-6",
  cardCompact: "bg-slate-800 border border-slate-700 rounded-lg p-4",
  cardHover: "bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors",
  
  // Dashboard Cards
  dashboardCard: "bg-slate-800 border border-slate-700 rounded-lg p-6",
  statsCard: "bg-slate-800 border border-slate-700 rounded-lg p-6 text-center",
  
  // Profile/Entity Cards
  profileCard: "bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors",
  
  // Quick Action Cards
  quickActionCard: "bg-slate-800 border border-slate-700 rounded-lg p-6 hover:bg-slate-700/50 transition-colors cursor-pointer",

  // ===== FORMS =====
  // Inputs
  input: "w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
  inputSmall: "w-full px-3 py-1.5 bg-slate-700/50 border border-slate-600 rounded-md text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
  
  // Textarea
  textarea: "w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
  
  // Search Inputs
  searchInput: "w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
  
  // Labels
  label: "block text-sm font-medium text-slate-300 mb-2",
  
  // Custom Select (wie in deinem Modal)
  select: "w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer",
  selectButton: "w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all flex items-center justify-between cursor-pointer",

  // ===== STATUS & BADGES =====
  // Success/Green
  badgeSuccess: "inline-flex items-center gap-1 px-2 py-1 bg-green-600/20 border border-green-600/30 text-green-300 rounded-full text-xs font-medium",
  statusSuccess: "inline-flex items-center gap-2 px-3 py-1 bg-green-600/20 border border-green-600/30 text-green-300 rounded-full text-sm font-medium",
  
  // Warning/Yellow  
  badgeWarning: "inline-flex items-center gap-1 px-2 py-1 bg-yellow-600/20 border border-yellow-600/30 text-yellow-300 rounded-full text-xs font-medium",
  statusWarning: "inline-flex items-center gap-2 px-3 py-1 bg-yellow-600/20 border border-yellow-600/30 text-yellow-300 rounded-full text-sm font-medium",
  
  // Error/Red
  badgeError: "inline-flex items-center gap-1 px-2 py-1 bg-red-600/20 border border-red-600/30 text-red-300 rounded-full text-xs font-medium",
  statusError: "inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-600/30 text-red-300 rounded-full text-sm font-medium",
  
  // Info/Blue
  badgeInfo: "inline-flex items-center gap-1 px-2 py-1 bg-blue-600/20 border border-blue-600/30 text-blue-300 rounded-full text-xs font-medium",
  statusInfo: "inline-flex items-center gap-2 px-3 py-1 bg-blue-600/20 border border-blue-600/30 text-blue-300 rounded-full text-sm font-medium",
  
  // Neutral/Gray
  badgeNeutral: "inline-flex items-center gap-1 px-2 py-1 bg-slate-600/20 border border-slate-600/30 text-slate-300 rounded-full text-xs font-medium",
  statusNeutral: "inline-flex items-center gap-2 px-3 py-1 bg-slate-600/20 border border-slate-600/30 text-slate-300 rounded-full text-sm font-medium",

  // ===== NAVIGATION =====
  // Sidebar
  sidebarItem: "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors mb-1",
  sidebarItemActive: "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors mb-1 bg-blue-600 text-white",
  sidebarItemInactive: "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors mb-1 text-slate-300 hover:bg-slate-700",
  
  // Tabs
  tabButton: "px-4 py-2 font-medium rounded-lg transition-colors",
  tabButtonActive: "px-4 py-2 bg-blue-600 text-white font-medium rounded-lg",
  tabButtonInactive: "px-4 py-2 text-slate-400 hover:text-slate-300 hover:bg-slate-800 font-medium rounded-lg transition-colors",

  // ===== TABLES & LISTS =====
  // Table Headers
  tableHeader: "px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider",
  
  // Table Cells
  tableCell: "px-6 py-4 whitespace-nowrap text-sm text-slate-300",
  tableCellBold: "px-6 py-4 whitespace-nowrap text-sm font-medium text-white",
  
  // List Items
  listItem: "flex items-center justify-between p-4 bg-slate-800 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors",
  
  // Action Groups (für Button-Gruppen in Tabellen)
  actionGroup: "flex items-center gap-1",

  // ===== MODALS & OVERLAYS =====
  // Modal Backdrop
  modalBackdrop: "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50",
  
  // Modal Content
  modalContent: "bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-md w-full",
  modalContentLarge: "bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-2xl w-full",
  
  // Modal Header
  modalHeader: "flex items-center justify-between mb-4",
  modalTitle: "text-xl font-semibold text-white",

  // ===== LAYOUT HELPERS =====
  // Flex
  flexBetween: "flex items-center justify-between",
  flexCenter: "flex items-center justify-center", 
  flexStart: "flex items-center",
  flexCol: "flex flex-col",
  
  // Spacing
  spaceY4: "space-y-4",
  spaceY6: "space-y-6", 
  spaceY8: "space-y-8",
  
  // Grid
  grid2: "grid grid-cols-1 md:grid-cols-2 gap-6",
  grid3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  grid4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",

  // ===== SPECIAL COMPONENTS =====
  // Dashboard Stats
  statsNumber: "text-2xl font-bold text-white",
  statsLabel: "text-slate-400 text-sm",
  
  // Avatar/Profile Images  
  avatar: "w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold",
  avatarSmall: "w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm",
  avatarLarge: "w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl",
  
  // Gradient Backgrounds (für spezielle Bereiche)
  gradientBg: "bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-xl p-8",
  
  // Drag & Drop Zones
  dropZone: "border-2 border-dashed border-slate-600/50 rounded-lg p-8 text-center hover:border-blue-500/50 transition-colors",
  
  // Loading States
  skeleton: "animate-pulse bg-slate-700 rounded",
  
  // Empty States
  emptyState: "text-center py-12",
  emptyStateIcon: "mx-auto h-12 w-12 text-slate-400 mb-4",
  emptyStateText: "text-slate-400",
  
  // Dividers
  divider: "border-t border-slate-700 my-6"
};

// Utility function to combine classes easily
export const cn = (...classes) => classes.filter(Boolean).join(' ');

// Color mappings for dynamic usage
export const statusColors = {
  success: 'green',
  warning: 'yellow', 
  error: 'red',
  info: 'blue',
  neutral: 'slate'
};

// Export default for easy importing
export default classes;