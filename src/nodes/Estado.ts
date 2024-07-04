import driver from '../config/database';
import { EstadoCreateType, EstadoUpdateType } from '../types/estadoTypes';

export default class Estado {

    static async getAll() {

        const session = driver.session();

        try {

            const result = await session.run('MATCH (e:Estado) RETURN e');

            return result.records.map(record => record.get('e').properties);
        } catch (error) {

            console.error('Erro ao buscar estados:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async getOne(uf: string) {

        const session = driver.session();

        try {

            const result = await session.run(
                'MATCH (e:Estado {uf: $uf}) RETURN e',
                { uf }
            );

            if (result.records.length === 0) {

                throw new Error('Estado não encontrado');
            }

            return result.records[0].get('e').properties;
        } catch (error) {

            console.error('Erro ao buscar estado:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async create(data: EstadoCreateType) {

        const session = driver.session();

        try {

            await session.run(
                `
                MERGE (e:Estado {uf: $uf})
                ON CREATE SET e.nome = $nome
                RETURN e
                `,
                { uf: data.uf, nome: data.nome }
            );
        } catch (error) {

            console.error('Erro ao criar estado:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async update(uf: string, data: EstadoUpdateType) {

        const session = driver.session();

        try {

            await session.run(
                `
                MATCH (e:Estado {uf: $uf})
                SET e.nome = $nome
                RETURN e
                `,
                { uf, nome: data.nome }
            );
        } catch (error) {

            console.error('Erro ao atualizar estado:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async delete(uf: string) {

        const session = driver.session();

        try {

            const result = await session.run(
                'MATCH (e:Estado {uf: $uf}) DELETE e',
                { uf }
            );

            if (result.summary.counters.updates().nodesDeleted === 0) {

                throw new Error('Estado não encontrado');
            }
        } catch (error) {

            console.error('Erro ao deletar estado:', error);

            throw error;
        } finally {

            await session.close();
        }
    }
}
