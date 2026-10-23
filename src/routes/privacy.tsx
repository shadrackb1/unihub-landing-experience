import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: () => {
    return (
      <div>
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-4">Privacy information</p>
      </div>
    );
  },
});
