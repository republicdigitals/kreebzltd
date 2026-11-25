CREATE TABLE IF NOT EXISTS "ServerConfig" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServerConfig_pkey" PRIMARY KEY ("key")
);
