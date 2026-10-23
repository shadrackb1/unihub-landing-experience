import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/list-property")({
  component: () => {
    return (
      <div>
        <h1 className="text-3xl font-bold">List Your Property</h1>
        <p className="mt-4">Register as a landlord</p>
      </div>
    );
  },
});
