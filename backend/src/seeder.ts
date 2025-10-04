import { Client } from 'pg';

export async function seedDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'eventlook',
  });

  await client.connect();

  try {
    // Vytvoř tabulku events pokud neexistuje
    await client.query(`
      CREATE TABLE IF NOT EXISTS event (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        place VARCHAR NOT NULL,
        "startDate" TIMESTAMP NOT NULL,
        "ticketCount" INTEGER NOT NULL,
        "ticketPrice" INTEGER NOT NULL
      )
    `);

    // Zkontroluj, zda už existují data
    const result = await client.query('SELECT COUNT(*) FROM event');
    const count = parseInt(result.rows[0].count);

    if (count > 0) {
      console.log('Database already has data, skipping seed...');
      return;
    }

    // Vložit testovací data
    const events = [
      {
        name: 'Tech Conference 2024',
        place: 'Prague Convention Centre',
        startDate: '2024-06-15',
        ticketCount: 100,
        ticketPrice: 299,
      },
      {
        name: 'Music Festival',
        place: 'Letná Park',
        startDate: '2024-07-20',
        ticketCount: 500,
        ticketPrice: 150,
      },
      {
        name: 'Art Exhibition',
        place: 'National Gallery',
        startDate: '2024-08-10',
        ticketCount: 50,
        ticketPrice: 25,
      },
    ];

    for (const event of events) {
      await client.query(
        'INSERT INTO event (name, place, "startDate", "ticketCount", "ticketPrice") VALUES ($1, $2, $3, $4, $5)',
        [
          event.name,
          event.place,
          event.startDate,
          event.ticketCount,
          event.ticketPrice,
        ],
      );
    }

    console.log('Database seeded successfully!');
  } finally {
    await client.end();
  }
}

// Spusť seeder pokud je soubor spuštěn přímo
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Database seeded successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error seeding database:', error);
      process.exit(1);
    });
}
