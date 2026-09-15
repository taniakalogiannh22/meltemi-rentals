import { useMemo, useState, type FormEvent } from "react";

type Car = {
  name: string;
  category: string;
  passengers: number;
  transmission: string;
  price: number;
  image: string;
};

const cars: Car[] = [
  {
    name: "Fiat 500",
    category: "CITY",
    passengers: 4,
    transmission: "Manual",
    price: 43,
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1400&q=85",
  },
  {
    name: "Mercedes-Benz GLE Coupe",
    category: "ECONOMY",
    passengers: 4,
    transmission: "Manual",
    price: 47,
    image:
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1400&q=85",
  },
  {
    name: "Volkswagen Polo",
    category: "COMPACT",
    passengers: 5,
    transmission: "Automatic",
    price: 52,
    image:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1400&q=85",
  },
  {
    name: "Ford Expedition",
    category: "SUV",
    passengers: 5,
    transmission: "Manual",
    price: 65,
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=85",
  },
];

const features = [
  {
    number: "01",
    title: "Full insurance",
    text: "Already included in your daily rate.",
  },
  {
    number: "02",
    title: "Airport delivery",
    text: "Your car ready when you land in Kos.",
  },
  {
    number: "03",
    title: "Second driver",
    text: "Share the road without another daily charge.",
  },
  {
    number: "04",
    title: "Clear pricing",
    text: "Know exactly what you pay before you arrive.",
  },
];

function App() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [selectedCar, setSelectedCar] = useState("");

  const selectedCarData = cars.find((car) => car.name === selectedCar);

  const today = new Date().toISOString().split("T")[0];

  const rentalDays = useMemo(() => {
    if (!pickupDate || !returnDate) return 0;

    const pickup = new Date(`${pickupDate}T12:00:00`);
    const returnDay = new Date(`${returnDate}T12:00:00`);

    const difference = returnDay.getTime() - pickup.getTime();

    if (difference <= 0) return 0;

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  }, [pickupDate, returnDate]);

  const estimatedTotal =
    selectedCarData && rentalDays > 0
      ? selectedCarData.price * rentalDays
      : 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedCarData || rentalDays <= 0) {
      setSubmitError("Please select valid rental dates and a vehicle.");
      return;
    }

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      setSubmitError("Form configuration is missing.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    formData.append("access_key", accessKey);
    formData.append(
      "subject",
      `New Meltemi booking request — ${selectedCarData.name}`
    );
    formData.append("rental_days", rentalDays.toString());
    formData.append("estimated_total", `€${estimatedTotal}`);
    formData.append("insurance", "Included");
    formData.append("second_driver", "Included");
    formData.append("airport_delivery", "Included");

    try {
      const object = Object.fromEntries(formData.entries());

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(object),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitted(true);
        form.reset();
        setPickupDate("");
        setReturnDate("");
        setSelectedCar("");
      } else {
        setSubmitError(
          result.message || "Something went wrong. Please try again."
        );
      }
    } catch {
      setSubmitError(
        "Unable to send your request. Please check your connection."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="overflow-hidden bg-[#080808] text-[#f4efe9]">
      {/* NAVIGATION */}
      <header className="absolute left-0 top-0 z-50 w-full">
        <nav className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-7 lg:px-12">
          <a
            href="#"
            className="text-xl font-black uppercase tracking-[0.18em] text-white"
          >
            MELTEMI<span className="text-[#9d1b3a]">.</span>
          </a>

          <div className="hidden items-center gap-9 text-xs font-bold uppercase tracking-[0.15em] text-white/70 md:flex">
            <a href="#fleet" className="transition hover:text-white">
              Fleet
            </a>

            <a href="#difference" className="transition hover:text-white">
              The difference
            </a>

            <a href="#booking" className="transition hover:text-white">
              Booking
            </a>
          </div>

          <a
            href="#booking"
            className="border border-white/30 px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-white transition duration-300 hover:border-[#9d1b3a] hover:bg-[#8d1733]"
          >
            Reserve
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504512485720-7d83a16ee930?auto=format&fit=crop&w=2200&q=90"
          alt="Kos Greece coastline"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute inset-0 bg-linear-to-r from-black via-black/85 to-transparent" />

        <div className="absolute inset-0 bg-linear-to-t from-[#080808] via-transparent to-black/40" />

        <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-[#7b102b]/40 blur-3xl sm:h-125 sm:w-125" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-screen-2xl items-center px-6 pb-32 pt-36 lg:px-12">
          <div className="max-w-5xl">
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px w-14 bg-[#b42649]" />

              <p className="text-xs font-black uppercase tracking-[0.35em] text-white/70">
                Kos · Greece
              </p>
            </div>

            
<h1 className="text-[4rem] font-black uppercase leading-[0.82] tracking-[-0.055em] text-white sm:text-8xl lg:text-9xl">
              Drive
              <br />
              <span className="text-[#9d1b3a]">Different.</span>
            </h1>

            <div className="mt-10 flex max-w-3xl flex-col gap-7 border-l-2 border-[#8d1733] pl-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-xl text-base leading-7 text-white/65 sm:text-lg">
                Discover Kos without hidden charges, confusing insurance
                packages or checkout surprises.
              </p>

              <div className="shrink-0">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                  From
                </p>

                <p className="text-5xl font-black text-white">
                  €43
                  <span className="ml-1 text-sm font-medium text-white/50">
                    /day
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#booking"
                className="bg-[#8d1733] px-8 py-4 text-sm font-black uppercase tracking-[0.12em] text-white transition duration-300 hover:bg-[#ad2347]"
              >
                Find your car →
              </a>

              <a
                href="#fleet"
                className="border border-white/25 bg-black/20 px-8 py-4 text-sm font-black uppercase tracking-[0.12em] text-white backdrop-blur-md transition duration-300 hover:border-white hover:bg-white/10"
              >
                Explore fleet
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-0 z-20 hidden w-full px-12 md:block">
          <div className="mx-auto flex max-w-screen-2xl items-center justify-between border-t border-white/15 pt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
            <span>Full insurance included</span>
            <span>Airport delivery included</span>
            <span>Second driver included</span>
            <span className="text-white">No hidden fees.</span>
          </div>
        </div>
      </section>

      {/* STATEMENT */}
      <section
        id="difference"
        className="relative border-b border-white/10 px-6 py-28 lg:px-12 lg:py-40"
      >
        <div className="absolute right-0 top-0 h-full w-1/3 bg-linear-to-l from-[#500d20]/20 to-transparent" />

        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#b62a4b]">
            The Meltemi difference
          </p>

         <h2 className="mt-8 max-w-6xl text-[2.7rem] font-black uppercase leading-[0.95] tracking-[-0.045em] text-white sm:text-7xl lg:text-8xl">
            The cheapest ad
            <br />
            isn't always the
            <br />
            <span className="text-[#8d1733]">cheapest rental.</span>
          </h2>

          <p className="mt-10 max-w-xl text-lg leading-8 text-white/50">
            Some rentals get your attention with a low daily rate and reveal
            the real price later. We do the opposite.
          </p>
        </div>
      </section>

      {/* PRICE COMPARISON */}
      <section className="px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-2">
            {/* COMPETITOR */}
            <div className="bg-[#0c0c0c] p-8 sm:p-12">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-white/35">
                    Typical competitor
                  </p>

                  <p className="mt-5 text-6xl font-black text-white/80">
                    €35
                    <span className="text-base font-medium text-white/30">
                      /day
                    </span>
                  </p>
                </div>

                <span className="text-3xl text-white/15">01</span>
              </div>

              <div className="mt-10 border-t border-white/10">
                {[
                  ["Base rental", "€35/day"],
                  ["Insurance", "+ €15/day"],
                  ["Airport delivery", "+ €25"],
                  ["Second driver", "Extra"],
                  ["Insurance excess", "Up to €1,200"],
                ].map(([label, price]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-5 border-b border-white/10 py-5 text-sm"
                  >
                    <span className="text-white/45">{label}</span>
                    <span className="font-bold text-white/70">{price}</span>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-sm font-bold uppercase tracking-[0.12em] text-white/30">
                The headline price ≠ final price
              </p>
            </div>

            {/* MELTEMI */}
            <div className="relative overflow-hidden bg-[#650f27] p-8 sm:p-12">
              <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-white/65">
                    Meltemi
                  </p>

                  <p className="mt-5 text-6xl font-black text-white">
                    €43
                    <span className="text-base font-medium text-white/55">
                      /day
                    </span>
                  </p>
                </div>

                <span className="text-3xl text-white/25">02</span>
              </div>

              <div className="relative mt-10 border-t border-white/20">
                {[
                  ["Rental", "Included"],
                  ["Full insurance", "Included"],
                  ["Airport delivery", "Included"],
                  ["Second driver", "Included"],
                  ["Hidden charges", "None"],
                ].map(([label, price]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-5 border-b border-white/20 py-5 text-sm"
                  >
                    <span className="text-white/70">{label}</span>

                    <span className="font-black text-white">
                      {price} ✓
                    </span>
                  </div>
                ))}
              </div>

              <p className="relative mt-8 text-sm font-black uppercase tracking-[0.12em] text-white">
                €43 means €43. Simple.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FLEET */}
      <section
        id="fleet"
        className="border-y border-white/10 bg-[#0b0b0b] py-24 lg:py-32"
      >
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-12">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-[#b62a4b]">
                Our fleet
              </p>

              <h2 className="mt-5 text-5xl font-black uppercase tracking-tighter text-white sm:text-7xl">
                Choose your
                <br />
                <span className="text-white/25">way to Kos.</span>
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-white/40">
              Four vehicles. One simple pricing philosophy. Pick the car that
              fits your island experience.
            </p>
          </div>

          <div className="mt-16 space-y-6">
            {cars.map((car, index) => (
              <article
                key={car.name}
                className="group relative grid min-h-107.5 overflow-hidden border border-white/10 bg-black lg:grid-cols-2"
              >
                {/* IMAGE */}
                <div className="relative min-h-75 overflow-hidden">
                  <img
                    src={car.image}
                    alt={car.name}
                    loading="lazy"
                   className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-black/70" />

                  <div className="absolute left-5 top-5 border border-white/25 bg-black/50 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                    0{index + 1}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="relative flex flex-col justify-center p-8 lg:p-12">
                  <p className="text-xs font-black tracking-[0.3em] text-[#bd2d50]">
                    {car.category}
                  </p>

                  <h3 className="mt-3 text-4xl font-black uppercase tracking-[-0.04em] text-white lg:text-5xl">
                    {car.name}
                  </h3>

                  <div className="mt-6 flex flex-wrap gap-6 text-xs uppercase tracking-[0.12em] text-white/40">
                    <span>{car.passengers} seats</span>
                    <span>{car.transmission}</span>
                  </div>

                  <div className="mt-10 flex items-end justify-between gap-5 border-t border-white/10 pt-7">
                    <div>
                      <p className="text-xs uppercase tracking-[0.15em] text-white/35">
                        From
                      </p>

                      <p className="mt-1 text-4xl font-black text-white">
                        €{car.price}
                        <span className="text-sm font-medium text-white/35">
                          /day
                        </span>
                      </p>
                    </div>

                    <a
                      href="#booking"
                      onClick={() => {
                        setSelectedCar(car.name);
                        setSubmitted(false);
                      }}
                      className="bg-[#75142e] px-6 py-4 text-xs font-black uppercase tracking-[0.12em] text-white transition duration-300 hover:bg-[#9d1b3a]"
                    >
                      Select →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative px-6 py-24 lg:px-12 lg:py-32">
        <div className="absolute left-0 top-0 h-full w-1/3 bg-linear-to-r from-[#3d0918]/20 to-transparent" />

        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#b62a4b]">
            Nothing hidden
          </p>

          <h2 className="mt-5 text-5xl font-black uppercase tracking-tighter text-white sm:text-7xl">
            Everything you need.
            <br />
            <span className="text-white/25">Already included.</span>
          </h2>

          <div className="mt-16 grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.number} className="bg-[#080808] p-8 lg:p-10">
                <p className="text-xs font-black text-[#9d1b3a]">
                  {feature.number}
                </p>

                <div className="mt-12 h-px w-10 bg-[#8d1733]" />

                <h3 className="mt-6 text-xl font-black uppercase text-white">
                  {feature.title}
                </h3>

                <p className="mt-4 text-sm leading-6 text-white/40">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section
        id="booking"
        className="relative border-t border-white/10 bg-[#10090b] px-6 py-24 lg:px-12 lg:py-32"
      >
        <div className="absolute left-0 top-0 h-full w-1/2 bg-linear-to-r from-[#6c1028]/20 to-transparent" />

        <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
          {/* BOOKING INTRO */}
          <div className="lg:py-10">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#bd2d50]">
              Start your trip
            </p>

            <h2 className="mt-6 text-[3.2rem] font-black uppercase leading-[0.88] tracking-tighter text-white sm:text-7xl">
              Kos is
              <br />
              <span className="text-[#8d1733]">waiting.</span>
            </h2>

            <p className="mt-8 max-w-sm leading-7 text-white/45">
              Choose your dates and vehicle. You'll see your estimated total
              before sending your request.
            </p>

            <div className="mt-12 border-l border-[#8d1733] pl-5 text-sm leading-8 text-white/50">
              <p>Full insurance included</p>
              <p>Airport delivery included</p>
              <p>Second driver included</p>
              <p className="font-bold text-white">No hidden extras.</p>
            </div>
          </div>

          {/* FORM */}
          <div className="border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl sm:p-10">
            {submitted ? (
              <div className="flex min-h-130 flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#71142d] text-2xl font-black text-white">
                  ✓
                </div>

                <p className="mt-7 text-xs font-black uppercase tracking-[0.3em] text-[#bd2d50]">
                  Request sent
                </p>

                <h3 className="mt-3 text-4xl font-black uppercase text-white">
                  You're all set.
                </h3>

                <p className="mt-5 max-w-md leading-7 text-white/45">
                  Your request has been sent. We'll confirm availability and
                  your final price.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setSubmitError("");
                  }}
                  className="mt-8 border border-white/20 px-6 py-3 text-xs font-black uppercase tracking-[0.15em] text-white transition hover:border-[#8d1733]"
                >
                  New request
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="grid gap-6 sm:grid-cols-2"
              >
                <label className="sm:col-span-2">
                  <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    Full name
                  </span>

                  <input
                    required
                    name="name"
                    type="text"
                    placeholder="John Smith"
                    className="w-full border border-white/15 bg-[#111111] px-4 py-4 text-white outline-none transition placeholder:text-white/20 focus:border-[#8d1733]"
                  />
                </label>

                <label className="sm:col-span-2">
                  <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    Email
                  </span>

                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    className="w-full border border-white/15 bg-[#111111] px-4 py-4 text-white outline-none transition placeholder:text-white/20 focus:border-[#8d1733]"
                  />
                </label>

                <label>
                  <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    Pick-up
                  </span>

                  <input
                    required
                    name="pickup_date"
                    type="date"
                    value={pickupDate}
                    min={today}
                    onChange={(e) => {
                      const newPickup = e.target.value;

                      setPickupDate(newPickup);

                      if (returnDate && newPickup >= returnDate) {
                        setReturnDate("");
                      }
                    }}
                    className="w-full border border-white/15 bg-[#111111] px-4 py-4 text-white outline-none transition focus:border-[#8d1733] scheme:dark]"
                  />
                </label>

                <label>
                  <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    Return
                  </span>

                  <input
                    required
                    name="return_date"
                    type="date"
                    value={returnDate}
                    min={pickupDate || today}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full border border-white/15 bg-[#111111] px-4 py-4 text-white outline-none transition focus:border-[#8d1733] [scheme:dark]"
                  />
                </label>

                <label className="sm:col-span-2">
                  <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    Vehicle
                  </span>

                  <select
                    required
                    name="car"
                    value={selectedCar}
                    onChange={(e) => setSelectedCar(e.target.value)}
                    className="w-full border border-white/15 bg-[#111111] px-4 py-4 text-white outline-none transition focus:border-[#8d1733]"
                  >
                    <option value="" disabled>
                      Select a vehicle
                    </option>

                    {cars.map((car) => (
                      <option key={car.name} value={car.name}>
                        {car.name} — €{car.price}/day
                      </option>
                    ))}
                  </select>
                </label>

                <label className="sm:col-span-2">
                  <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    Phone
                  </span>

                  <input
                    name="phone"
                    type="tel"
                    placeholder="+30 690 000 0000"
                    className="w-full border border-white/15 bg-[#111111] px-4 py-4 text-white outline-none transition placeholder:text-white/20 focus:border-[#8d1733]"
                  />
                </label>

                {/* PRICE */}
                {selectedCarData && rentalDays > 0 && (
                  <div className="border border-[#74203a] bg-[#160b0f] p-6 sm:col-span-2">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#bd2d50]">
                          Estimated total
                        </p>

                        <p className="mt-2 text-sm font-bold text-white">
                          {selectedCarData.name} · {rentalDays}{" "}
                          {rentalDays === 1 ? "day" : "days"}
                        </p>
                      </div>

                      <p className="text-4xl font-black text-white">
                        €{estimatedTotal}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-5">
                      <div className="flex justify-between gap-5 text-sm">
                        <span className="text-white/40">
                          {rentalDays} × €{selectedCarData.price}/day
                        </span>

                        <span className="font-bold text-white">
                          €{estimatedTotal}
                        </span>
                      </div>

                      <div className="mt-3 flex justify-between gap-5 text-sm">
                        <span className="text-white/40">Full insurance</span>
                        <span className="font-bold text-white">Included</span>
                      </div>

                      <div className="mt-3 flex justify-between gap-5 text-sm">
                        <span className="text-white/40">
                          Airport delivery
                        </span>
                        <span className="font-bold text-white">Included</span>
                      </div>

                      <div className="mt-3 flex justify-between gap-5 text-sm">
                        <span className="text-white/40">Second driver</span>
                        <span className="font-bold text-white">Included</span>
                      </div>
                    </div>

                    <p className="mt-5 border-t border-white/10 pt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#bd2d50]">
                      No hidden extras.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#7c1732] px-6 py-5 text-xs font-black uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-[#a32145] disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
                >
                  {isSubmitting
                    ? "Sending..."
                    : "Request availability →"}
                </button>

                {submitError && (
                  <p
                    role="alert"
                    className="border border-red-900/50 bg-red-950/30 p-4 text-center text-sm text-red-300 sm:col-span-2"
                  >
                    {submitError}
                  </p>
                )}

                <p className="text-center text-[11px] text-white/30 sm:col-span-2">
                  No payment required to request availability.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden px-6 py-24 text-center">
        <div className="absolute h-96 w-96 rounded-full bg-[#74142e]/25 blur-3xl" />

        <div className="relative">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#b62a4b]">
            Meltemi Rentals · Kos
          </p>

          <h2 className="mt-7 text-5xl font-black uppercase leading-[0.9] tracking-[-0.055em] text-white sm:text-7xl lg:text-8xl">
            Less fine print.
            <br />
            <span className="text-[#8d1733]">More island.</span>
          </h2>

          <a
            href="#booking"
            className="mt-10 inline-block bg-[#821833] px-9 py-5 text-xs font-black uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-[#a92343]"
          >
            Start your journey →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-10 lg:px-12">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-5 text-xs uppercase tracking-[0.15em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-black text-white">
            MELTEMI<span className="text-[#8d1733]">.</span>
          </p>

          <p>Kos · Greece</p>

          <p>© 2026 Meltemi Rentals · Demo project</p>
        </div>
      </footer>

      {/* MOBILE CTA */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <a
          href="#booking"
          className="block bg-[#831934] px-6 py-4 text-center text-xs font-black uppercase tracking-[0.12em] text-white shadow-2xl"
        >
          Reserve a car · From €43/day
        </a>
      </div>
    </main>
  );
}

export default App;