export const runtime = "edge";
import { Inter } from 'next/font/google';
import './globals.css';
import SideNav from '@/components/side-nav';
import Search from '@/components/searchbar';
import toast, { Toaster } from 'react-hot-toast';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Gurukul',
    description: 'School Fee Management System',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="flex">
                    <div className="w-16 md:w-64">
                        <SideNav />
                    </div>
                    <div className="flex-1 m-2">
                        <Search />
                        {children}
                    </div>
                    <Toaster />
                </div>
            </body>
        </html>
    );
}