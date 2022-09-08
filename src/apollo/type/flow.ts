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
async function Flow(start:number,end:number) {
  // Data form database
  const flows = await prisma.flows.findMany({
    skip: start,
    take: (end-start+1),
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
    orderBy: {
      data_name: 'asc',
    },
  });
  // Defining the new json array schema
  const resultJson_flow: any[] = [];
  // Fill in the data
  flows?.forEach(item => {
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
      // properties:'',
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
    const bufferArray: any[] = [];
    JSON.parse(JSON.stringify(item?.flow_properties)).map(i => {
      bufferArray.push(JSON.stringify({ flow_property: i['flowProperty']['@id']?.toString(), conversion_factor: Number(i['conversionFactor']) }));
    });
    result.flow_properties = bufferArray;
    result.location_id = item?.location_id;
    resultJson_flow.push(result);
  });
  return resultJson_flow;
}

export default Flow;
