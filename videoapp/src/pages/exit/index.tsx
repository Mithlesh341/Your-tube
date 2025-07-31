export const metadata = {
  title: "Exit",
};

export const dynamic = "force-static"; // ensures fast loading

export default function ExitPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black text-white z-[9999] px-4">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl  font-bold mb-4 animate-pulse">👋 Goodbye!</h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300">This session has ended. Thank you for visiting.</p>
      </div>
    </div>
  );
}
