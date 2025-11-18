/**
 * Configuração de ambientes
 * Gerencia URLs e credenciais para diferentes ambientes (dev, homolog, prod)
 */

export type Environment = 'dev' | 'homolog' | 'prod';

interface EnvironmentConfig {
    baseURL: string;
    username: string;
    password: string;
}

class EnvironmentManager {
    private currentEnv: Environment;

    constructor() {
        this.currentEnv = (process.env.ENVIRONMENT as Environment) || 'dev';
    }

    /**
     * Retorna a configuração do ambiente atual
     */
    getCurrentConfig(): EnvironmentConfig {
        return this.getConfig(this.currentEnv);
    }

    /**
     * Retorna a configuração de um ambiente específico
     */
    getConfig(env: Environment): EnvironmentConfig {
        const configs: Record<Environment, EnvironmentConfig> = {
            dev: {
                baseURL: process.env.DEV_BASE_URL || '',
                username: process.env.DEV_USERNAME || '',
                password: process.env.DEV_PASSWORD || '',
            },
            homolog: {
                baseURL: process.env.HOMOLOG_BASE_URL || '',
                username: process.env.HOMOLOG_USERNAME || '',
                password: process.env.HOMOLOG_PASSWORD || '',
            },
            prod: {
                baseURL: process.env.PROD_BASE_URL || '',
                username: process.env.PROD_USERNAME || '',
                password: process.env.PROD_PASSWORD || '',
            },
        };

        return configs[env];
    }

    /**
     * Define o ambiente atual
     */
    setEnvironment(env: Environment): void {
        this.currentEnv = env;
    }

    /**
     * Retorna o ambiente atual
     */
    getEnvironment(): Environment {
        return this.currentEnv;
    }

    /**
     * Retorna a URL base do ambiente atual
     */
    getBaseURL(): string {
        const url = this.getCurrentConfig().baseURL;
        if (!url) {
            throw new Error(
                `Base URL não configurada para o ambiente ${this.currentEnv}. ` +
                `Verifique se a variável ${this.currentEnv.toUpperCase()}_BASE_URL está definida.`
            );
        }
        return url;
    }

    /**
     * Retorna as credenciais do ambiente atual
     */
    getCredentials(): { username: string; password: string } {
        const config = this.getCurrentConfig();
        return {
            username: config.username,
            password: config.password,
        };
    }
}

export const envManager = new EnvironmentManager();
