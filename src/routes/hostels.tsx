import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hostels")({
  component: () => {
    return (
      <div>
        <h1 className="text-3xl font-bold">Hostels</h1>
        <p className="mt-4">Student hostels near campus</p>
      </div>
    );
  },
});
