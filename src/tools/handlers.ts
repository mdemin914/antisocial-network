import type { Handler, Tool } from "@/types/tools";
import subtraction from "./subtraction/handler";
import timetool from "./timetool/handler";
import javascript from "./javascript/handler";
import openmeteoweather from "./openmeteoweather/handler";
import descriptorRegistry from "@/tools/descriptors";

const handlers = { subtraction, timetool, javascript, openmeteoweather };
const registry: Record<string, Tool> = {};
const register = (
  handler: Handler,
  name: string = handler.name || "",
) => {
  if (descriptorRegistry[name]) {
    registry[name] = { ...descriptorRegistry[name], handler };
  }
};
for (const [name, handler] of Object.entries(handlers)) {
  register(handler, name);
}

export default registry;
