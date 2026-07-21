import type { PropsWithChildren } from 'react';

import { Header } from './Header';
import { Footer } from './footer';

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div
      id="wrapper"
      className="relative min-h-screen bg-slate-50 text-slate-900"
    >
      <Header />
      <main className="mx-auto max-w-[75rem] px-2 pt-[65px] pb-24">
        {children}
      </main>
      <Footer />
    </div>
  );
};
