import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useHoverTracker } from './hooks/useHoverTracker';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CouponModal } from './components/CouponModal';
import { PriceMatchBanner } from './components/PriceMatchBanner';

import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { HotelDetailPage } from './pages/HotelDetailPage';
import { BookingPage } from './pages/BookingPage';
import { CouponsPage } from './pages/CouponsPage';
import { LoginPage } from './pages/LoginPage';

const AppContent: React.FC = () => {
  const { activeWidget, dismissWidget, acceptWidget } = useHoverTracker();

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff]">
      <Header />

      {/* Price Match Banner Intervention */}
      {activeWidget?.component === 'price_match_banner' && (
        <PriceMatchBanner data={activeWidget} onClose={dismissWidget} />
      )}

      {/* Main Pages Router */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/coupons" element={<CouponsPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>

      {/* Exit-Intent Coupon Modal Intervention */}
      {activeWidget?.component === 'coupon_modal' && (
        <CouponModal
          data={activeWidget}
          onClose={dismissWidget}
          onAccept={acceptWidget}
        />
      )}

      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
