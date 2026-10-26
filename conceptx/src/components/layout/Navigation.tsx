'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Menu, 
  X, 
  Sun, 
  Moon,
  Home,
  GraduationCap,
  FlaskConical,
  Atom,
  Calculator,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Search },
  { href: '/explore?subject=physics', label: 'Physics', icon: Atom },
  { href: '/explore?subject=chemistry', label: 'Chemistry', icon: FlaskConical },
  { href: '/explore?subject=mathematics', label: 'Mathematics', icon: Calculator },
  { href: '/admin', label: 'Admin', icon: GraduationCap },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('conceptx-theme');
    if (saved === 'dark') {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('conceptx-theme', next ? 'dark' : 'light');
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
        scrolled
          ? 'bg-[var(--background-card)]/95 backdrop-blur-md border-b border-[var(--border)] shadow-sm'
          : 'bg-transparent'
      )}
      style={{ height: 'var(--header-height)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)] flex items-center justify-center">
            <BookOpen className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--brand-primary)] transition-colors">
            Concept<span className="text-[var(--brand-primary)]">X</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = link.href === '/' 
              ? pathname === '/' 
              : pathname.startsWith(link.href.split('?')[0]) && link.href !== '/';
            const Icon = link.icon;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-1.5',
                  isActive
                    ? 'text-[var(--brand-primary)] bg-[var(--brand-primary)]/8'
                    : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)]'
                )}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          <Link
            href="/explore"
            className="hidden sm:flex btn btn-primary text-sm"
          >
            <GraduationCap className="w-4 h-4" />
            Explore Questions
          </Link>

          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)]"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-[var(--background-card)] border-l border-[var(--border)] z-50 md:hidden shadow-xl"
            >
              <div className="p-4 flex justify-between items-center border-b border-[var(--border)]">
                <span className="font-semibold text-[var(--foreground)]">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-3 flex flex-col gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 rounded-lg text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors flex items-center gap-3"
                    >
                      <Icon className="w-4.5 h-4.5" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background-secondary)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-[var(--brand-primary)] flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-[var(--foreground)]">
                Concept<span className="text-[var(--brand-primary)]">X</span>
              </span>
            </div>
            <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
              Understand the concept. Visualize the solution.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">Subjects</h4>
            <div className="flex flex-col gap-2">
              <Link href="/explore?subject=physics" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">Physics</Link>
              <Link href="/explore?subject=chemistry" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">Chemistry</Link>
              <Link href="/explore?subject=mathematics" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">Mathematics</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">Explore</h4>
            <div className="flex flex-col gap-2">
              <Link href="/explore" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">Question Bank</Link>
              <Link href="/explore?year=2026" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">JEE Advanced 2026</Link>
              <Link href="/admin" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">Admin Dashboard</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">About</h4>
            <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
              ConceptX is an educational tool. Question content is sourced from publicly available examination papers with appropriate attribution.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--border)] text-center text-xs text-[var(--foreground-muted)]">
          ConceptX — Interactive Learning for JEE Advanced · Built with care for conceptual clarity
        </div>
      </div>
    </footer>
  );
}
