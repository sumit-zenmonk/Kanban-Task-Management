import { faker } from '@faker-js/faker';
import { dataSource, options } from './data-source';
import { UserEntity } from 'src/domain/entities/user.entity';

async function create() {
    dataSource.setOptions({
        ...options,
    });

    await dataSource.initialize();

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const _ of Array.from(Array(35).keys())) {
            await queryRunner.manager.save(UserEntity, {
                email: faker.internet.email(),
                image: faker.image.personPortrait(),
                name: faker.person.fullName(),
            });
        }

        await queryRunner.commitTransaction();
        console.info('✅ Seeded successfully');
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('❌ Something went wrong:', error);
    } finally {
        await queryRunner.release();
    }
}

void create();