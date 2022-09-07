import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function Documentation(documentation_id: string) {
  const documentation = await prisma.processes.findFirst({
    where: { id: documentation_id ?? 'Null' },
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
}

export default Documentation;
