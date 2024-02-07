import Link from 'next/link';
import { SVGProps } from 'react';

import { Container } from '@/app/i/landing-page/page';

const navigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'Privacy', href: '/i/privacy' },
    { name: 'Terms', href: '/i/terms' },
  ],
  social: [
    {
      name: 'X',
      href: 'https://twitter.com/tryglow',
      icon: (props: SVGProps<any>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
        </svg>
      ),
    },
  ],
};

export default function MarketingFooter() {
  return (
    <footer className="bg-white py-8">
      <Container>
        <div className=" border-t border-gray-900/10 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            {navigation.social.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
          <p className="mt-8 text-xs leading-5 text-gray-500 md:order-1 md:mt-0">
            &copy; 2024 Glow - Made in Italy and the UK
          </p>
        </div>
      </Container>
    </footer>
  );
}
