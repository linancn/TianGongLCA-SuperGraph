import { PrismaClient, Prisma } from '@prisma/client';

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
async function flow() {
  // Data form database
  const flows = await prisma.flows.findMany({
    take: 200,
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
      // conversion_factor:NaN,
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

async function flowbyname(flowname: string) {
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

async function flowbyid(flows: []) {
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
async function process() {
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
async function processbyname(processname: string) {
  // Data form database
  const processbyname = await prisma.processes.findMany({
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
        let bufferArray_inflows: string[] = JSON.parse(
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
        let bufferArray_outflows: string[] = JSON.parse(
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
interface Iresult_flow_property {
  name: string;
  description: string;
  type: string;
  category_id: string;
  unit_group_id: string;
  // conversion_factor: string;
}

async function flow_property_by_id(flow_properties_json) {
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

interface Iresult_lcia_method {
  name: string;
  description: string;
  category_id: string;
  impact_categories_id: [];
  normalization_and_weighting_sets: string;
}
async function lcia_method() {
  const method = await prisma.lcia_methods.findMany({
    take: 10,
    select: {
      data_name: true,
      description: true,
      impact_categories: true,
      nw_sets: true,
      // for child
      category_id: true,
    },
  });
  const resultJson_lcia_method: any[] = [];
  method?.forEach(item => {
    const result: Iresult_lcia_method = {
      name: '',
      description: '',
      impact_categories_id: [],
      normalization_and_weighting_sets: '',
      category_id: '',
    };
    result.name = item?.data_name;
    result.description = item?.description;
    result.category_id = item?.category_id;
    result.impact_categories_id = JSON.parse(JSON.stringify(item?.impact_categories)).map(i => i['@id']);
    result.normalization_and_weighting_sets = JSON.stringify(item?.nw_sets);
    resultJson_lcia_method.push(result);
  });
  return resultJson_lcia_method;
}
interface Iresult_lcia_impact_category {
  name: string;
  description: string;
  reference_unit_name: string;
  impact_factors: string;
  // id:string;
}
async function lcia_impact_category_by_id(ids: any[]) {
  const impact_categories = await prisma.lcia_categories.findMany({
    select: { data_name: true, description: true, reference_unit_name: true, impact_factors: true },
    where: { id: { in: ids } },
  });
  const resultJson_impact_categories: any[] = [];
  impact_categories?.forEach(item => {
    // if (ids.includes(item?.id)){
    const result: Iresult_lcia_impact_category = {
      name: '',
      description: '',
      reference_unit_name: '',
      impact_factors: '',
      // id:'',
    };
    (result.name = item?.data_name),
      (result.description = item?.description),
      (result.reference_unit_name = item?.reference_unit_name),
      (result.impact_factors = JSON.stringify(item?.impact_factors)),
      // result.id = item?.id,
      resultJson_impact_categories.push(result);
    // }
  });
  return resultJson_impact_categories;
}

async function category(category_id: string) {
  // Data form database
  const categories = await prisma.categories.findFirst({
    where: { id: category_id },
    select: { data_name: true, category_name: true, category_path: true },
  });
  // Defining the new json array schema
  const category_class_list = categories.category_path as Prisma.JsonArray;
  const bufferArray: string[] = [];
  category_class_list?.forEach(item => {
    bufferArray.push(item?.toString());
  });
  return { name: categories.data_name, subclass: categories.category_name, class: bufferArray };
}

async function actor(actor_id: string) {
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

async function source(source_id: string) {
  const source = await prisma.sources.findFirst({
    where: { id: source_id },
    select: {
      data_name: true,
      description: true,
      year: true,
      text_reference: true,
      url: true,
      // for child
      category_id: true,
    },
  });
  return {
    name: source.data_name,
    description: source.description,
    year: source.year,
    text_reference: source.text_reference,
    url: source.url,
  };
}

async function location(location_id: string) {
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
    name: location.data_name,
    code: location.code,
    description: location.description,
    longitude: location.longitude,
    latitude: location.latitude,
    geometry_type: location.geometry_type,
    geometry_geometries: JSON.stringify(location.geometry_geometries),
  };
}

async function unit(unit_id: string) {
  const unit = await prisma.units.findFirst({
    where: { id: unit_id },
    select: {
      data_name: true,
      description: true,
      synonyms: true,
      conversion_factor: true,
      reference_unit: true,
      unit_groups_id: true,
    },
  });
  return {
    name: unit.data_name,
    description: unit.description,
    synonyms: unit.synonyms,
    conversion_factor: unit.conversion_factor,
    reference_unit: unit.reference_unit,
  };
}

async function unit_group(unit_group_id: string) {
  const unit_group = await prisma.unit_groups.findFirst({
    where: { id: unit_group_id },
    select: {
      data_name: true,
      description: true,
      category_id: true,
    },
  });
  return {
    name: unit_group.data_name,
    description: unit_group.description,
  };
}

const resolvers = {
  Query: {
    Flows() {
      return flow();
    },
    Processes() {
      return process();
    },
    LCIAMethods() {
      return lcia_method();
    },
    FlowByName(__, args) {
      return flowbyname(args.name);
    },
    ProcessByName(__, args) {
      return processbyname(args.name);
    },
  },
  FlowProperty: {
    async categories(parent) {
      return category(parent.category_id);
    },
    async unit_group(parent) {
      const unit_groups = await prisma.unit_groups.findFirst({
        where: { id: parent.unit_group_id },
        select: {
          data_name: true,
          description: true,
          category_id: true,
        },
      });
      return {
        name: unit_groups.data_name,
        description: unit_groups.description,
      };
    },
  },
  Process: {
    async database(parent) {
      return { name: parent?.database, version: parent?.version, last_change: parent?.last_change };
    },
    async categories(parent) {
      return category(parent.category_id);
    },
    async locations(parent) {
      return location(parent.location_id);
    },
    async valid_period(parent) {
      const period = await prisma.processes.findFirst({
        where: { id: parent.id ?? 'Null' },
        select: {
          process_documentation_valid_from: true,
          process_documentation_valid_until: true,
        },
      });
      return {
        time_from: JSON.stringify(period.process_documentation_valid_from),
        time_until: JSON.stringify(period.process_documentation_valid_until),
      };
    },
    async documentations(parent) {
      const documentation = await prisma.processes.findFirst({
        where: { id: parent.id ?? 'Null' },
        select: {
          process_documentation_time_description: true,
          process_documentation_technology_description: true,
          process_documentation_geography_description: true,
          process_documentation_project_description: true,
          process_documentation_inventory_method_description: true,
          process_documentation_modeling_constants_description: true,
          process_documentation_intended_application: true,
          process_documentation_restrictions_description: true,
          process_documentation_copyright: true,
          process_documentation_creation_date: true,
          process_documentation_review_details: true,
          process_documentation_sources: true,
          // for child
          process_documentation_data_documentor_id: true,
          process_documentation_data_generator_id: true,
          process_documentation_data_set_owner_id: true,
          process_documentation_reviewer_id: true,
          process_documentation_publication_id: true,
        },
      });
      return {
        time: documentation.process_documentation_time_description,
        technology: documentation.process_documentation_technology_description,
        geography: documentation.process_documentation_geography_description,
        project: documentation.process_documentation_project_description,
        inventory_method: documentation.process_documentation_inventory_method_description,
        modeling_constants: documentation.process_documentation_modeling_constants_description,
        intended_applications: documentation.process_documentation_intended_application,
        restrictions: documentation.process_documentation_restrictions_description,
        copyright: documentation.process_documentation_copyright,
        creation_date: JSON.stringify(documentation.process_documentation_creation_date),
        review_details: documentation.process_documentation_review_details,
        sources: JSON.stringify(documentation.process_documentation_sources),
      };
    },
    async data_quality_systems(parent) {
      const dq_system = await prisma.dq_systems.findFirst({
        where: { id: parent.exchange_dq_system_id },
        select: { data_name: true, description: true, has_uncertainties: true, indicators: true, source_id: true },
      });
      return {
        data_quality_system_name: dq_system.data_name,
        data_quality_system_description: dq_system.description,
        data_quality_system_has_uncertainty: dq_system.has_uncertainties,
        data_quality_system_indicators: dq_system.indicators,
      };
    },
    async data_descriptions(parent) {
      const data_description = await prisma.processes.findFirst({
        where: { id: parent.id ?? 'Null' },
        select: {
          process_documentation_data_collection_description: true,
          process_documentation_data_selection_description: true,
          process_documentation_data_treatment_description: true,
          process_documentation_completeness_description: true,
          process_documentation_sampling_description: true,
        },
      });
      return {
        collection: data_description.process_documentation_data_collection_description,
        selection: data_description.process_documentation_data_selection_description,
        treatment: data_description.process_documentation_data_treatment_description,
        sampling: data_description.process_documentation_sampling_description,
        completeness: data_description.process_documentation_completeness_description,
      };
    },
    async inflows(parent) {
      return flowbyid(parent.inflows);
    },
    async outflows(parent) {
      return flowbyid(parent.outflows);
    },
  },
  Flow: {
    async categories(parent) {
      // console.log(parent.inflows)
      return category(parent.category_id);
    },
    async locations(parent) {
      return location(parent.location_id);
    },
    async properties(parent) {
      return flow_property_by_id(parent.flow_properties);
    },
    async unit(parent) {
      return unit(parent.unit_id)
    },
  },
  Documentation: {
    async publication(parent) {
      return source(parent.process_documentation_publication_id);
    },
    async documentor(parent) {
      return actor(parent.process_documentation_data_documentor_id);
    },
    async generator(parent) {
      return actor(parent.process_documentation_data_generator_id);
    },
    async owner(parent) {
      return actor(parent.process_documentation_data_set_owner_id);
    },
    async reviewer(parent) {
      return actor(parent.process_documentation_reviewer_id);
    },
  },
  DataQualitySystem: {
    async source(parent) {
      return source(parent.source_id);
    },
  },
  Source: {
    async categories(parent) {
      return category(parent.category_id);
    },
  },
  Actor: {
    async categories(parent) {
      return category(parent.category_id);
    },
  },
  Unit: {
    async unit_group(parent) {
      return unit_group(parent.unit_group_id)
    }
  },
  UnitGroup: {
    async categories(parent) {
      return category(parent.category_id);
    },
  },
  LCIA_Method: {
    async category(parent) {
      return category(parent.category_id);
    },
    async impact_categories(parent) {
      const array: any[] = parent.impact_categories_id;
      return lcia_impact_category_by_id(array);
    },
  },
};

export default resolvers;
