import React from 'react';
import { ShieldCheck, FileText, Package, BookOpen, Terminal, Mail } from 'lucide-react';
import { getPathForPage } from '../utils/routes.ts';
import { SITE } from '../src/config/site.ts';

const SystemFooter: React.FC = () => {
  const links = [
    { label: 'Product Catalogue', page: 'products' as const },
    { label: 'Neural Audit', page: 'forge_audit' as const },
    { label: 'fullKONK_>', page: 'fullkonk' as const },
    { label: 'REDAEYE', page: 'redaeye' as const },
    { label: 'Strategic Advisory', page: 'advisory' as const },
    { label: 'Intel & Academy', page: 'intel' as const },
    { label: 'Documentation', page: 'documentation' as const },
    { label: 'Contact', page: 'contact' as const },
  ];

  return (
    <footer className="border-t-4 border-black w-full bg-[#030712] text-[10px] font-mono text-void-500 py-12 mt-auto select-none relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 pb-10 border-b-2 border-void-300">

          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 border-2 border-black bg-signal text-black tracking-widest uppercase font-black text-[9px] rounded-none">
                KONKRED
              </span>
            </div>
            <p className="text-[9px] text-void-600 leading-relaxed uppercase">
              AI workflow marketplace and product platform. Data-driven product catalogue,
              neural audit, red-team diagnostics and product builds.
            </p>
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center gap-2 text-void-600">
                <ShieldCheck size={10} />
                <span className="uppercase text-[8px]">Model calls run server-side; keys never shipped to the browser.</span>
              </div>
            </div>
          </div>

          {/* Column 2: Platform Directory */}
          <div className="space-y-3 text-left">
            <h5 className="text-white font-bold tracking-widest text-[9px] uppercase pb-1 border-b border-void-300 inline-block">
              PLATFORM_DIRECTORY
            </h5>
            <div className="flex flex-col gap-2 pt-1 uppercase">
              {links.map(link => (
                <a
                  key={link.label}
                  href={getPathForPage(link.page)}
                  className="text-void-500 hover:text-signal transition-colors flex items-center gap-1.5"
                >
                  <span>// {link.label.toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Product families */}
          <div className="space-y-3">
            <h5 className="text-white font-bold tracking-widest text-[9px] uppercase pb-1 border-b border-void-300 inline-block">
              PRODUCT_FAMILIES
            </h5>
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between text-void-600 bg-void-100 p-1.5 rounded-none border border-void-300">
                <span className="flex items-center gap-1.5 font-bold text-[8px] uppercase">
                  <Package size={9} className="text-signal" /> Workflow Products
                </span>
                <span className="text-white font-bold">15</span>
              </div>
              <div className="flex items-center justify-between text-void-600 bg-void-100 p-1.5 rounded-none border border-void-300">
                <span className="flex items-center gap-1.5 font-bold text-[8px] uppercase">
                  <FileText size={9} className="text-signal" /> Statuses
                </span>
                <span className="text-white font-bold">4</span>
              </div>
              <div className="flex items-center justify-between text-void-600 bg-void-100 p-1.5 rounded-none border border-void-300">
                <span className="flex items-center gap-1.5 font-bold text-[8px] uppercase">
                  <BookOpen size={9} className="text-signal" /> Demos
                </span>
                <span className="text-signal font-black">FIXTURE-BACKED</span>
              </div>
            </div>
          </div>

          {/* Column 4: Honest status */}
          <div className="space-y-3">
            <h5 className="text-white font-bold tracking-widest text-[9px] uppercase pb-1 border-b border-void-300 inline-block">
              PRODUCT_STATUS
            </h5>
            <p className="text-[9px] text-void-600 leading-relaxed uppercase">
              Catalogue statuses are PUBLIC_DEMO, STANDARD_KIT, SUPERVISED_PILOT and
              ENTERPRISE_INTEGRATION. No product claims production maturity, certification
              or autonomous capability it does not have.
            </p>
          </div>

        </div>

        {/* Lower Sub-Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-center md:text-left">
          <div className="space-y-1">
            <div className="text-white uppercase font-bold text-[9px] tracking-wider">
              © 2026 KONKRED.XYZ
            </div>
            <p className="text-[8px] text-void-550 max-w-xl leading-normal uppercase">
              AI outputs are decision-support only and require human review where indicated.
              Public demos use synthetic sample data and are never production decisions.
            </p>
          </div>
          <a
            href="mailto:ari@konkred.xyz"
            className="flex items-center gap-3 bg-void-100 border-2 border-black py-1.5 px-3 rounded-none text-void-500 uppercase text-[8px] tracking-tight hover:text-void-400 transition-colors"
          >
            <Mail size={10} className="text-signal" />
            <span>{SITE.domain} // {SITE.footer.version}</span>
          </a>
        </div>

      </div>
    </footer>
  );
};

export default SystemFooter;
