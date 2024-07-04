import driver from '../config/database';
import { AlimentoCreateType, AlimentoUpdateType } from '../types/alimentoTypes';

export default class Alimento {

    static async getAll() {

        const session = driver.session();

        try {

            const result = await session.run(
                `
                MATCH (a:Alimento)
                RETURN id(a) AS id, a
                `
            );

            return result.records.map(record => {

                const food = record.get('a').properties;
                const foodId = record.get('id');

                return { id: foodId, ...food };
            });
        } catch (error) {

            console.error('Erro ao buscar alimentos:', error);

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
                MATCH (a:Alimento)
                WHERE id(a) = $id
                RETURN id(a) AS id, a
                `,
                { id: parseInt(id) }
            );

            if (result.records.length === 0) {

                throw new Error('Alimento não encontrado');
            }

            const record = result.records[0];
            const food = record.get('a').properties;
            const foodId = record.get('id');

            return { id: foodId, ...food };
        } catch (error) {

            console.error('Erro ao buscar alimento:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async create(data: AlimentoCreateType) {

        const session = driver.session();

        try {

            await session.run(
                `CREATE (a:Alimento {
                    nome: $nome,
                    descricao: $descricao
                }) RETURN id(a) AS id, a`,
                { nome: data.nome, descricao: data.descricao }
            );
        } catch (error) {

            console.error('Erro ao criar alimento:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async update(id: string, data: AlimentoUpdateType) {

        const session = driver.session();

        try {

            await session.run(
                `
                MATCH (a:Alimento)
                WHERE id(a) = $id
                SET a.nome = $nome, a.descricao = $descricao
                RETURN id(a) AS id, a
                `,
                { id: parseInt(id), nome: data.nome, descricao: data.descricao }
            );
        } catch (error) {

            console.error('Erro ao atualizar alimento:', error);

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
                MATCH (a:Alimento)
                WHERE id(a) = $id
                DELETE a
                `,
                { id: parseInt(id) }
            );
        } catch (error) {

            console.error('Erro ao deletar alimento:', error);

            throw error;
        } finally {

            await session.close();
        }
    }
}
