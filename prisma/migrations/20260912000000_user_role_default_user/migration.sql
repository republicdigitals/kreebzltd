-- New accounts must default to the least-privileged role; ADMIN is granted explicitly.
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
