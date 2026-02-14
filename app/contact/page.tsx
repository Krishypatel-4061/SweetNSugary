"use client";

// import Image from "next/image";

export default function ContactPage() {
    return (
        <main className="container mx-auto px-6 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Info & Map */}
            <div className="fade-in-up">
                <span className="text-dusty-rose font-bold tracking-widest uppercase text-sm mb-4 block">
                    Get in Touch
                </span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-warm-cocoa">
                    Let&apos;s Bake Memories
                </h1>
                <p className="text-lg text-warm-cocoa/80 mb-8">
                    Ready to order your dream cake? Have a question about our ingredients?
                    We’d love to hear from you.
                </p>

                <div className="space-y-6 mb-12">
                    <div className="flex items-start gap-4">
                        <div className="bg-white p-3 rounded-full text-dusty-rose">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-warm-cocoa">Location</h4>
                            <a
                                href="https://maps.app.goo.gl/GwQxiFTxc1oXtrt99"
                                target="_blank"
                                className="hover:text-dusty-rose transition text-warm-cocoa"
                            >
                                <p className="opacity-80">Sweet N Sugary, Jamnagar, Gujarat</p>
                                <p className="text-xs italic mt-1 opacity-60">
                                    Home Studio - Pickups by Appointment
                                </p>
                            </a>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-white p-3 rounded-full text-dusty-rose">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-warm-cocoa">Phone / WhatsApp</h4>
                            <p className="opacity-80 text-warm-cocoa">+91 97268 05395</p>
                        </div>
                    </div>
                </div>

                {/* Map Embed */}
                <div className="w-full h-80 bg-gray-200 rounded-2xl overflow-hidden shadow-lg">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3687.777220377415!2d69.9824162!3d22.4374094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395715229226bf4f%3A0x9a4522f3f5682234!2sSweet%20N%20Sugary!5e0!3m2!1sen!2sin!4v1771090730042!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>

            {/* Inquiry Form */}
            <div
                className="bg-white p-8 md:p-12 rounded-3xl shadow-xl fade-in-up"
                style={{ animationDelay: "0.2s" }}
            >
                <h3 className="text-2xl font-serif font-bold mb-6 text-warm-cocoa">
                    Send an Inquiry
                </h3>
                {/* Netlify Form Handling */}
                <form
                    className="space-y-6"
                    data-netlify="true"
                    name="contact"
                    method="POST"
                    action="/success"
                >
                    <input type="hidden" name="form-name" value="contact" />
                    <div>
                        <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-xs text-warm-cocoa">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            className="w-full bg-cream-puff border border-transparent focus:border-dusty-rose focus:bg-white rounded-lg px-4 py-3 outline-none transition text-warm-cocoa"
                            placeholder="Your Name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-xs text-warm-cocoa">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            className="w-full bg-cream-puff border border-transparent focus:border-dusty-rose focus:bg-white rounded-lg px-4 py-3 outline-none transition text-warm-cocoa"
                            placeholder="+91 97268 05395"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-xs text-warm-cocoa">
                                Date Needed
                            </label>
                            <input
                                type="date"
                                name="date"
                                className="w-full bg-cream-puff border border-transparent focus:border-dusty-rose focus:bg-white rounded-lg px-4 py-3 outline-none transition text-warm-cocoa"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-xs text-warm-cocoa">
                                Weight (Kg)
                            </label>
                            <select
                                name="weight"
                                className="w-full bg-cream-puff border border-transparent focus:border-dusty-rose focus:bg-white rounded-lg px-4 py-3 outline-none transition text-warm-cocoa"
                            >
                                <option>0.5 Kg</option>
                                <option>1 Kg</option>
                                <option>2 Kg</option>
                                <option>3+ Kg</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-xs text-warm-cocoa">
                            Cake Type / Flavor Preferences
                        </label>
                        <textarea
                            name="message"
                            className="w-full bg-cream-puff border border-transparent focus:border-dusty-rose focus:bg-white rounded-lg px-4 py-3 h-32 outline-none transition text-warm-cocoa"
                            placeholder="e.g. Chocolate Truffle, Eggless, Birthday Theme..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-warm-cocoa text-cream-puff font-bold py-4 rounded-full shadow-lg hover:shadow-xl hover:bg-opacity-90 transition transform hover:-translate-y-1"
                    >
                        Send Inquiry
                    </button>

                    <div className="text-center pt-4">
                        <p className="text-xs opacity-60 mb-2 text-warm-cocoa">
                            Or for faster response
                        </p>
                        <a
                            href="https://wa.me/919726805395"
                            target="_blank"
                            className="inline-flex items-center gap-2 text-green-600 font-bold hover:underline"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.6 1.967.606 3.427 1.623 5.09l-1.066 3.892 3.826-1z" />
                            </svg>
                            Chat on WhatsApp
                        </a>
                    </div>
                </form>
            </div>
        </main>
    );
}
