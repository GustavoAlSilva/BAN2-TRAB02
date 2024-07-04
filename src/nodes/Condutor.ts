import driver from '../config/database';
import { CondutorCreateType, CondutorUpdateType } from '../types/condutorTypes';

export default class Condutor {

    static async getAll() {

        const session = driver.session();

        try {

            const result = await session.run(
                `
                MATCH (c:Condutor)
                RETURN id(c) AS id, c
                `
            );

            return result.records.map(record => {

                const conductor = record.get('c').properties;
                const conductorId = record.get('id');

                return { id: conductorId, ...conductor };
            });
        } catch (error) {

            console.error('Erro ao buscar condutores:', error);

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
                MATCH (c:Condutor)
                WHERE id(c) = $id
                RETURN id(c) AS id, c
                `,
                { id: parseInt(id) }
            );

            if (result.records.length === 0) {

                throw new Error('Condutor não encontrado');
            }

            const record = result.records[0];
            const conductor = record.get('c').properties;
            const conductorId = record.get('id');

            return { id: conductorId, ...conductor };
        } catch (error) {

            console.error('Erro ao buscar condutor:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async create(data: CondutorCreateType) {

        const session = driver.session();

        try {

            await session.run(
                `
                MATCH (p:Pessoa)
                WHERE id(p) = $id
                MERGE (c:Condutor {cnh: $cnh})
                MERGE (c)-[:É_A_PESSOA]->(p)
                RETURN id(c) AS id, c
                `,
                { id: parseInt(data.id), cnh: data.cnh }
            );
        } catch (error) {

            console.error('Erro ao criar condutor:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async update(id: string, data: CondutorUpdateType) {

        const session = driver.session();

        try {

            await session.run(
                `
                MATCH (c:Condutor)-[rel:É_A_PESSOA]->(pAntiga:Pessoa)
                WHERE id(c) = $id
                MATCH (pNova:Pessoa)
                WHERE id(pNova) = $idPessoa
                SET c.cnh = $cnh
                DELETE rel
                MERGE (c)-[:É_A_PESSOA]->(pNova)
                RETURN id(c) AS id, c, pNova
                `,
                { id: parseInt(id), cnh: data.cnh, idPessoa: parseInt(data.id)}
            );
        } catch (error) {

            console.error('Erro ao atualizar condutor:', error);

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
                MATCH (c:Condutor)-[r]->()
                WHERE id(c) = $id
                DELETE r, c
                `,
                { id: parseInt(id) }
            );

            if (result.summary.counters.updates().nodesDeleted === 0) {

                throw new Error('Condutor não encontrado');
            }
        } catch (error) {

            console.error('Erro ao deletar condutor:', error);

            throw error;
        } finally {

            await session.close();
        }
    }
}
