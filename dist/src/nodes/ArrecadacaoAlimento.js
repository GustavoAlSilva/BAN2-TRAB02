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
class ArrecadacaoAlimento {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const session = database_1.default.session();
            try {
                const result = yield session.run(`
                MATCH (aa:ArrecadacaoAlimento)
                RETURN id(aa) AS id, aa
                `);
                return result.records.map(record => {
                    const foodCollection = record.get('aa').properties;
                    const foodCollectionId = record.get('id');
                    return Object.assign({ id: foodCollectionId }, foodCollection);
                });
            }
            catch (error) {
                console.error('Erro ao buscar arrecadações de alimento:', error);
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
                MATCH (aa:ArrecadacaoAlimento)
                WHERE id(aa) = $id
                RETURN id(aa) AS id, aa
                `, { id: parseInt(id) });
                if (result.records.length === 0) {
                    throw new Error('Arrecadação de alimento não encontrada');
                }
                const record = result.records[0];
                const foodCollection = record.get('aa').properties;
                const foodCollectionId = record.get('id');
                return Object.assign({ id: foodCollectionId }, foodCollection);
            }
            catch (error) {
                console.error('Erro ao buscar arrecadação de alimento:', error);
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
                MATCH (p:Pessoa)
                WHERE id(p) = $id_pessoa
                MATCH (c:Condutor)
                WHERE id(c) = $id_condutor
                MATCH (d:Deposito)
                WHERE id(d) = $id_deposito
                CREATE (aa:ArrecadacaoAlimento {
                    peso: $peso,
                    data_validade: $data_validade
                })
                MERGE (aa)-[:ALIMENTO_ARRECADADO]->(a)
                MERGE (aa)-[:PESSOA_QUE_DOOU]->(p)
                MERGE (aa)-[:PEGO_PELO_CONDUTOR]->(c)
                MERGE (aa)-[:ESTÁ_NO_DEPÓSITO]->(d)
                RETURN id(aa) AS id, aa
                `, {
                    id_alimento: parseInt(data.id_alimento),
                    data_validade: data.data_validade,
                    peso: data.peso,
                    id_pessoa: parseInt(data.id_pessoa),
                    id_condutor: parseInt(data.id_condutor),
                    id_deposito: parseInt(data.id_deposito)
                });
            }
            catch (error) {
                console.error('Erro ao criar arrecadação de alimento:', error);
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
                MATCH (aa:ArrecadacaoAlimento)-[relAlimento:ALIMENTO_ARRECADADO]->(aAntigo:Alimento)
                WHERE id(aa) = $id
                MATCH (aa:ArrecadacaoAlimento)-[relPessoa:PESSOA_QUE_DOOU]->(pAntiga:Pessoa)
                WHERE id(aa) = $id
                MATCH (aa:ArrecadacaoAlimento)-[relCondutor:PEGO_PELO_CONDUTOR]->(cAntigo:Condutor)
                WHERE id(aa) = $id
                MATCH (aa:ArrecadacaoAlimento)-[relDeposito:ESTÁ_NO_DEPÓSITO]->(dAntigo:Deposito)
                WHERE id(aa) = $id
                MATCH (aNovo:Alimento) WHERE id(aNovo) = $id_alimento
                MATCH (pNova:Pessoa) WHERE id(pNova) = $id_pessoa
                MATCH (cNovo:Condutor) WHERE id(cNovo) = $id_condutor
                MATCH (dNovo:Deposito) WHERE id(dNovo) = $id_deposito
                SET aa.peso = $peso, aa.data_validade = $data_validade
                DELETE relAlimento
                DELETE relPessoa
                DELETE relCondutor
                DELETE relDeposito
                MERGE (aa)-[:ALIMENTO_ARRECADADO]->(aNovo)
                MERGE (aa)-[:PESSOA_QUE_DOOU]->(pNova)
                MERGE (aa)-[:PEGO_PELO_CONDUTOR]->(cNovo)
                MERGE (aa)-[:ESTÁ_NO_DEPÓSITO]->(dNovo)
                RETURN id(aa) AS id, aa
                `, {
                    id: parseInt(id),
                    id_alimento: parseInt(data.id_alimento),
                    data_validade: data.data_validade,
                    peso: data.peso,
                    id_pessoa: parseInt(data.id_pessoa),
                    id_condutor: parseInt(data.id_condutor),
                    id_deposito: parseInt(data.id_deposito)
                });
            }
            catch (error) {
                console.error('Erro ao atualizar arrecadação de alimento:', error);
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
                MATCH (aa:ArrecadacaoAlimento)-[r]->()
                WHERE id(aa) = $id
                DELETE r, aa
                `, { id: parseInt(id) });
                if (result.summary.counters.updates().nodesDeleted === 0) {
                    throw new Error('Arrecadação de alimento não encontrada');
                }
            }
            catch (error) {
                console.error('Erro ao deletar arrecadação de alimento:', error);
                throw error;
            }
            finally {
                yield session.close();
            }
        });
    }
    static pegarTotalArrecadadoPorAlimento() {
        return __awaiter(this, void 0, void 0, function* () {
            const session = database_1.default.session();
            try {
                const result = yield session.run(`
                MATCH (aa:ArrecadacaoAlimento)-[:ALIMENTO_ARRECADADO]->(a:Alimento)
                WITH a.id AS idAlimento, a.nome AS nomeAlimento, SUM(aa.peso) AS pesoTotalArrecadado
                RETURN idAlimento AS "ID Alimento",
                   nomeAlimento AS "Nome Alimento",
                   pesoTotalArrecadado AS "Peso Total Arrecadado"
            `);
                return result.records.map(record => ({
                    idAlimento: record.get('idAlimento'),
                    nomeAlimento: record.get('nomeAlimento'),
                    pesoTotalArrecadado: record.get('pesoTotalArrecadado').toNumber()
                }));
            }
            catch (error) {
                console.error('Erro ao obter o total arrecadado por alimento:', error);
                throw error;
            }
            finally {
                yield session.close();
            }
        });
    }
}
exports.default = ArrecadacaoAlimento;
