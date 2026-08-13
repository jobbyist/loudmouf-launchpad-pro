import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/track-my-order")({
  beforeLoad: () => {
    throw redirect({ to: "/shipping-refunds" });
  },
});
