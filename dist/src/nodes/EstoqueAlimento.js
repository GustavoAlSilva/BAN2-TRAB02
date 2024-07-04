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
class EstoqueAlimento {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const session = database_1.default.session();
            try {
                const result = yield session.run(`
                MATCH (e:EstoqueAlimento)
                RETURN id(e) AS id, e
                `);
                return result.records.map(record => {
                    const foodStock = record.get('e').properties;
                    const foodStockId = record.get('id');
                    return Object.assign({ id: foodStockId }, foodStock);
                });
            }
            catch (error) {
                console.error('Erro ao buscar estoques de alimento:', error);
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
                MATCH (e:EstoqueAlimento)
                WHERE id(e) = $id
                RETURN id(e) AS id, e
                `, { id: parseInt(id) });
                if (result.records.length === 0) {
                    throw new Error('Estoque de alimento não encontrado');
                }
                const record = result.records[0];
                const foodStock = record.get('e').properties;
                const foodStockId = record.get('id');
                return Object.assign({ id: foodStockId }, foodStock);
            }
            catch (error) {
                console.error('Erro ao buscar estoque de alimento:', error);
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
                MATCH (a:Alimento)
                WHERE id(a) = $id_alimento
                MATCH (d:Deposito)
                WHERE id(d) = $id_deposito
                CREATE (e:EstoqueAlimento {
                    data_validade: $data_validade,
                    peso: $peso
                })
                MERGE (e)-[:ESTOQUE_DO_ALIMENTO]->(a)
                MERGE (e)-[:ESTÁ_NO_DEPÓSITO]->(d)
                RETURN id(e) AS id, e
                `, {
                    id_alimento: parseInt(data.id_alimento),
                    data_validade: data.data_validade,
                    peso: data.peso,
                    id_deposito: parseInt(data.id_deposito)
                });
            }
            catch (error) {
                console.error('Erro ao criar estoque de alimento:', error);
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
                MATCH (e:EstoqueAlimento)-[relAlimento:ESTOQUE_DO_ALIMENTO]->(aAntigo:Alimento)
                WHERE id(e) = $id
                MATCH (e:EstoqueAlimento)-[relDeposito:ESTÁ_NO_DEPÓSITO]->(dAntigo:Deposito)
                WHERE id(e) = $id
                MATCH (aNovo:Alimento) WHERE id(aNovo) = $id_alimento
                MATCH (dNovo:Deposito) WHERE id(dNovo) = $id_deposito
                SET e.data_validade = $data_validade,
                    e.peso = $peso
                DELETE relAlimento
                DELETE relDeposito
                MERGE (e)-[:ESTOQUE_DO_ALIMENTO]->(aNovo)
                MERGE (e)-[:ESTÁ_NO_DEPÓSITO]->(dNovo)
                RETURN id(e) AS id, e, aNovo, dNovo
                `, {
                    id: parseInt(id),
                    id_alimento: parseInt(data.id_alimento),
                    data_validade: data.data_validade,
                    peso: data.peso,
                    id_deposito: parseInt(data.id_deposito)
                });
            }
            catch (error) {
                console.error('Erro ao atualizar estoque de alimento:', error);
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
                MATCH (e:EstoqueAlimento)-[r]->()
                WHERE id(e) = $id
                DELETE r, e
                `, { id: parseInt(id) });
                if (result.summary.counters.updates().nodesDeleted === 0) {
                    throw new Error('Estoque de alimento não encontrado');
                }
            }
            catch (error) {
                console.error('Erro ao deletar estoque de alimento:', error);
                throw error;
            }
            finally {
                yield session.close();
            }
        });
    }
}
exports.default = EstoqueAlimento;
