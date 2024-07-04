"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class Estado {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const session = database_1.default.session();
            try {
                const result = yield session.run('MATCH (e:Estado) RETURN e');
                return result.records.map(record => record.get('e').properties);
            }
            catch (error) {
                console.error('Erro ao buscar estados:', error);
                throw error;
            }
            finally {
                yield session.close();
            }
        });
    }
    static getOne(uf) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = database_1.default.session();
            try {
                const result = yield session.run('MATCH (e:Estado {uf: $uf}) RETURN e', { uf });
                if (result.records.length === 0) {
                    throw new Error('Estado não encontrado');
                }
                return result.records[0].get('e').properties;
            }
            catch (error) {
                console.error('Erro ao buscar estado:', error);
                throw error;
            }
            finally {
                yield session.close();
            }
        });
    }
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = database_1.default.session();
            try {
                yield session.run(`
                MERGE (e:Estado {uf: $uf})
                ON CREATE SET e.nome = $nome
                RETURN e
                `, { uf: data.uf, nome: data.nome });
            }
            catch (error) {
                console.error('Erro ao criar estado:', error);
                throw error;
            }
            finally {
                yield session.close();
            }
        });
    }
    static update(uf, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = database_1.default.session();
            try {
                yield session.run(`
                MATCH (e:Estado {uf: $uf})
                SET e.nome = $nome
                RETURN e
                `, { uf, nome: data.nome });
            }
            catch (error) {
                console.error('Erro ao atualizar estado:', error);
                throw error;
            }
            finally {
                yield session.close();
            }
        });
    }
    static delete(uf) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = database_1.default.session();
            try {
                const result = yield session.run('MATCH (e:Estado {uf: $uf}) DELETE e', { uf });
                if (result.summary.counters.updates().nodesDeleted === 0) {
                    throw new Error('Estado não encontrado');
                }
            }
            catch (error) {
                console.error('Erro ao deletar estado:', error);
                throw error;
            }
            finally {
                yield session.close();
            }
        });
    }
}
exports.default = Estado;
