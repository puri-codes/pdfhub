import { ReactNode } from 'react';
import { Layout } from './Layout';
import { ToolMetadata } from '../utils/toolsData';

interface ToolLayoutProps {
  tool: ToolMetadata;
  children: ReactNode;
}

export function ToolLayout({ tool, children }: ToolLayoutProps) {
  return (
    <Layout>
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-6">
            <tool.icon className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl mb-6">
            {tool.seoHeadline}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            {tool.description}
          </p>
        </div>
      </div>
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 -mt-16 relative z-10">
        {children}
      </div>

      <div className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Why use {tool.name}?</h3>
              <ul className="space-y-4">
                {tool.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">How to use</h3>
              <ol className="space-y-4">
                {tool.howTo.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <span className="text-gray-600 mt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
              <div className="space-y-6">
                {tool.faqs.map((faq, idx) => (
                  <div key={idx}>
                    <h4 className="text-base font-semibold text-gray-900 mb-2">{faq.q}</h4>
                    <p className="text-gray-500 text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
