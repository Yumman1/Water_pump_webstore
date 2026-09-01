-- City-based delivery fees for orders outside the installation service city.
CREATE TABLE "DeliveryCity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryCity_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DeliveryCity_name_key" ON "DeliveryCity"("name");
