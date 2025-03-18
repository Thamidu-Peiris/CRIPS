
// CRIPS\frontend\src\components\Layout.js
import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="font-sans">
      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;