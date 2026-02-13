import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center selection:bg-[#8406f9] selection:text-white">
            <div className="w-[500px] h-[500px] bg-[#8406f9] rounded-full blur-[150px] opacity-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 mb-4 font-mono">
                404
            </h1>

            <h2 className="text-2xl md:text-4xl font-black mb-6">
                Lost in the Algorithm?
            </h2>

            <p className="text-white/50 text-lg max-w-md mb-10 leading-relaxed">
                The page you are looking for has been archived or does not exist. Let's get you back to scaling your empire.
            </p>

            <Link
                href="/"
                className="px-8 py-4 bg-[#8406f9] hover:bg-[#8406f9]/90 text-white font-bold rounded-full transition-all shadow-[0_0_30px_rgba(132,6,249,0.3)] hover:shadow-[0_0_50px_rgba(132,6,249,0.5)] hover:-translate-y-1"
            >
                Back to Home
            </Link>
        </div>
    );
}
