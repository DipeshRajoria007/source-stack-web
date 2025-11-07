export default function Background() {
  return (
    <>
      {/* Gradient background - black to white */}
      <div
        className="fixed inset-0 bg-gradient-to-b from-black via-gray-900 to-white/10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, #000 70%, #1a1a1a 100%)",
        }}
      />
      {/* Blob/Stacked layers illustration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Blob shapes */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gray-800/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-700/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gray-600/10 rounded-full blur-3xl"></div>
      </div>
    </>
  );
}
