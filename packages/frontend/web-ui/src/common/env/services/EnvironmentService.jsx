class EnvironmentService {
  getEnvironment() {
    const env = import.meta.env;

    return {
      backendBaseUrl: env.VITE_BACKEND_BASE_URL,
    };
  }
}

export const environmentService = new EnvironmentService();
