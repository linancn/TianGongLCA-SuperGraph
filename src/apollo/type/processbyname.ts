import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Iresult_process {
  id: string;
  category_id: string;
  location_id: string;
  name: string;
  exchange_dq_system_id: string;
  description: string;
  type: string;
  allocation_method: string;
  allocation_factors: string;
  // exchanged_flows: string;
  parameters: string;
  database: string;
  version: string;
  last_change: string;
  // flow:string[];
  // flows: any[];
  inflows: any[];
  outflows: any[];
}
async function ProcessbyName(processname: string, start: number, end: number) {
  // Data form database
  console.log(start,end)
  const processbyname = await prisma.processes.findMany({
    skip: start,
    take: (end-start+1),
    where: {
      data_name: {
        contains: processname,
      },
    },
    select: {
      id: true,
      category_id: true,
      location_id: true,
      exchange_dq_system_id: true,
      data_name: true,
      description: true,
      process_type: true,
      default_allocation_method: true,
      allocation_factors: true,
      exchanges: true,
      parameters: true,
      database: true,
      version: true,
      last_change: true,
    },
  });
  // Defining the new json array schema
  const Iresult_process: any[] = [];
  const Iresult_inflows: any[] = [];
  const Iresult_outflows: any[] = [];
  // Fill in the data
  processbyname?.forEach(item => {
    // Defining json item
    const result: Iresult_process = {
      id: '',
      category_id: '',
      location_id: '',
      exchange_dq_system_id: '',
      name: '',
      description: '',
      type: '',
      allocation_method: '',
      allocation_factors: '',
      // exchanged_flows: '',
      parameters: '',
      database: '',
      version: '',
      last_change: '',
      inflows: [],
      outflows: [],
    };
    result.id = item?.id;
    result.category_id = item?.category_id;
    result.location_id = item?.location_id;
    result.exchange_dq_system_id = item?.exchange_dq_system_id;
    result.name = item?.data_name;
    result.description = item?.description;
    result.type = item?.process_type;
    result.database = item?.database;
    result.allocation_method = item?.default_allocation_method;
    result.database = item?.database;
    result.version = item?.version;
    result.last_change = JSON.stringify(item?.last_change);
    result.allocation_factors = JSON.stringify(item?.allocation_factors);
    // result.exchanged_flows = JSON.stringify(item?.exchanges);
    result.parameters = JSON.stringify(item?.parameters);
    // result.flow = JSON.parse(JSON.stringify(item?.exchanges)).map(i => {
    //   return {
    //       flow_id: i['flow']['@id'],
    //       // input: i['input'],
    //       amount: i['amount'],
    //       unit_id: i['unit']['@id'],
    //       flow_property_id: i['flowProperty']['@id'],
    //     }})
    JSON.parse(JSON.stringify(item?.exchanges)).map(i => {
      if (i['input'] == true) {
        const bufferArray_inflows: string[] = JSON.parse(
          JSON.stringify({
            flow_id: i['flow']['@id'],
            // input: i['input'],
            amount: i['amount'],
            unit_id: i['unit']['@id'],
            // flow_property_id: i['flowProperty']['@id'],
          }),
        );
        Iresult_inflows.push(bufferArray_inflows);
      } else if (i['input'] == false) {
        const bufferArray_outflows: string[] = JSON.parse(
          JSON.stringify({
            flow_id: i['flow']['@id'],
            // input: i['input'],
            amount: i['amount'],
            unit_id: i['unit']['@id'],
            // flow_property_id: i['flowProperty']['@id'],
          }),
        );
        Iresult_outflows.push(bufferArray_outflows);
      }
    });
    result.inflows = Iresult_inflows;
    result.outflows = Iresult_outflows;
    // console.log(result.flows);
    // console.log(result.inflows);
    // console.log(result.outflows);
    Iresult_process.push(result);
  });
  return Iresult_process;
}

export default ProcessbyName;
