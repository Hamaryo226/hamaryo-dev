import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { withSecurityHeaders } from "./lib/security";

const handler = createStartHandler(defaultStreamHandler);

export default {
  async fetch(...args: Parameters<typeof handler>) {
    return withSecurityHeaders(await handler(...args));
  },
};
