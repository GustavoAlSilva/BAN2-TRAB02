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
class Cidade {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const session = database_1.default.session();
            try {
                const result = yield session.run(`
                MATCH (c:Cidade)
                RETURN id(c) AS id, c
                `);
                return result.records.map(record => {
                    const city = record.get('c').properties;
                    const cityId = record.get('id');
                    return Object.assign({ id: cityId }, city);
                });
            }
            catch (error) {
                console.error('Erro ao buscar cidades:', error);
                throw error;
            }
            finally {
                yield session.close();
            }
        });
    }
    static getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = database_1.default.session();
            try {
                const result = yield session.run(`
                MATCH (c:Cidade)
                WHERE id(c) = $id
                RETURN id(c) AS id, c
                `, { id: parseInt(id) });
                if (result.records.length === 0) {
                    throw new Error('Cidade não encontrada');
                }
                const record = result.records[0];
                const city = record.get('c').properties;
                const cityId = record.get('id');
                return Object.assign({ id: cityId }, city);
            }
            catch (error) {
                console.error('Erro ao buscar cidade:', error);
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
                MATCH (e:Estado {uf: $estadoUf})
                MERGE (c:Cidade {nome: $nome})
                MERGE (c)-[:LOCALIZADO_EM]->(e)
                RETURN id(c) AS id, c
                `, { nome: data.nome, estadoUf: data.estadoUf });
            }
            catch (error) {
                console.error('Erro ao criar cidade:', error);
                throw error;
            }
            finally {
                yield session.close();
            }
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = database_1.default.session();
            try {
                yield session.run(`
                MATCH (c:Cidade)-[rel:LOCALIZADO_EM]->(eAntigo:Estado)
                WHERE id(c) = $id
                MATCH (eNovo:Estado {uf: $estadoUf})
                SET c.nome = $nome
                DELETE rel
                MERGE (c)-[:LOCALIZADO_EM]->(eNovo)
                RETURN id(c) AS id, c, eNovo
                `, { id: parseInt(id), nome: data.nome, estadoUf: data.estadoUf });
            }
            catch (error) {
                console.error('Erro ao atualizar cidade:', error);
                throw error;
            }
            finally {
                yield session.close();
            }
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = database_1.default.session();
            try {
                yield session.run(`
                MATCH (c:Cidade)-[r]->()
                WHERE id(c) = $id
                DELETE r, c
                `, { id: parseInt(id) });
            }
            catch (error) {
                console.error('Erro ao deletar cidade:', error);
                throw error;
            }
            finally {
                yield session.close();
            }
        });
    }
}
exports.default = Cidade;
