import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  let url = process.env.DATABASE_URL;
  // Automatically fix Supabase connection pooling URL if missing parameters
  if (url && url.includes('pooler.supabase.com') && url.includes(':6543') && !url.includes('pgbouncer=true')) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}pgbouncer=true&connection_limit=1`;
  }

  return new PrismaClient({
    datasources: {
      db: {
        url
      }
    }
  })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
