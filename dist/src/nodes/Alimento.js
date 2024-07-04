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
class Alimento {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const session = database_1.default.session();
            try {
                const result = yield session.run(`
                MATCH (a:Alimento)
                RETURN id(a) AS id, a
                `);
                return result.records.map(record => {
                    const food = record.get('a').properties;
                    const foodId = record.get('id');
                    return Object.assign({ id: foodId }, food);
                });
            }
            catch (error) {
                console.error('Erro ao buscar alimentos:', error);
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
                MATCH (a:Alimento)
                WHERE id(a) = $id
                RETURN id(a) AS id, a
                `, { id: parseInt(id) });
                if (result.records.length === 0) {
                    throw new Error('Alimento não encontrado');
                }
                const record = result.records[0];
                const food = record.get('a').properties;
                const foodId = record.get('id');
                return Object.assign({ id: foodId }, food);
            }
            catch (error) {
                console.error('Erro ao buscar alimento:', error);
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
                yield session.run(`CREATE (a:Alimento {
                    nome: $nome,
                    descricao: $descricao
                }) RETURN id(a) AS id, a`, { nome: data.nome, descricao: data.descricao });
            }
            catch (error) {
                console.error('Erro ao criar alimento:', error);
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
                MATCH (a:Alimento)
                WHERE id(a) = $id
                SET a.nome = $nome, a.descricao = $descricao
                RETURN id(a) AS id, a
                `, { id: parseInt(id), nome: data.nome, descricao: data.descricao });
            }
            catch (error) {
                console.error('Erro ao atualizar alimento:', error);
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
                MATCH (a:Alimento)
                WHERE id(a) = $id
                DELETE a
                `, { id: parseInt(id) });
            }
            catch (error) {
                console.error('Erro ao deletar alimento:', error);
                throw error;
            }
            finally {
                yield session.close();
            }
        });
    }
}
exports.default = Alimento;
