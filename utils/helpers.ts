import path from 'path';

export class TestHelpers {
    /**
     * Retorna o caminho absoluto de um arquivo de teste
     */
    static getTestFilePath(filename: string): string {
        return path.join(__dirname, '..', 'test-data', filename);
    }

    /**
     * Gera um nome único para testes
     */
    static generateUniqueName(prefix: string): string {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `${prefix}_${timestamp}_${random}`;
    }

    /**
     * Aguarda um tempo específico
     */
    static async wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Formata data para string
     */
    static formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }
}
