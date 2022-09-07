import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Iresult_flow_property {
  name: string;
  description: string;
  type: string;
  category_id: string;
  unit_group_id: string;
  // conversion_factor: string;
}

async function FlowPropertybyId(flow_properties_json) {
  return flow_properties_json?.map(async i => {
    const properties = await prisma.flow_properties.findFirst({
      select: {
        data_name: true,
        description: true,
        flow_property_type: true,
        category_id: true,
        unit_group_id: true,
      },
      where: { id: JSON.parse(i).flow_property_id },
    });
    const result: Iresult_flow_property = {
      name: '',
      description: '',
      type: '',
      category_id: '',
      unit_group_id: '',
      // conversion_factor: '',
    };
    result.name = properties?.data_name;
    result.description = properties?.description;
    result.type = properties?.flow_property_type;
    result.unit_group_id = properties?.unit_group_id;
    result.category_id = properties?.category_id;
    // result.conversion_factor = JSON.parse(i).conversion_factor;
    return result;
  });
}

export default FlowPropertybyId;
