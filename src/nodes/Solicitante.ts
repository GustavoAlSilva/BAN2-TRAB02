import driver from '../config/database';
import { SolicitanteCreateType, SolicitanteUpdateType } from '../types/solicitanteTypes';

export default class Solicitante {

    static async getAll() {

        const session = driver.session();

        try {

            const result = await session.run(
                `
                MATCH (s:Solicitante)
                RETURN id(s) AS id, s
                `
            );

            return result.records.map(record => {

                const requester = record.get('s').properties;
                const requesterId = record.get('id');

                return { id: requesterId, ...requester };
            });
        } catch (error) {

            console.error('Erro ao buscar solicitantes:', error);

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
                MATCH (s:Solicitante)
                WHERE id(s) = $id
                RETURN id(s) AS id, s
                `,
                { id: parseInt(id) }
            );

            if (result.records.length === 0) {

                throw new Error('Solicitante não encontrado');
            }

            const record = result.records[0];
            const requester = record.get('s').properties;
            const requesterId = record.get('id');

            return { id: requesterId, ...requester };
        } catch (error) {

            console.error('Erro ao buscar solicitante:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async create(data: SolicitanteCreateType) {

        const session = driver.session();

        try {

            await session.run(
                `
                MATCH (p:Pessoa)
                WHERE id(p) = $id
                CREATE (s:Solicitante {quantidade_dependentes: $quantidade_dependentes})
                MERGE (s)-[:É_A_PESSOA]->(p)
                RETURN id(s) AS id, s
                `,
                { id: parseInt(data.id), quantidade_dependentes: data.quantidade_dependentes }
            );
        } catch (error) {

            console.error('Erro ao criar solicitante:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async update(id: string, data: SolicitanteUpdateType) {

        const session = driver.session();

        try {

            await session.run(
                `
                MATCH (s:Solicitante)-[rel:É_A_PESSOA]->(pAntiga:Pessoa)
                WHERE id(s) = $id
                MATCH (pNova:Pessoa)
                WHERE id(pNova) = $idPessoa
                SET s.quantidade_dependentes = $quantidade_dependentes
                DELETE rel
                MERGE (s)-[:É_A_PESSOA]->(pNova)
                RETURN id(s) AS id, s, pNova
                `,
                { id: parseInt(id), quantidade_dependentes: data.quantidade_dependentes, idPessoa: parseInt(data.id)}
            );
        } catch (error) {

            console.error('Erro ao atualizar solicitante:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async delete(id: string) {

        const session = driver.session();

        try {

            const result = await session.run(
                `
                MATCH (s:Solicitante)-[r]->()
                WHERE id(s) = $id
                DELETE r, s
                `,
                { id: parseInt(id) }
            );

            if (result.summary.counters.updates().nodesDeleted === 0) {

                throw new Error('Solicitante não encontrado');
            }
        } catch (error) {

            console.error('Erro ao deletar solicitante:', error);

            throw error;
        } finally {

            await session.close();
        }
    }
}
