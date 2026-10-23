import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: () => {
    return (
      <div>
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="mt-4">Terms and conditions</p>
      </div>
    );
  },
});
