import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div style={{ display: "flex" }}>
      <nav style={{ width: "200px", borderRight: "1px solid #ccc" }}>
        <h2>FinanceTracker</h2>
        <ul>
          <li>
            <Link to="/">Головна</Link>
          </li>
          <li>
            <Link to="/transactions">Транзакції</Link>
          </li>
        </ul>
      </nav>

      <main style={{ flexGrow: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
