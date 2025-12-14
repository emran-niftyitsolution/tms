import Link from "next/link";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiSend } from "react-icons/fi";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
                <span className="font-bold text-lg">T</span>
              </span>
              <div>
                <div className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">
                  TMS Tickets
                </div>
                <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Global Travel Solutions
                </div>
              </div>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
              Experience the future of travel booking. Fast, secure, and reliable ticketing for bus, train, air, and ship routes across the nation.
            </p>
            <div className="flex gap-4">
              {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, i) => (
                <a key={i} href="#" className="text-zinc-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
            <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-6">Explore</h3>
            <ul className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
              {['Bus Tickets', 'Train Tickets', 'Flight Booking', 'Ship/Launch', 'Hotel Booking', 'Holiday Packages'].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {item}
                </Link>
                </li>
              ))}
            </ul>
            </div>

          {/* Support */}
            <div>
             <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-6">Support</h3>
             <ul className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
              {['Help Center', 'Terms of Service', 'Privacy Policy', 'Refund Policy', 'Contact Us', 'Partner with Us'].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
            </div>

          {/* Newsletter */}
            <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-6">Stay Updated</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              Subscribe to get exclusive offers and travel updates directly to your inbox.
            </p>
            <form className="space-y-3">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-900 border-none px-4 py-3 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-500"
                />
                <button 
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 rounded-lg bg-indigo-600 px-3 text-white hover:bg-indigo-700 transition-colors"
                >
                  <FiSend className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-zinc-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} TMS Tickets. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
          </div>
        </div>
      </div>
    </footer>
  );
}
