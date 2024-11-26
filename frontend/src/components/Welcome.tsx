import { Link } from 'react-router-dom';

export default function Welcome() {
  return (
    <div className="container mx-auto py-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform!</h1>
      <p className="text-lg mb-6">Explore our projects and find what interests you.</p>
      <Link to="/projects" className="text-blue-500 hover:underline text-xl">
        Browse Projects
      </Link>
    </div>
  );
}