export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <nav className="bg-orange-500 text-white p-4 text-center text-2xl font-bold shadow">
        RacunBelanja.id26 🔥
      </nav>

      {/* HEADER */}
      <div className="p-5">

        <h1 className="text-3xl font-bold text-center text-orange-500">
          Produk Viral Shopee
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Temukan produk viral pilihan terbaik hari ini 🚀
        </p>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="🔍 Cari produk viral..."
          className="w-full mt-5 p-3 rounded-xl border outline-none"
        />

      </div>

      {/* BANNER */}
      <div className="px-5">
        <div className="bg-orange-500 text-white p-5 rounded-2xl text-center mb-5 shadow">

          <h2 className="text-2xl font-bold">
            Flash Sale Shopee ⚡
          </h2>

          <p className="mt-2">
            Diskon besar produk viral hari ini!
          </p>

        </div>
      </div>

      {/* KATEGORI */}
      <div className="flex gap-3 overflow-x-auto px-5 mb-5">

        <button className="bg-orange-500 text-white px-4 py-2 rounded-full whitespace-nowrap">
          Semua
        </button>

        <button className="bg-white px-4 py-2 rounded-full shadow whitespace-nowrap">
          Gadget
        </button>

        <button className="bg-white px-4 py-2 rounded-full shadow whitespace-nowrap">
          Fashion
        </button>

        <button className="bg-white px-4 py-2 rounded-full shadow whitespace-nowrap">
          Rumah
        </button>

        <button className="bg-white px-4 py-2 rounded-full shadow whitespace-nowrap">
          Viral TikTok
        </button>

      </div>

      {/* PRODUK GRID */}
      <div className="p-5 grid md:grid-cols-2 gap-5">

        {/* PRODUK 1 */}
        <div className="bg-white rounded-2xl shadow-lg p-4 relative">

          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
            HOT 🔥
          </span>

          <img
            src="produk.jpg"
            alt="Produk 1"
            className="rounded-xl mb-4 w-full"
          />

          <h2 className="text-xl font-bold">
            Produk Viral 1
          </h2>

          <p className="text-gray-500 mt-2">
            Lagi viral dan banyak dibeli hari ini.
          </p>

          <div className="mt-3">
            <span className="text-gray-400 line-through text-sm">
              Rp199.000
            </span>

            <p className="text-2xl font-bold text-orange-500">
              Rp99.000
            </p>
          </div>

          <p className="text-yellow-500 mt-2">
            ⭐ 4.9 | Terjual 10RB+
          </p>

          <a
            href="https://s.shopee.co.id/9029qJ4Anh"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl"
          >
            🛒 Beli Sekarang
          </a>

        </div>

        {/* PRODUK 2 */}
        <div className="bg-white rounded-2xl shadow-lg p-4 relative">

          <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
            VIRAL 🚀
          </span>

          <img
            src="produk5.jpg"
            alt="Produk 2"
            className="rounded-xl mb-4 w-full"
          />

          <h2 className="text-xl font-bold">
            Produk Viral 2
          </h2>

          <p className="text-gray-500 mt-2">
            Produk favorit pilihan netizen TikTok.
          </p>

          <div className="mt-3">
            <span className="text-gray-400 line-through text-sm">
              Rp249.000
            </span>

            <p className="text-2xl font-bold text-orange-500">
              Rp129.000
            </p>
          </div>

          <p className="text-yellow-500 mt-2">
            ⭐ 4.8 | Terjual 5RB+
          </p>

          <a
            href="https://s.shopee.co.id/LkBY3d9Yh"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl"
          >
            🛒 Beli Sekarang
          </a>

        </div>

      </div>

    </main>
  );
}