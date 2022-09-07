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
async function Process() {
  // Data form database
  const process = await prisma.processes.findMany({
    take: 88,
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
  // Fill in the data
  process?.forEach(item => {
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
      // flow: [''],
      inflows: [],
      outflows: [],
      // flows: []
    };
    result.id = item?.id;
    result.category_id = item?.category_id;
    result.location_id = item?.location_id;
    result.exchange_dq_system_id = item?.exchange_dq_system_id;
    result.name = item?.data_name;
    result.description = item?.description;
    result.type = item?.process_type;
    result.database = item?.database;
    result.version = item?.version;
    result.last_change = JSON.stringify(item?.last_change);
    result.allocation_method = item?.default_allocation_method;
    result.allocation_factors = JSON.stringify(item?.allocation_factors);
    // result.exchanged_flows = JSON.stringify(item?.exchanges);
    result.parameters = JSON.stringify(item?.parameters);
    Iresult_process.push(result);
  });
  return Iresult_process;
}

export default Process;
