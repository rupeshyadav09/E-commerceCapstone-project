import { useState } from 'react';

const faqs = [
  {
    question: 'How long does delivery take?',
    answer: 'Most orders arrive within 3-5 business days, depending on your location.',
  },
  {
    question: 'Can I return a product?',
    answer: 'Yes, returns are accepted within 30 days for unused items in original condition.',
  },
  {
    question: 'Do you offer discounts for bulk orders?',
    answer: 'Absolutely. Contact our support team for custom bulk pricing options.',
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-10">
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
      <div className="mx-auto grid max-w-3xl gap-3">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.question} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold"
              >
                {item.question}
                <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && <p className="px-5 pb-4 leading-6 text-gray-600">{item.answer}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FAQ;
