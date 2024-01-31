class EnvironmentService {
  getEnvironment() {
    const env: ImportMetaEnv = import.meta.env;

    return {
      backendBaseUrl: env['VITE_BACKEND_BASE_URL'],
    };
  }
}

export const environmentService: EnvironmentService = new EnvironmentService();
