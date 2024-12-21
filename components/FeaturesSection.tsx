import React from "react";
import Feature from "./Feature";
const features = [
  {
    title: "Personalized Feedback Forms",
    description:
      "Effortlessly generate custom URLs for feedback forms tailored to your brand.",
  },
  {
    title: "Seamless Integration",
    description:
      "Integrate with your existing tools and services for a streamlined workflow.",
  },
  {
    title: "Customizable Experience",
    description:
      "Adapt forms to fit your specific requirements, including custom fields and branding.",
  },
  {
    title: "Actionable Analytics",
    description:
      "Track feedback trends and extract valuable insights to make data-driven decisions.",
  },
  {
    title: "Scalable Solution",
    description:
      "Designed to grow with your business, handling increasing feedback volumes seamlessly.",
  },
  {
    title: "Rapid Support",
    description:
      "Our support team is ready to assist you promptly, ensuring smooth operations.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="feature" className="container mx-auto max-w-screen-xl px-4 my-24 flex items-center flex-col">
      <h2 className="mb-6 text-2xl font-bold">Features</h2>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
