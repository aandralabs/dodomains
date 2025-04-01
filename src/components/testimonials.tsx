const testimonials = [
  {
    quote: "oh, that's pretty cool",
    author: "Henrik H.",
    role: "Tech Founder, Norway",
  },
  {
    quote: "Legend!",
    author: "Oscar L.",
    role: "Startup Founder, Sweden",
  },
  {
    quote: "this is pretty darn good. Good job",
    author: "Mircea E.",
    role: "Digital Entrepreneur",
  },
  {
    quote:
      "Had to try it as well, managed to come up with a unique name that ChatGPT hasn't been able to, thanks!",
    author: "Anna T.",
    role: "Tech Entrepreneur, Denmark",
  },
  {
    quote: "I love it !",
    author: "Luc C.",
    role: "Tech Founder, Finland",
  },
];

export function Testimonials() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-12 backdrop-blur-[1px] bg-background/30 py-1 rounded">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="backdrop-blur-[1px] bg-background/30 p-4 rounded"
            >
              <p className="text-muted-foreground italic mb-3">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
