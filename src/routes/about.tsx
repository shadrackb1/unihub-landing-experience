import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: () => {
    return (
      <div>
        <h1 className="text-3xl font-bold">About UniHub</h1>
        <p className="mt-4">About our platform</p>
      </div>
    );
  },
});
