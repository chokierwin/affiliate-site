export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-5">

      <h1 className="text-3xl font-bold text-center mb-8">
        RacunBelanja Viral 🔥
      </h1>

      <div className="grid md:grid-cols-2 gap-5">

        {/* PRODUK 1 */}
        <div className="bg-white rounded-2xl shadow-lg p-4">

          <img
            src="produk.jpg"
            alt="Produk 1"
            className="rounded-xl mb-4 w-full"
          />

          <h2 className="text-xl font-bold">
            Produk Viral 1 🔥
          </h2>

          <p className="text-gray-500 mt-2">
            Lagi viral dan banyak dibeli.
          </p>

          <a
            href="https://s.shopee.co.id/9029qJ4Anh"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block text-center bg-orange-500 text-white py-3 rounded-xl"
          >
            Cek Produk 1
          </a>

        </div>

        {/* PRODUK 2 */}
        <div className="bg-white rounded-2xl shadow-lg p-4">

          <img
            src="produk5.jpg"
            alt="Produk 2"
            className="rounded-xl mb-4 w-full"
          />

          <h2 className="text-xl font-bold">
            Produk Viral 2 🚀
          </h2>

          <p className="text-gray-500 mt-2">
            Produk rekomendasi favorit hari ini.
          </p>

          <a
            href="https://s.shopee.co.id/LkBY3d9Yh"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block text-center bg-orange-500 text-white py-3 rounded-xl"
          >
            Cek Produk 2
          </a>

        </div>

      </div>

    </main>
  );
}