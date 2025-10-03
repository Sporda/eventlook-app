import { DataSource } from 'typeorm';
import { Event } from './entities/event.entity';

export async function seedDatabase() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'eventlook',
    entities: [Event],
    synchronize: true,
  });

  await dataSource.initialize();

  const eventRepository = dataSource.getRepository(Event);

  // Vytvoř testovací eventy
  const events = [
    {
      name: 'Tech Conference 2024',
      place: 'Prague Convention Centre',
      startDate: new Date('2024-06-15'),
      ticketCount: 100,
      ticketPrice: 299,
    },
    {
      name: 'Music Festival',
      place: 'Letná Park',
      startDate: new Date('2024-07-20'),
      ticketCount: 500,
      ticketPrice: 150,
    },
    {
      name: 'Art Exhibition',
      place: 'National Gallery',
      startDate: new Date('2024-08-10'),
      ticketCount: 50,
      ticketPrice: 25,
    },
  ];

  for (const eventData of events) {
    const event = eventRepository.create(eventData);
    await eventRepository.save(event);
  }

  console.log('Database seeded successfully!');
  await dataSource.destroy();
}

// Spusť seeder pokud je soubor spuštěn přímo
if (require.main === module) {
  seedDatabase().catch(console.error);
}
