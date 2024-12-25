import "./globals.css";
import Header from './components/Header';
import Footer from './components/Footer';
import {Orbitron} from 'next/font/google';
import {Toaster} from "react-hot-toast";
import {AuthProvider} from './context/AuthContext';

const orbitron = Orbitron({
    subsets: ['latin'],
    weight: ['400', '700'], // You can add additional weights if needed
});

export const metadata = {
    title: "Beast cars App",
    description: "Best Auto dealer in the world!",
};

export default function RootLayout({children}) {

    return (
        <html lang="en" className={orbitron.className}>
        <AuthProvider>
            <body className="bg-stone-900 min-h-screen flex flex-col content-center">
            <Header/>
            <main className="flex-grow">
                {children}
            </main>
            <Footer/>
            <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    // Define default options
                    className: 'font-[arial]',
                    duration: 5000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },

                    // Default options for specific types
                    success: {
                        duration: 3000,
                        theme: {
                            primary: 'green',
                            secondary: 'black',
                        },
                    },
                }}
            />
            </body>
        </AuthProvider>
        </html>
    );
}
