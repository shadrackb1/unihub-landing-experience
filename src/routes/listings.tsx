import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/listings")({
  component: () => {
    return (
      <div>
        <h1 className="text-3xl font-bold">Listings</h1>
        <p className="mt-4">Browse available properties</p>
      </div>
    );
  },
});
