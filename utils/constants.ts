import { envManager } from '../config/environment';

export const TIMEOUTS = {
    SHORT: 5000,
    MEDIUM: 10000,
    LONG: 30000,
};

export const MESSAGES = {
    LOGIN: {
        SUCCESS: 'Login realizado com sucesso',
        INVALID_CREDENTIALS: 'Credenciais inválidas',
        REQUIRED_FIELDS: 'Campos obrigatórios',
    },
    DOCUMENTS: {
        UPLOAD_SUCCESS: 'Documento enviado com sucesso',
        UPLOAD_ERROR: 'Erro ao enviar documento',
        DELETE_SUCCESS: 'Documento excluído com sucesso',
        DELETE_ERROR: 'Erro ao excluir documento',
    },
};

export const TEST_DATA = {
    VALID_USER: envManager.getCredentials(),
    INVALID_USER: {
        username: 'invalid_user',
        password: 'wrong_password',
    },
};

