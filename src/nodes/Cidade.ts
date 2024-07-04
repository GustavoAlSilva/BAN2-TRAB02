import driver from '../config/database';
import { CidadeCreateType, CidadeUpdateType } from '../types/cidadeTypes';

export default class Cidade {

    static async getAll() {

        const session = driver.session();

        try {

            const result = await session.run(
                `
                MATCH (c:Cidade)
                RETURN id(c) AS id, c
                `
            );

            return result.records.map(record => {

                const city = record.get('c').properties;
                const cityId = record.get('id');

                return { id: cityId, ...city };
            });
        } catch (error) {

            console.error('Erro ao buscar cidades:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async getOne(id: string) {

        const session = driver.session();

        try {

            const result = await session.run(
                `
                MATCH (c:Cidade)
                WHERE id(c) = $id
                RETURN id(c) AS id, c
                `,
                { id: parseInt(id) }
            );

            if (result.records.length === 0) {

                throw new Error('Cidade não encontrada');
            }

            const record = result.records[0];
            const city = record.get('c').properties;
            const cityId = record.get('id');

            return { id: cityId, ...city };
        } catch (error) {

            console.error('Erro ao buscar cidade:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async create(data: CidadeCreateType) {

        const session = driver.session();

        try {

            await session.run(
                `
                MATCH (e:Estado {uf: $estadoUf})
                MERGE (c:Cidade {nome: $nome})
                MERGE (c)-[:LOCALIZADO_EM]->(e)
                RETURN id(c) AS id, c
                `,
                { nome: data.nome, estadoUf: data.estadoUf }
            );
        } catch (error) {

            console.error('Erro ao criar cidade:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async update(id: string, data: CidadeUpdateType) {

        const session = driver.session();

        try {

            await session.run(
                `
                MATCH (c:Cidade)-[rel:LOCALIZADO_EM]->(eAntigo:Estado)
                WHERE id(c) = $id
                MATCH (eNovo:Estado {uf: $estadoUf})
                SET c.nome = $nome
                DELETE rel
                MERGE (c)-[:LOCALIZADO_EM]->(eNovo)
                RETURN id(c) AS id, c, eNovo
                `,
                { id: parseInt(id), nome: data.nome, estadoUf: data.estadoUf }
            );
        } catch (error) {

            console.error('Erro ao atualizar cidade:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async delete(id: string) {

        const session = driver.session();

        try {

            await session.run(
                `
                MATCH (c:Cidade)-[r]->()
                WHERE id(c) = $id
                DELETE r, c
                `,
                { id: parseInt(id) }
            );
        } catch (error) {

            console.error('Erro ao deletar cidade:', error);

            throw error;
        } finally {

            await session.close();
        }
    }
}
