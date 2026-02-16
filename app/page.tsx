import Link from "next/link";
import Image from "next/image";
import MicroInteraction from "@/components/MicroInteraction";

export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center pt-28 md:pt-0">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-dusty-rose opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-orange-100 opacity-30 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center md:text-left order-2 md:order-1">
            <MicroInteraction>
              <span className="inline-block py-1 px-3 border border-warm-cocoa/30 rounded-full text-xs font-bold tracking-widest mb-4 uppercase">
                📍 Jamnagar, Gujarat
              </span>
            </MicroInteraction>

            <MicroInteraction delay={0.1}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6 text-warm-cocoa">
                Custom Cakes & <br />
                <span className="text-dusty-rose italic">Desserts 🍰</span>
              </h1>
            </MicroInteraction>

            <MicroInteraction delay={0.2}>
              <p className="text-lg md:text-xl text-warm-cocoa/80 mb-8 max-w-lg mx-auto md:mx-0">
                Made with Love & Finest Ingredients. ✨ Order now for your special
                occasion.
              </p>
            </MicroInteraction>

            <MicroInteraction delay={0.3} className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/menu"
                className="bg-warm-cocoa text-cream-puff px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-opacity-90 transition transform hover:-translate-y-1 block text-center"
              >
                View Menu
              </Link>
              <a
                href="https://www.instagram.com/sweet__n__sugary__/"
                target="_blank"
                className="flex items-center justify-center gap-2 px-8 py-4 border border-warm-cocoa rounded-full font-bold hover:bg-warm-cocoa/5 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Follow Us
              </a>
            </MicroInteraction>
          </div>

          <MicroInteraction type="scale" delay={0.4} className="order-1 md:order-2">
            <div className="relative w-full aspect-square rounded-full overflow-hidden border-8 border-white shadow-2xl group cursor-pointer">
              <Image
                src="https://www.lifeloveandsugar.com/wp-content/uploads/2014/08/Best-Moist-Chocolate-Cake1-1.jpg"
                alt="Delicious Cake"
                fill
                className="object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute bottom-10 -left-6 bg-cream-puff p-4 rounded-xl shadow-xl border border-warm-cocoa/10 animate-bounce hidden md:block">
                <p className="text-xs font-bold text-warm-cocoa uppercase tracking-wide">
                  Customer Favorite
                </p>
                <p className="text-dusty-rose font-serif font-bold text-lg">
                  Double Chocolate Truffle
                </p>
              </div>
            </div>

          </MicroInteraction>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <MicroInteraction>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-16 text-warm-cocoa">
              Why Choose Sweet N Sugary?
            </h2>
          </MicroInteraction>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[{ icon: "🌿", title: "Fresh & Preservative-Free", desc: "No stale shelves. We bake to order, ensuring every bite is fresh, aromatic goodness." },
            { icon: "🎨", title: "Made with Love", desc: "From elegant fondant to trending bento cakes, tailored to your personality." },
            { icon: "✨", title: "Premium Ingredients", desc: "We refuse to compromise on quality. Only the finest ingredients for our Jamnagar family." }
            ].map((feature, i) => (
              <MicroInteraction key={i} delay={i * 0.2}>
                <div className="p-8 rounded-2xl bg-cream-puff hover:shadow-lg transition hover:-translate-y-2 duration-300">
                  <div className="w-16 h-16 mx-auto bg-dusty-rose text-white rounded-full flex items-center justify-center mb-6 text-2xl shadow-md">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-4 text-warm-cocoa">
                    {feature.title}
                  </h3>
                  <p className="text-warm-cocoa/80 italic leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </MicroInteraction>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-cream-puff">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <MicroInteraction type="scale">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-xl rotate-2 hover:rotate-0 transition duration-500">
              <Image
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Baker mixing ingredients"
                fill
                className="object-cover"
              />
            </div>
          </MicroInteraction>

          <div>
            <MicroInteraction delay={0.2}>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-warm-cocoa">
                The Story of &apos;Sweet N Sugary&apos;
              </h2>
            </MicroInteraction>
            <MicroInteraction delay={0.3}>
              <h3 className="text-xl font-serif text-dusty-rose mb-6">
                Passion, Precision, and Premium Ingredients
              </h3>
            </MicroInteraction>
            <MicroInteraction delay={0.4}>
              <p className="text-lg text-warm-cocoa/80 mb-6 leading-relaxed">
                Located in the heart of Jamnagar, Gujarat, we are more than just a
                bakery; we are a home-based studio dedicated to turning your
                celebrations into edible memories. Unlike commercial outlets, we
                believe in the magic of &quot;slow baking.&quot;
              </p>
            </MicroInteraction>
            <MicroInteraction delay={0.5}>
              <Link
                href="/contact"
                className="inline-block border-b-2 border-warm-cocoa pb-1 hover:text-dusty-rose hover:border-dusty-rose transition font-bold uppercase tracking-widest text-sm"
              >
                Meet the Baker →
              </Link>
            </MicroInteraction>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-dusty-rose/10 rounded-full blur-3xl -ml-20 -mt-20"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <MicroInteraction>
            <span className="text-dusty-rose font-bold tracking-widest uppercase text-sm mb-2 block">
              Kind Words
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-16 text-warm-cocoa">
              Jamnagar Loves Us
            </h2>
          </MicroInteraction>

          <div className="grid md:grid-cols-3 gap-8">
            {[{ text: "The best birthday cake we've ever had! The design was exactly what I wanted.", author: "Anjali P., Patel Colony" },
            { text: "Finally, a place in Jamnagar that serves authentic, eggless cookies. Perfect for my evening chai.", author: "Rahul M., Valsura Road" },
            { text: "Ordered hamper jars for Diwali gifting. The packaging was so premium and everyone loved the treats!", author: "Priya S., Digjam Circle" }
            ].map((review, i) => (
              <MicroInteraction key={i} delay={i * 0.2}>
                <div className="bg-cream-puff p-8 rounded-xl relative hover:bg-warm-cocoa hover:text-white transition duration-500 group text-left">
                  <div className="text-dusty-rose text-6xl font-serif absolute -top-4 left-6 opacity-40">“</div>
                  <p className="text-warm-cocoa/80 group-hover:text-white/90 italic mb-6 pt-6 relative z-10">
                    &quot;{review.text}&quot;
                  </p>
                  <p className="font-bold text-warm-cocoa group-hover:text-white">
                    — {review.author}
                  </p>
                </div>
              </MicroInteraction>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-warm-cocoa text-cream-puff text-center">
        <div className="container mx-auto px-6">
          <MicroInteraction>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Join our Sweet Community
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Follow our baking journey on Instagram{" "}
              <a
                href="https://www.instagram.com/sweet__n__sugary__/"
                target="_blank"
                className="underline decoration-dusty-rose hover:text-dusty-rose transition font-bold"
              >
                @sweet__n__sugary__
              </a>
            </p>
          </MicroInteraction>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto opacity-70 hover:opacity-100 transition duration-500">
            {[
              "https://www.marcellinaincucina.com/wp-content/uploads/2023/08/italian-butter-cookies-hero.jpg",
              "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1586985289906-406988974504?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
              "https://i.ytimg.com/vi/XAFnIPbaxQw/maxresdefault.jpg"
            ].map((src, i) => (
              <MicroInteraction key={i} delay={i * 0.1} type="scale">
                <div className="relative aspect-square bg-white/10 rounded-lg overflow-hidden">
                  <Image
                    src={src}
                    alt={`Gallery ${i + 1}`}
                    fill
                    className="object-cover hover:scale-110 transition duration-700"
                  />
                </div>
              </MicroInteraction>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
