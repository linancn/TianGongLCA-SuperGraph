import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Iresult_flow {
  name: string;
  description: string;
  cas_number: string;
  formula: string;
  synonyms: string;
  type: string;
  database: string;
  flow_category_id: string;
  flow_properties: any[];
  location_id: string;
  amount: string;
  unit_id: string;
}

async function FlowbyId(flows: []) {
  return flows.map(async item => {
    const flow = await prisma.flows.findFirst({
      where: { id: item['flow_id'] },
      select: {
        data_name: true,
        description: true,
        formula: true,
        cas: true,
        synonyms: true,
        flow_type: true,
        database: true,
        category_id: true,
        category_name: true,
        flow_properties: true,
        location_id: true,
        location_name: true,
      },
    });
    const result: Iresult_flow = {
      name: '',
      description: '',
      cas_number: '',
      formula: '',
      synonyms: '',
      type: '',
      database: '',
      flow_category_id: '',
      location_id: '',
      flow_properties: [],
      amount: '',
      unit_id: '',
    };
    result.name = flow?.data_name;
    result.formula = flow?.formula;
    result.cas_number = flow?.cas;
    result.description = flow?.description;
    result.synonyms = flow?.synonyms;
    result.type = flow?.flow_type;
    result.database = flow?.database;
    result.flow_category_id = flow?.category_id;
    // result.flow_category_name = item?.category_name;
    const bufferArray: any[] = [];
    JSON.parse(JSON.stringify(flow?.flow_properties)).map(i => {
      bufferArray.push(
        JSON.stringify({ flow_property_id: i['flowProperty']['@id']?.toString(), conversion_factor: i['conversionFactor'].toString() }),
      );
    });
    result.flow_properties = bufferArray;
    result.location_id = flow?.location_id;
    result.amount = item['amount'];
    result.unit_id = item['unit_id'];
    return result;
  });
}

export default FlowbyId;
