import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Properties from "./Properties";

import PropertyDetail from "./PropertyDetail";

import Tenants from "./Tenants";

import TenantDetail from "./TenantDetail";

import Contracts from "./Contracts";

import Finances from "./Finances";

import Settings from "./Settings";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Properties: Properties,
    
    PropertyDetail: PropertyDetail,
    
    Tenants: Tenants,
    
    TenantDetail: TenantDetail,
    
    Contracts: Contracts,
    
    Finances: Finances,
    
    Settings: Settings,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Properties" element={<Properties />} />
                
                <Route path="/PropertyDetail" element={<PropertyDetail />} />
                
                <Route path="/Tenants" element={<Tenants />} />
                
                <Route path="/TenantDetail" element={<TenantDetail />} />
                
                <Route path="/Contracts" element={<Contracts />} />
                
                <Route path="/Finances" element={<Finances />} />
                
                <Route path="/Settings" element={<Settings />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}