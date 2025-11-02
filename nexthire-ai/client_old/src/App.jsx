const Navbar = ({ auth, onLogout }) => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white">CareerPilot</h1>
      
      <nav className="space-x-6 text-gray-700 dark:text-gray-200 font-medium">
        <Link to="/">Dashboard</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/resume">Resume</Link>
        
        {auth ? (
          <button onClick={onLogout} className="text-red-500 hover:underline ml-4">Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
};
