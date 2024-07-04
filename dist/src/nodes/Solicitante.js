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
class Solicitante {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const session = database_1.default.session();
            try {
                const result = yield session.run(`
                MATCH (s:Solicitante)
                RETURN id(s) AS id, s
                `);
                return result.records.map(record => {
                    const requester = record.get('s').properties;
                    const requesterId = record.get('id');
                    return Object.assign({ id: requesterId }, requester);
                });
            }
            catch (error) {
                console.error('Erro ao buscar solicitantes:', error);
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
                MATCH (s:Solicitante)
                WHERE id(s) = $id
                RETURN id(s) AS id, s
                `, { id: parseInt(id) });
                if (result.records.length === 0) {
                    throw new Error('Solicitante não encontrado');
                }
                const record = result.records[0];
                const requester = record.get('s').properties;
                const requesterId = record.get('id');
                return Object.assign({ id: requesterId }, requester);
            }
            catch (error) {
                console.error('Erro ao buscar solicitante:', error);
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
                MATCH (p:Pessoa)
                WHERE id(p) = $id
                CREATE (s:Solicitante {quantidade_dependentes: $quantidade_dependentes})
                MERGE (s)-[:É_A_PESSOA]->(p)
                RETURN id(s) AS id, s
                `, { id: parseInt(data.id), quantidade_dependentes: data.quantidade_dependentes });
            }
            catch (error) {
                console.error('Erro ao criar solicitante:', error);
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
                MATCH (s:Solicitante)-[rel:É_A_PESSOA]->(pAntiga:Pessoa)
                WHERE id(s) = $id
                MATCH (pNova:Pessoa)
                WHERE id(pNova) = $idPessoa
                SET s.quantidade_dependentes = $quantidade_dependentes
                DELETE rel
                MERGE (s)-[:É_A_PESSOA]->(pNova)
                RETURN id(s) AS id, s, pNova
                `, { id: parseInt(id), quantidade_dependentes: data.quantidade_dependentes, idPessoa: parseInt(data.id) });
            }
            catch (error) {
                console.error('Erro ao atualizar solicitante:', error);
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
                const result = yield session.run(`
                MATCH (s:Solicitante)-[r]->()
                WHERE id(s) = $id
                DELETE r, s
                `, { id: parseInt(id) });
                if (result.summary.counters.updates().nodesDeleted === 0) {
                    throw new Error('Solicitante não encontrado');
                }
            }
            catch (error) {
                console.error('Erro ao deletar solicitante:', error);
                throw error;
            }
            finally {
                yield session.close();
            }
        });
    }
}
exports.default = Solicitante;
