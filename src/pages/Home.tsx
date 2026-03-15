import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { toolsData, categories } from '../utils/toolsData';
import { Search, Shield, Zap, FileCheck } from 'lucide-react';
import { useState } from 'react';

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = toolsData.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-20">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Every tool you need to</span>{' '}
                  <span className="block text-indigo-600 xl:inline">work with PDFs</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
                </p>
                
                <div className="mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="relative rounded-md shadow-sm w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-4 bg-gray-50 border"
                      placeholder="Search for a tool... (e.g., compress)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-indigo-50 flex items-center justify-center p-12">
          <div className="grid grid-cols-2 gap-4 w-full max-w-md opacity-80">
            {toolsData.slice(0, 4).map((tool, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center transform transition-transform hover:scale-105">
                <tool.icon className="w-12 h-12 text-indigo-500 mb-4" />
                <span className="font-semibold text-gray-800">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tools Grid Section */}
      <div id="tools" className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Explore Our PDF Tools
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Everything you need to manage your PDF files in one place.
            </p>
          </div>

          {categories.map(category => {
            const categoryTools = filteredTools.filter(t => t.category === category);
            if (categoryTools.length === 0) return null;

            return (
              <div key={category} className="mb-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">{category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryTools.map(tool => (
                    <Link 
                      key={tool.id} 
                      to={tool.path}
                      className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col items-start"
                    >
                      <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors mb-4">
                        <tool.icon className="w-8 h-8 text-indigo-600" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{tool.name}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2">{tool.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-green-50 rounded-full mb-6">
                <Shield className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Processing</h3>
              <p className="text-gray-500">All files are transferred over secure HTTPS and automatically deleted from our servers after 1 hour.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-yellow-50 rounded-full mb-6">
                <Zap className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-500">Our cloud infrastructure processes your files in seconds, saving you valuable time.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-blue-50 rounded-full mb-6">
                <FileCheck className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">High Quality</h3>
              <p className="text-gray-500">We use industry-leading algorithms to ensure your documents maintain their original quality.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
