import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-indigo-600">
              <FileText className="h-8 w-8" />
              <span className="text-xl font-bold text-gray-900 tracking-tight">PDF Master</span>
            </Link>
            <p className="text-sm text-gray-500 leading-6 max-w-xs">
              Making PDF editing, conversion, and compression easy, fast, and secure for everyone.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Popular Tools</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li><Link to="/tools/compress-pdf" className="text-sm text-gray-500 hover:text-gray-900">Compress PDF</Link></li>
                  <li><Link to="/tools/merge-pdf" className="text-sm text-gray-500 hover:text-gray-900">Merge PDF</Link></li>
                  <li><Link to="/tools/pdf-to-word" className="text-sm text-gray-500 hover:text-gray-900">PDF to Word</Link></li>
                  <li><Link to="/tools/jpg-to-pdf" className="text-sm text-gray-500 hover:text-gray-900">JPG to PDF</Link></li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">About</Link></li>
                  <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">Blog</Link></li>
                  <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">Contact</Link></li>
                  <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">Partners</Link></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</Link></li>
                  <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</Link></li>
                  <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">Cookie Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} PDF Master, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
