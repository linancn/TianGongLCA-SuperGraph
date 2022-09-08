import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function Location(location_id: string) {
  const location = await prisma.locations.findFirst({
    where: { id: location_id },
    select: {
      data_name: true,
      description: true,
      longitude: true,
      latitude: true,
      code: true,
      geometry_type: true,
      geometry_geometries: true,
    },
  });
  return {
    name: location?.data_name,
    code: location?.code,
    description: location?.description,
    longitude: location?.longitude,
    latitude: location?.latitude,
    geometry_type: location?.geometry_type,
    geometry_geometries: JSON.stringify(location?.geometry_geometries),
  };
}

export default Location;
