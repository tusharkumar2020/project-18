import Image from "next/image";
import Link from "next/link";
// app/page.js
export default function Home() {
    return (
        <div className="container-fluid mx-auto p-2 text-center">
            <section className="relative text-white h-[85vh] " id="hero">
                <div
                    className="container-fluid mx-auto text-center h-full !bg-cover !bg-no-repeat rounded-xl flex-col content-center items-center"
                    style={{background: "url('/assets/images/hero.jpg')"}}>
                    <div className='relative z-40'>
                        <h2 className="xl:text-8xl md:text-5xl text-2xl tracking-wide font-bold mb-6">Find your dream car</h2>
                        <p className="mb-8 xl:text-xl text-sm">Used cars · Any makes · Any models · All pricing</p>
                        <div className="flex justify-center space-x-4 mb-10">
                            <Link href={'/dealers'} className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 text-black rounded w-1/2">
                                View Dealerships
                            </Link>
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-50 z-10 rounded-xl"></div>
                </div>
            </section>
        </div>
    );
}
