import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/shipping-policy")({
  beforeLoad: () => {
    throw redirect({ to: "/shipping-refunds" });
  },
});
