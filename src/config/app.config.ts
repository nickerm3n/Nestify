export default () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      type: 'postgres',
      host: process.env.PGHOST,
      port: +process.env.PGPORT,
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      autoLoadEntities: true,
      synchronize: true,
    },
  };
};
