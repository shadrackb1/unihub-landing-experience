import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  component: () => {
    return (
      <div>
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="mt-4">Get in touch</p>
      </div>
    );
  },
});
