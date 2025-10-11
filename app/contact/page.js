"use client";
import Image from "next/image";

export default function ContactPage() {
  return (
    <main className="w-full bg-white">
      {/* Contact Section */}
      <section className="w-full px-6 md:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          {/* Left Column - Keep image + text */}
          <div className="space-y-6">
            {/* Left image exactly as screenshot */}
            <div className="relative w-full h-56 md:h-64 lg:h-72">
              <Image
                src="/Customer.png" // replace with your left-side image
                alt="Customer Support"
                height={500}
                width={500}
                className="object-contain"
              />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Customer Support
            </h2>
            <p className="text-gray-700">
              Email: <span className="font-medium">support@swigg.in</span>
            </p>

            {/* Corporate Office Info */}
            <div className="space-y-2 text-gray-700">
              <h3 className="font-semibold text-lg">Corporate Office</h3>
              <p className="text-sm leading-relaxed">
                No. 55, 1st Main, Ground Floor, L.J. Block, Embassy TechVillage, 
                Outer Ring Road, Devarabisanahalli, Bengaluru 560103, Karnataka, India.
              </p>
              <p className="text-sm">
                CIN: U63090KA2020PTC135123 | PAN: AASCP2345R | GST: 29AASCP2345R1Z5
              </p>
            </div>

            <button className="bg-orange-500 text-white px-6 py-2 rounded-md shadow hover:bg-orange-600">
              Get Directions
            </button>
          </div>

          {/* Right Banner - As shown in screenshot */}
          <div className="relative w-full h-96 md:h-[450px] rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/reach customer.png" // replace with your banner image
              alt="Reach On Time Banner"
              height={500}
              width={500}
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 px-6 md:px-16 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Left - Logo & Address */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">URBAN DRIVE</h2>
            <p className="text-sm leading-relaxed">
              The 1st, 1st Floor, VGP Layout, Phase-2, <br />
              2nd Main, Road No-10, Bengaluru, <br />
              Karnataka 560078.
            </p>
            <p className="mt-3 text-sm">Email: urban.drive@gmail.com</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
