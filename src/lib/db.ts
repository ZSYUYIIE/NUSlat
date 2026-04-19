import mongoose from "mongoose";
import dns from "node:dns";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache;
}

let cached: MongooseCache = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

const PUBLIC_DNS_FALLBACK = ["8.8.8.8", "1.1.1.1"];

function isSrvLookupRefused(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return message.includes("querysrv") && message.includes("econnrefused");
}

function parseConfiguredDnsServers(): string[] {
  const raw = process.env.MONGODB_DNS_SERVERS;
  if (!raw) {
    return [];
  }

  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isLoopbackResolver(server: string): boolean {
  return server === "127.0.0.1" || server === "::1";
}

function shouldUseFallbackDns(currentServers: string[]): boolean {
  if (currentServers.length === 0) {
    return false;
  }

  return currentServers.every(isLoopbackResolver);
}

async function connectWithDnsRetry(
  uri: string,
  opts: Parameters<typeof mongoose.connect>[1]
) {
  try {
    return await mongoose.connect(uri, opts);
  } catch (error) {
    if (!isSrvLookupRefused(error)) {
      throw error;
    }

    const configuredDnsServers = parseConfiguredDnsServers();
    const currentServers = dns.getServers();
    const retryServers =
      configuredDnsServers.length > 0
        ? configuredDnsServers
        : shouldUseFallbackDns(currentServers)
        ? PUBLIC_DNS_FALLBACK
        : [];

    if (retryServers.length === 0) {
      throw error;
    }

    try {
      dns.setServers(retryServers);
    } catch {
      throw error;
    }

    return mongoose.connect(uri, opts);
  }
}

export async function connectDB(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI as string;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = connectWithDnsRetry(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
