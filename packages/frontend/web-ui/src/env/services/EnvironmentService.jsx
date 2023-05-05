import { createContext } from "react";

class EnvironmentService {
  getEnvironment() {
    const env = import.meta.env;

    return {
      backendBaseUrl: env.BACKEND_BASE_URL,
    }
  }
}

export const EnvironmentServiceContext = createContext(new EnvironmentService());

export default EnvironmentService;
