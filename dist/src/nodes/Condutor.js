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
class Condutor {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const session = database_1.default.session();
            try {
                const result = yield session.run(`
                MATCH (c:Condutor)
                RETURN id(c) AS id, c
                `);
                return result.records.map(record => {
                    const conductor = record.get('c').properties;
                    const conductorId = record.get('id');
                    return Object.assign({ id: conductorId }, conductor);
                });
            }
            catch (error) {
                console.error('Erro ao buscar condutores:', error);
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
                MATCH (c:Condutor)
                WHERE id(c) = $id
                RETURN id(c) AS id, c
                `, { id: parseInt(id) });
                if (result.records.length === 0) {
                    throw new Error('Condutor não encontrado');
                }
                const record = result.records[0];
                const conductor = record.get('c').properties;
                const conductorId = record.get('id');
                return Object.assign({ id: conductorId }, conductor);
            }
            catch (error) {
                console.error('Erro ao buscar condutor:', error);
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
                MERGE (c:Condutor {cnh: $cnh})
                MERGE (c)-[:É_A_PESSOA]->(p)
                RETURN id(c) AS id, c
                `, { id: parseInt(data.id), cnh: data.cnh });
            }
            catch (error) {
                console.error('Erro ao criar condutor:', error);
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
                MATCH (c:Condutor)-[rel:É_A_PESSOA]->(pAntiga:Pessoa)
                WHERE id(c) = $id
                MATCH (pNova:Pessoa)
                WHERE id(pNova) = $idPessoa
                SET c.cnh = $cnh
                DELETE rel
                MERGE (c)-[:É_A_PESSOA]->(pNova)
                RETURN id(c) AS id, c, pNova
                `, { id: parseInt(id), cnh: data.cnh, idPessoa: parseInt(data.id) });
            }
            catch (error) {
                console.error('Erro ao atualizar condutor:', error);
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
                MATCH (c:Condutor)-[r]->()
                WHERE id(c) = $id
                DELETE r, c
                `, { id: parseInt(id) });
                if (result.summary.counters.updates().nodesDeleted === 0) {
                    throw new Error('Condutor não encontrado');
                }
            }
            catch (error) {
                console.error('Erro ao deletar condutor:', error);
                throw error;
            }
            finally {
                yield session.close();
            }
        });
    }
}
exports.default = Condutor;
