import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Programs from "./pages/Programs.jsx";
import Hub from "./pages/Hub.jsx";
import LMS from "./pages/LMS.jsx";
import Connect from "./pages/Connect.jsx";
import Compliance from "./pages/Compliance.jsx";
import Pay from "./pages/Pay.jsx";
import Donate from "./pages/Donate.jsx";
import Account from "./pages/Account.jsx";
import Partners from "./pages/Partners.jsx";
import GoogleAnalyticsSetup from "./pages/GoogleAnalyticsSetup.jsx";
import GoogleSiteVerification from "./pages/GoogleSiteVerification.jsx";
import BingSiteVerification from "./pages/BingSiteVerification.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/hub" element={<Hub />} />
        <Route path="/lms" element={<LMS />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/account" element={<Account />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/google-analytics-setup" element={<GoogleAnalyticsSetup />} />
        <Route path="/google-site-verification" element={<GoogleSiteVerification />} />
        <Route path="/bing-site-verification" element={<BingSiteVerification />} />
      </Routes>
    </BrowserRouter>
  );
}