import app from './app';
import { env } from './config/env';
import { checkDbConnection } from './config/db';

const server = app.listen(env.PORT, async () => {
  console.log('====================================================');
  console.log(`🚀 Agenda-MEI Back-End rodando em: http://localhost:${env.PORT}`);
  console.log(`📡 CORS permitido para: ${env.CORS_ORIGIN}`);
  console.log(`🩺 Health check disponível em: http://localhost:${env.PORT}/api/health`);
  console.log('====================================================');

  // Verificar status inicial do PostgreSQL
  const dbStatus = await checkDbConnection();
  if (dbStatus.isConnected) {
    console.log('✅ Banco de dados: PostgreSQL conectado com sucesso!');
  } else {
    console.log('⚠️  Banco de dados: PostgreSQL desconectado ou credenciais pendentes.');
    console.log(`ℹ️  Mensagem: ${dbStatus.message}`);
    console.log('💡 Dica: Configure o arquivo .env com seu DB_PASSWORD e execute schema.sql para ativar a persistência total.');
  }
  console.log('====================================================');
});

// Tratamento de finalização graciosa
const gracefulShutdown = () => {
  console.log('\n[Servidor] Encerrando servidor HTTP...');
  server.close(() => {
    console.log('[Servidor] Servidor HTTP encerrado com segurança.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
