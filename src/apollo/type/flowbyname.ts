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

async function FlowbyName(flowname: string) {
  // Data form database
  const flowsbyname = await prisma.flows.findMany({
    where: { data_name: { contains: flowname } },
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
  // Defining the new json array schema
  const IresultJson_flow: any[] = [];
  // Fill in the data
  flowsbyname?.forEach(item => {
    // Defining json item
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
    result.name = item?.data_name;
    result.formula = item?.formula;
    result.cas_number = item?.cas;
    result.description = item?.description;
    result.synonyms = item?.synonyms;
    result.type = item?.flow_type;
    result.database = item?.database;
    result.flow_category_id = item?.category_id;
    // result.flow_category_name = item?.category_name;
    const bufferArray: any[] = [];
    JSON.parse(JSON.stringify(item?.flow_properties)).map(i => {
      bufferArray.push(
        JSON.stringify({ flow_property_id: i['flowProperty']['@id']?.toString(), conversion_factor: i['conversionFactor'].toString() }),
      );
    });
    result.flow_properties = bufferArray;
    result.location_id = item?.location_id;
    // result.amount = Number();
    // result.location_name = item?.location_name;
    IresultJson_flow.push(result);
  });
  return IresultJson_flow;
}

export default FlowbyName;
