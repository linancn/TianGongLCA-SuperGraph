import { PrismaClient } from '@prisma/client';
import Unit from '@/apollo/type/unit';
import Actor from '@/apollo/type/actor';
import Category from '@/apollo/type/category';
import Source from '@/apollo/type/source';
import UnitGroup from '@/apollo/type/unitgroup';
import Location from '@/apollo/type/location';
import Flow from '@/apollo/type/flow';
import FlowbyName from '@/apollo/type/flowbyname';
import Process from '@/apollo/type/process';
import ProcessbyName from '@/apollo/type/processbyname';
import FlowPropertybyId from '@/apollo/type/flowpropertybyid';
import LCIAMethod from '@/apollo/type/lciamethod';
import LCIACategorybyId from '@/apollo/type/lcicategorybyid';
import Documentation from '@/apollo/type/documentation';

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

const resolvers = {
  Query: {
    Flows() {
      return Flow();
    },
    Processes() {
      return Process();
    },
    LCIAMethods() {
      return LCIAMethod();
    },
    FlowByName(__: any, args: { name: string }) {
      return FlowbyName(args.name);
    },
    ProcessByName(__: any, args: { name: string }) {
      return ProcessbyName(args.name);
    },
  },
  FlowProperty: {
    async categories(parent) {
      return Category(parent.category_id);
    },
    async unit_group(parent) {
      return UnitGroup(parent.unit_group_id);
    },
  },
  Process: {
    async database(parent) {
      return { name: parent?.database, version: parent?.version, last_change: parent?.last_change };
    },
    async categories(parent) {
      return Category(parent.category_id);
    },
    async locations(parent) {
      return Location(parent.location_id);
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
      return Documentation(parent.id);
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
      return Category(parent.category_id);
    },
    async locations(parent) {
      return Location(parent.location_id);
    },
    async properties(parent) {
      return FlowPropertybyId(parent.flow_properties);
    },
    async unit(parent) {
      return Unit(parent.unit_id);
    },
  },
  Documentation: {
    async publication(parent) {
      return Source(parent.process_documentation_publication_id);
    },
    async documentor(parent) {
      return Actor(parent.process_documentation_data_documentor_id);
    },
    async generator(parent) {
      return Actor(parent.process_documentation_data_generator_id);
    },
    async owner(parent) {
      return Actor(parent.process_documentation_data_set_owner_id);
    },
    async reviewer(parent) {
      return Actor(parent.process_documentation_reviewer_id);
    },
  },
  DataQualitySystem: {
    async source(parent) {
      return Source(parent.source_id);
    },
  },
  Source: {
    async categories(parent) {
      return Category(parent.category_id);
    },
  },
  Actor: {
    async categories(parent) {
      return Category(parent.category_id);
    },
  },
  Unit: {
    async unit_group(parent) {
      return UnitGroup(parent.unit_group_id);
    },
  },
  UnitGroup: {
    async categories(parent) {
      return Category(parent.category_id);
    },
  },
  LCIA_Method: {
    async category(parent) {
      return Category(parent.category_id);
    },
    async impact_categories(parent) {
      const array: any[] = parent.impact_categories_id;
      return LCIACategorybyId(array);
    },
  },
};

export default resolvers;
