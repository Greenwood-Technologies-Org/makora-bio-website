import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Makora Bio</h1>
        <Link to="/demo">
          <button className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors shadow-sm">
            View Demo
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
