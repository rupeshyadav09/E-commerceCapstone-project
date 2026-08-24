const features = [
  { title: 'Fast Shipping', description: 'Quick delivery for all your daily essentials.' },
  { title: 'Secure Payments', description: 'Safe and trusted checkout for every order.' },
  { title: '24/7 Support', description: 'Our team is always here to help you.' },
];

function WhatWeSell() {
  return (
    <section className="py-10">
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">What We Sell</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-transform hover:-translate-y-1"
          >
            <h3 className="mb-2 font-semibold">{feature.title}</h3>
            <p className="leading-6 text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhatWeSell;
