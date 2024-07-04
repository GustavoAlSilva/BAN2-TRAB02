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
class Deposito {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const session = database_1.default.session();
            try {
                const result = yield session.run(`
                MATCH (d:Deposito)
                RETURN id(d) AS id, d
                `);
                return result.records.map(record => {
                    const warehouse = record.get('d').properties;
                    const warehouseId = record.get('id');
                    return Object.assign({ id: warehouseId }, warehouse);
                });
            }
            catch (error) {
                console.error('Erro ao buscar depósitos:', error);
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
                MATCH (d:Deposito)
                WHERE id(d) = $id
                RETURN id(d) AS id, d
                `, { id: parseInt(id) });
                if (result.records.length === 0) {
                    throw new Error('Depósito não encontrado');
                }
                const record = result.records[0];
                const warehouse = record.get('d').properties;
                const warehouseId = record.get('id');
                return Object.assign({ id: warehouseId }, warehouse);
            }
            catch (error) {
                console.error('Erro ao buscar depósito:', error);
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
                WHERE id(p) = $id_pessoa
                CREATE (d:Deposito {
                    nome: $nome,
                    descricao: $descricao
                })
                MERGE (d)-[:DISPONIBILIZADO_POR]->(p)
                RETURN id(d) AS id, d
                `, { nome: data.nome, descricao: data.descricao, id_pessoa: parseInt(data.id_pessoa) });
            }
            catch (error) {
                console.error('Erro ao criar depósito:', error);
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
                MATCH (d:Deposito)-[rel:DISPONIBILIZADO_POR]->(pAntiga:Pessoa)
                WHERE id(d) = $id
                MATCH (pNova:Pessoa) WHERE id(pNova) = $id_pessoa
                SET d.nome = $nome,
                    d.descricao = $descricao
                DELETE rel
                MERGE (d)-[:DISPONIBILIZADO_POR]->(pNova)
                RETURN id(d) AS id, d, pNova
                `, { id: parseInt(id), nome: data.nome, descricao: data.descricao, id_pessoa: parseInt(data.id_pessoa) });
            }
            catch (error) {
                console.error('Erro ao atualizar depósito:', error);
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
                MATCH (d:Deposito)-[r]->()
                WHERE id(d) = $id
                DELETE r, d
                `, { id: parseInt(id) });
                if (result.summary.counters.updates().nodesDeleted === 0) {
                    throw new Error('Depósito não encontrado');
                }
            }
            catch (error) {
                console.error('Erro ao deletar depósito:', error);
                throw error;
            }
            finally {
                yield session.close();
            }
        });
    }
    static pegarPessoasAssociadasAosDepositosESuasCidades() {
        return __awaiter(this, void 0, void 0, function* () {
            const session = database_1.default.session();
            try {
                const result = yield session.run(`
                MATCH (d:Deposito)-[:DISPONIBILIZADO_POR]->(p:Pessoa)-[:RESIDE_EM]->(c:Cidade)
                RETURN id(d) AS idDeposito,
                       d.nome AS nomeDeposito,
                       p.nome AS nomePessoa,
                       c.nome AS nomeCidade
            `);
                return result.records.map(record => ({
                    idDeposito: record.get('idDeposito'),
                    nomeDeposito: record.get('nomeDeposito'),
                    nomePessoa: record.get('nomePessoa'),
                    nomeCidade: record.get('nomeCidade')
                }));
            }
            catch (error) {
                console.error('Erro ao buscar pessoas associadas aos depósitos e suas cidades:', error);
                throw error;
            }
            finally {
                yield session.close();
            }
        });
    }
}
exports.default = Deposito;
