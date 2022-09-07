import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function Actor(actor_id: string) {
  // Data form database
  const actor = await prisma.actors.findFirst({
    where: { id: actor_id },
    select: {
      data_name: true,
      description: true,
      telefax: true,
      website: true,
      address: true,
      email: true,
      telephone: true,
      country: true,
      city: true,
      zip_code: true,
      // for child
      category_id: true,
    },
  });
  return {
    name: actor.data_name,
    description: actor.description,
    telefax: actor.telefax,
    website: actor.website,
    address: actor.address,
    email: actor.email,
    telephone: actor.telephone,
    country: actor.country,
    city: actor.city,
    zip_code: actor.zip_code,
  };
}

export default Actor;
